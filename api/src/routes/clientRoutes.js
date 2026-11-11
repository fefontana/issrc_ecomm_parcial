// clientRoutes.js: rutas privadas del cliente.

import { Router } from "express";
import { verifyToken, isClient } from "../middleware/auth.js";
import { perfil } from "../controllers/clientController.js";

const router = Router();

router.get("/perfil", verifyToken, isClient, perfil);

export default router;
