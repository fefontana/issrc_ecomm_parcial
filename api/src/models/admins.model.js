// admins.model.js define la tabla "admins" (los operadores del sistema).
// Es una tabla totalmente separada de "clients".

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { encriptarPassword } from "../utils/auth.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    // Rol del administrador (Ejercicio 3 - RBAC).
    role: {
      type: DataTypes.ENUM("superadmin", "gestor_productos", "auditor"),
      allowNull: false,
      defaultValue: "auditor",
    },
    // Refresh token vigente de la sesión (Ejercicio 5).
    refreshToken: { type: DataTypes.TEXT },
  },
  {
    tableName: "admins",
    timestamps: false,
    hooks: {
      beforeCreate: async (admin) => {
        admin.password = await encriptarPassword(admin.password);
      },
      beforeUpdate: async (admin) => {
        if (admin.changed("password")) {
          admin.password = await encriptarPassword(admin.password);
        }
      },
    },
  },
);

export default Admin;
