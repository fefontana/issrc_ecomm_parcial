// utils.js reúne constantes y funciones compartidas por varias pantallas.

// Roles permitidos en cada sección del panel (se usan en las rutas y en el menú lateral).
export const PERMISOS = {
  usuarios: ["superadmin"],
  productos: ["superadmin", "gestor_productos"],
  reportes: ["superadmin", "auditor"],
};

export const CATEGORIAS = [
  { nombre: "Gaming & Tecnología", icono: "🎮 💻" },
  { nombre: "Basar & Electrodomesticos", icono: "☕⌚" },
  { nombre: "Indumentaria", icono: "🧢🧥" },
  { nombre: "Gym & trayning", icono: "👟⚽" },
];
/*
export const CATEGORIAS = [
  { nombre: "Gaming", icono: "🎮" },
  { nombre: "Accesorios", icono: "⌚" },
  { nombre: "Cafetería", icono: "☕" },
  { nombre: "Audio", icono: "🎧" },
];
*/

export const formatearPrecio = (valor) =>
  Number(valor).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

// Clases de Tailwind reutilizadas (incluyen el modo oscuro).
export const ui = {
  card: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800",
  input:
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
  btn: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
  btnSec:
    "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700",
  error:
    "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200",
};
