// clientController.js: rutas privadas para clientes.

import Client from "../models/clients.model.js";

// GET /api/client/perfil -> datos del cliente logueado.
export const perfil = async (req, res) => {
  try {
    const data = await Client.findByPk(req.user.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!data) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "Cliente no encontrado" });
    }

    res.json({ estado: true, data });
  } catch (error) {
    res
      .status(500)
      .json({
        estado: false,
        mensaje: "Error al obtener perfil",
        error: error.message,
      });
  }
};
