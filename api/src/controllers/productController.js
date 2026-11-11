// productController.js: CRUD de productos con paginación, filtros y orden.

import { Op } from "sequelize";
import Product from "../models/products.model.js";

// GET /api/products?page=1&limit=5&search=&category=&sortBy=price&order=ASC
export const listar = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
    const { search, category, sortBy, order } = req.query;

    // Filtros opcionales: búsqueda parcial por nombre y categoría exacta.
    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category) where.category = category;

    // Solo se permite ordenar por price o name.
    const campo = ["price", "name"].includes(sortBy) ? sortBy : "id";
    const sentido = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";

    // findAndCountAll trae solo la página pedida y el total de registros.
    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [[campo, sentido]],
      limit,
      offset: (page - 1) * limit,
    });

    res.json({
      estado: true,
      data: {
        products: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        estado: false,
        mensaje: "Error al obtener productos",
        error: error.message,
      });
  }
};

// POST /api/products
export const crear = async (req, res) => {
  try {
    const data = await Product.create(req.body);
    res.status(201).json({ estado: true, data });
  } catch (error) {
    res
      .status(400)
      .json({
        estado: false,
        mensaje: "Error al crear producto",
        error: error.message,
      });
  }
};

// PUT /api/products/:id
export const actualizar = async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);

    if (!producto) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }

    await producto.update(req.body);
    res.json({ estado: true, data: producto });
  } catch (error) {
    res
      .status(400)
      .json({
        estado: false,
        mensaje: "Error al actualizar producto",
        error: error.message,
      });
  }
};

// DELETE /api/products/:id
export const eliminar = async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id);

    if (!producto) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ estado: true, mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        estado: false,
        mensaje: "Error al eliminar producto",
        error: error.message,
      });
  }
};
