// app.js configura el servidor Express y la conexión a la base de datos.

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import sequelize from "./config/database.js";
import { sembrar } from "./seed.js";

const app = express();

// cors permite que el frontend (otro puerto) se comunique con la API.
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));

// Permite leer el cuerpo de las peticiones en formato JSON.
app.use(express.json());

// Todas las rutas cuelgan de /api.
app.use("/api", routes);

const PUERTO = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    // alter: true crea o ajusta las tablas según los modelos.
    await sequelize.sync({ alter: true });
    await sembrar();
    console.log("Base de datos lista.");

    app.listen(PUERTO, () => {
      console.log("Servidor iniciado en el puerto:", PUERTO);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
  }
};

iniciarServidor();
