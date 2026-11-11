// auth.js contiene funciones reutilizables para contraseñas y tokens.
// - bcryptjs: encripta y compara contraseñas.
// - jsonwebtoken: firma los tokens de sesión.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const JWT_SECRET = process.env.JWT_SECRET || "clave_access";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "clave_refresh";

export const encriptarPassword = (password) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const compararPassword = (password, hash) =>
  bcrypt.compare(password, hash);

// Access token: corta duración (15 minutos).
export const generarAccessToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

// Refresh token: larga duración (7 días). Se guarda también en la base de datos.
export const generarRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
