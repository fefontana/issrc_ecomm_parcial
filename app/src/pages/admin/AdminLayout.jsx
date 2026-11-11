// AdminLayout.jsx: menú lateral dinámico + contenido (Outlet).
// Los enlaces se ocultan si el rol del administrador no tiene permiso.

import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { PERMISOS } from "../../utils.js";

const todos = ["superadmin", "gestor_productos", "auditor"];

const menu = [
  { to: "/admin/dashboard", label: "Métricas", roles: todos },
  { to: "/admin/productos", label: "Productos", roles: PERMISOS.productos },
  { to: "/admin/reportes", label: "Reportes", roles: PERMISOS.reportes },
  { to: "/admin/usuarios", label: "Usuarios", roles: PERMISOS.usuarios },
];

function AdminLayout() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-slate-200 dark:hover:bg-slate-700"
    }`;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* Sidebar: horizontal en móvil, vertical en md */}
      <aside className="md:w-52">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {menu
            .filter((item) => item.roles.includes(user.role))
            .map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
