// adminRoutes.js: rutas privadas del panel de administración (RBAC).

import { Router } from "express";
import { verifyToken, isAdmin, checkAdminRole } from "../middleware/auth.js";
import {
  metricas,
  usuarios,
  reportes,
} from "../controllers/adminController.js";
import { crear } from "../controllers/productController.js";

const router = Router();

// Todas las rutas de este archivo exigen token válido de administrador.
router.use(verifyToken, isAdmin);

// Cualquier administrador.
router.get("/metricas", metricas);

// Solo superadmin.
router.get("/usuarios", checkAdminRole(["superadmin"]), usuarios);

// superadmin y gestor_productos.
router.post(
  "/productos",
  checkAdminRole(["superadmin", "gestor_productos"]),
  crear,
);

// superadmin y auditor.
router.get("/reportes", checkAdminRole(["superadmin", "auditor"]), reportes);

export default router;
