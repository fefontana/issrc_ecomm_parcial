// api.js centraliza todas las llamadas al backend usando axios.

import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const api = axios.create({ baseURL: API_URL });

// Agrega el access token en el header Authorization de cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Respuestas: devolvemos "data" si existe, y manejamos los errores de forma uniforme.
api.interceptors.response.use(
  (response) =>
    response.data.data !== undefined ? response.data.data : response.data,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    // Si el access token expiró (401), pedimos uno nuevo con el refresh token
    // y repetimos la petición una sola vez.
    if (
      error.response?.status === 401 &&
      refreshToken &&
      !original._reintento &&
      !original.url.includes("/auth/")
    ) {
      original._reintento = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        localStorage.setItem("token", data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        // Si el refresh falla, seguimos con el error original.
      }
    }

    return Promise.reject(
      new Error(error.response?.data?.mensaje || error.message),
    );
  },
);

// ---- Autenticación ----
export const loginClient = (email, password) =>
  api.post("/auth/client/login", { email, password });
export const loginAdmin = (email, password) =>
  api.post("/auth/admin/login", { email, password });
export const refreshSession = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });
export const logoutSession = (refreshToken) =>
  api.post("/auth/logout", { refreshToken });

// ---- Cliente y administración ----
export const getPerfil = () => api.get("/client/perfil");
export const getMetricas = () => api.get("/admin/metricas");
export const getUsuarios = () => api.get("/admin/usuarios");
export const getReportes = () => api.get("/admin/reportes");

// ---- Productos ----
export const getProducts = (params) => api.get("/products", { params });
export const createProduct = (body) => api.post("/products", body);
export const updateProduct = (id, body) => api.put(`/products/${id}`, body);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
