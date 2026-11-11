// ClientDashboard.jsx: muestra los datos devueltos por /api/client/perfil.

import { useFetch } from "../hooks/useFetch.js";
import { getPerfil } from "../services/api.js";
import { ui } from "../utils.js";

function ClientDashboard() {
  const { data, error } = useFetch(getPerfil);

  if (error) return <div className={ui.error}>{error}</div>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div className={`${ui.card} max-w-md space-y-2`}>
      <h1 className="text-2xl font-bold">Hola, {data.nombre}</h1>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      <p>
        <strong>Dirección:</strong> {data.direccion || "-"}
      </p>
      <p>
        <strong>Teléfono:</strong> {data.telefono || "-"}
      </p>
    </div>
  );
}

export default ClientDashboard;
