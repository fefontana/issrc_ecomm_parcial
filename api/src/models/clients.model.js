// clients.model.js define la tabla "clients" (los compradores).

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { encriptarPassword } from "../utils/auth.js";

const Client = sequelize.define(
  "Client",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    direccion: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    // Refresh token vigente de la sesión (Ejercicio 5).
    refreshToken: { type: DataTypes.TEXT },
  },
  {
    tableName: "clients",
    timestamps: false,
    hooks: {
      // La contraseña se encripta automáticamente antes de guardar.
      beforeCreate: async (client) => {
        client.password = await encriptarPassword(client.password);
      },
      beforeUpdate: async (client) => {
        if (client.changed("password")) {
          client.password = await encriptarPassword(client.password);
        }
      },
    },
  },
);

export default Client;
