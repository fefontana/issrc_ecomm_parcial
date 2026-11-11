// Header.jsx es la barra de navegación.
// - Reactivo: cambia su diseño y opciones según el usuario (visitante, cliente o admin).
// - Responsivo (mobile-first): en móvil se colapsa con botón hamburguesa; desde md se muestra horizontal.
// - Usa AuthContext y ThemeContext a la vez.

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

// Estilo de la barra según el tipo de usuario conectado.
const estilos = {
  visitor:
    "border-b border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  client: "bg-indigo-600 text-white",
  admin: "border-b-4 border-amber-400 bg-slate-900 text-white",
};

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-black/10 dark:hover:bg-white/10 ${
    isActive ? "bg-black/10 dark:bg-white/20" : ""
  }`;

const botonClass =
  "rounded-lg border border-current px-3 py-2 text-sm font-medium transition hover:bg-black/10 dark:hover:bg-white/10";

function Header() {
  const { user, userType, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [abierto, setAbierto] = useState(false);

  // Enlaces comunes a todos.
  const enlaces = (
    <>
      <NavLink to="/" end className={navClass}>
        Inicio
      </NavLink>
      <NavLink to="/productos" className={navClass}>
        Productos
      </NavLink>
    </>
  );

  // Opciones según el tipo de usuario.
  let sesion;
  if (userType === "client") {
    sesion = (
      <>
        <NavLink to="/cliente/dashboard" className={navClass}>
          Mi panel
        </NavLink>
        <span className="px-3 text-sm">
          Hola, <strong>{user?.nombre}</strong>
        </span>
        <button onClick={() => logout()} className={botonClass}>
          Salir
        </button>
      </>
    );
  } else if (userType === "admin") {
    sesion = (
      <>
        <NavLink to="/admin/dashboard" className={navClass}>
          Panel admin
        </NavLink>
        <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-bold uppercase text-slate-900">
          {user?.role}
        </span>
        <span className="px-3 text-sm">
          <strong>{user?.nombre}</strong>
        </span>
        <button onClick={() => logout()} className={botonClass}>
          Salir
        </button>
      </>
    );
  } else {
    sesion = (
      <>
        <NavLink to="/login" className={navClass}>
          Ingresar
        </NavLink>
        <NavLink to="/admin/login" className={navClass}>
          Admin
        </NavLink>
      </>
    );
  }

  return (
    <header className={`sticky top-0 z-30 ${estilos[userType || "visitor"]}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          🛒 Tienda On-Line
        </Link>

        <div className="flex items-center gap-2">
          {/* Escritorio (>= 768px): enlaces en horizontal */}
          <nav className="hidden items-center gap-1 md:flex">
            {enlaces}
            {sesion}
          </nav>

          <button
            onClick={toggleTheme}
            className={botonClass}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Móvil (< 768px): botón hamburguesa */}
          <button
            onClick={() => setAbierto(!abierto)}
            className={`${botonClass} md:hidden`}
            aria-label="Menú"
          >
            {abierto ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Móvil: menú desplegable vertical */}
      {abierto && (
        <nav
          onClick={() => setAbierto(false)}
          className="flex flex-col items-start gap-1 border-t border-white/20 px-4 py-3 md:hidden"
        >
          {enlaces}
          {sesion}
        </nav>
      )}
    </header>
  );
}

export default Header;
