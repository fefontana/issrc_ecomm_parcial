// AuthContext.jsx provee la sesión (cliente o administrador) a toda la aplicación.
// Solo puede haber UNA sesión activa a la vez: nunca se mezclan tokens de cliente y de admin.

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginClient as loginClientApi,
  loginAdmin as loginAdminApi,
  refreshSession,
  logoutSession,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // 'client' | 'admin' | null
  const [isLoading, setIsLoading] = useState(true);

  // Guarda la sesión en el estado y en localStorage.
  const guardarSesion = (data) => {
    localStorage.setItem("token", data.token);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);
    setToken(data.token);
    setUser(data.user);
    setUserType(data.userType);
  };

  // Borra la sesión del estado y de localStorage.
  const limpiarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setUser(null);
    setUserType(null);
  };

  // Al cargar la app (o presionar F5) se verifica la sesión guardada con el backend.
  // Hasta terminar, isLoading es true y no se renderiza nada: evita redirecciones falsas al login.
  useEffect(() => {
    const verificarSesion = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          guardarSesion(await refreshSession(refreshToken));
        } catch {
          limpiarSesion();
        }
      }
      setIsLoading(false);
    };
    verificarSesion();
  }, []);

  const loginClient = async (email, password) => {
    if (userType === "admin") {
      throw new Error(
        "Ya posee una sesión de Administrador activa. Debe cerrarla primero.",
      );
    }
    guardarSesion(await loginClientApi(email, password));
    navigate("/cliente/dashboard");
  };

  const loginAdmin = async (email, password) => {
    if (userType === "client") {
      throw new Error(
        "Ya posee una sesión de Cliente activa. Debe cerrarla primero.",
      );
    }
    guardarSesion(await loginAdminApi(email, password));
    navigate("/admin/dashboard");
  };

  // Invalida el refresh token en el backend y limpia todo el estado local.
  // redirigir = false permite cerrar sesión sin salir de la pantalla actual.
  const logout = async (redirigir = true) => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) await logoutSession(refreshToken);
    } catch {
      // Aunque falle el backend, la sesión local se cierra igual.
    }
    limpiarSesion();
    if (redirigir) navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userType,
        isLoading,
        loginClient,
        loginAdmin,
        logout,
      }}
    >
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          Verificando sesión...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}
