// productRoutes.js: catálogo público y CRUD protegido.

import { Router } from "express";
import { verifyToken, isAdmin, checkAdminRole } from "../middleware/auth.js";
import {
  listar,
  crear,
  actualizar,
  eliminar,
} from "../controllers/productController.js";

const router = Router();

// Lectura pública (con paginación, filtros y orden).
router.get("/", listar);

// Escritura: solo administradores con rol superadmin o gestor_productos.
const gestion = [
  verifyToken,
  isAdmin,
  checkAdminRole(["superadmin", "gestor_productos"]),
];

router.post("/", gestion, crear);
router.put("/:id", gestion, actualizar);
router.delete("/:id", gestion, eliminar);

export default router;
