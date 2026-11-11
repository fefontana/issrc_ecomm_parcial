// authController.js maneja login, refresh y logout.
// Clientes y administradores tienen logins separados y tablas separadas.

import jwt from "jsonwebtoken";
import Client from "../models/clients.model.js";
import Admin from "../models/admins.model.js";
import {
  compararPassword,
  generarAccessToken,
  generarRefreshToken,
  JWT_REFRESH_SECRET,
} from "../utils/auth.js";

// Contenido del token: el admin además lleva su rol.
const armarPayload = (user, type) =>
  type === "admin"
    ? { id: user.id, type, role: user.role }
    : { id: user.id, type };

// Datos del usuario que se envían al frontend (sin contraseña ni refresh token).
const datosPublicos = (user) => {
  const { password, refreshToken, ...datos } = user.toJSON();
  return datos;
};

// Función que crea el login para cualquiera de los dos modelos.
const crearLogin = (Modelo, type) => async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ estado: false, mensaje: "Debe proporcionar email y password" });
    }

    const user = await Modelo.findOne({ where: { email } });

    if (!user || !(await compararPassword(password, user.password))) {
      return res
        .status(401)
        .json({ estado: false, mensaje: "Credenciales inválidas" });
    }

    const payload = armarPayload(user, type);
    const token = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    // Guardamos el refresh token en la base de datos para poder invalidarlo.
    await user.update({ refreshToken });

    res.json({
      estado: true,
      token,
      refreshToken,
      userType: type,
      user: datosPublicos(user),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        estado: false,
        mensaje: "Error al iniciar sesión",
        error: error.message,
      });
  }
};

// POST /api/auth/client/login -> busca en "clients".
export const loginClient = crearLogin(Client, "client");

// POST /api/auth/admin/login -> busca en "admins".
export const loginAdmin = crearLogin(Admin, "admin");

// POST /api/auth/refresh -> recibe el refresh token y devuelve un nuevo access token.
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ estado: false, mensaje: "Falta el refresh token" });
    }

    // Verifica la firma y la expiración (lanza error si no es válido).
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const Modelo = decoded.type === "admin" ? Admin : Client;
    const user = await Modelo.findByPk(decoded.id);

    // Verifica que el refresh token exista en la base de datos.
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ estado: false, mensaje: "Sesión inválida" });
    }

    const token = generarAccessToken(armarPayload(user, decoded.type));

    res.json({
      estado: true,
      token,
      userType: decoded.type,
      user: datosPublicos(user),
    });
  } catch (error) {
    res
      .status(401)
      .json({ estado: false, mensaje: "Refresh token inválido o expirado" });
  }
};

// POST /api/auth/logout -> borra el refresh token de la base de datos.
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // ignoreExpiration: aunque esté vencido, igual limpiamos la sesión.
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET, {
        ignoreExpiration: true,
      });
      const Modelo = decoded.type === "admin" ? Admin : Client;
      await Modelo.update(
        { refreshToken: null },
        { where: { id: decoded.id } },
      );
    }

    res.json({ estado: true, mensaje: "Sesión cerrada" });
  } catch (error) {
    res.status(400).json({ estado: false, mensaje: "Token inválido" });
  }
};
