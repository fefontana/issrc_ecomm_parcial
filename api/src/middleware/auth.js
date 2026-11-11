// auth.js contiene los middlewares que protegen las rutas.
// Un middleware se ejecuta antes de llegar al controlador.

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/auth.js";

// verifyToken: lee "Authorization: Bearer <token>", verifica la firma
// y guarda el contenido del token en req.user.
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ estado: false, mensaje: "Token no proporcionado" });
  }

  try {
    req.user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    next();
  } catch (error) {
    // Token alterado o expirado.
    return res
      .status(401)
      .json({ estado: false, mensaje: "Token inválido o expirado" });
  }
};

// isClient: solo deja pasar tokens de clientes.
export const isClient = (req, res, next) => {
  if (req.user.type !== "client") {
    return res
      .status(403)
      .json({ estado: false, mensaje: "Acceso solo para clientes" });
  }
  next();
};

// isAdmin: solo deja pasar tokens de administradores.
export const isAdmin = (req, res, next) => {
  if (req.user.type !== "admin") {
    return res
      .status(403)
      .json({ estado: false, mensaje: "Acceso solo para administradores" });
  }
  next();
};

// checkAdminRole: recibe un arreglo de roles permitidos y devuelve un middleware
// que compara con el rol guardado en el token. Se usa después de verifyToken e isAdmin.
export const checkAdminRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({
        estado: false,
        mensaje: "Su rol no tiene permisos para esta acción",
      });
  }
  next();
};
