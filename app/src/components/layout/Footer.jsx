// Footer.jsx: apilado en móvil (1 columna) y en 3 columnas desde md.

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-3 font-bold text-white">Información</h3>
          <p className="text-sm">
            Tienda Online Proyecto Academico
            ISSRC 2026
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-bold text-white">Enlaces rápidos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/productos" className="hover:text-white">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Ingreso clientes
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white">
                Ingreso administradores
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-bold text-white">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>Términos y condiciones</li>
            <li>Política de privacidad</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-700 py-4 text-center text-xs">
        © 2026 Tienda online
      </p>
    </footer>
  );
}

export default Footer;
