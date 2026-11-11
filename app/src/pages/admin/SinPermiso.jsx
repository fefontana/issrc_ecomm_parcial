// SinPermiso.jsx: mensaje de acceso denegado.

import { Link } from "react-router-dom";
import { ui } from "../../utils.js";

function SinPermiso() {
  return (
    <div className={`${ui.card} space-y-3 text-center`}>
      <h1 className="text-2xl font-bold">Acceso denegado</h1>
      <p>Su rol no tiene permisos para ver esta sección.</p>
      <Link to="/admin/dashboard" className={ui.btn}>
        Volver al panel
      </Link>
    </div>
  );
}

export default SinPermiso;
