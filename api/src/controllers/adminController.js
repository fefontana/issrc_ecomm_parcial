// adminController.js: rutas privadas para administradores.

import { Op } from "sequelize";
import Admin from "../models/admins.model.js";
import Client from "../models/clients.model.js";
import Product from "../models/products.model.js";

// GET /api/admin/metricas -> cualquier administrador.
export const metricas = async (req, res) => {
  try {
    const data = {
      totalClientes: await Client.count(),
      totalAdmins: await Admin.count(),
      totalProductos: await Product.count(),
    };
    res.json({ estado: true, data });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener métricas",
      error: error.message,
    });
  }
};

// GET /api/admin/usuarios -> solo superadmin.
export const usuarios = async (req, res) => {
  try {
    const data = await Admin.findAll({
      attributes: ["id", "nombre", "email", "role"],
    });
    res.json({ estado: true, data });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

// GET /api/admin/reportes -> superadmin y auditor (solo lectura).
export const reportes = async (req, res) => {
  try {
    const data = {
      totalProductos: await Product.count(),
      productosBajoStock: await Product.findAll({
        where: { stock: { [Op.lte]: 5 } },
      }),
    };
    res.json({ estado: true, data });
  } catch (error) {
    res.status(500).json({
      estado: false,
      mensaje: "Error al obtener reportes",
      error: error.message,
    });
  }
};
