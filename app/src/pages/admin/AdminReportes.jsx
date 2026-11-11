// AdminReportes.jsx: reportes de solo lectura (superadmin y auditor).

import { useFetch } from "../../hooks/useFetch.js";
import { getReportes } from "../../services/api.js";
import { ui } from "../../utils.js";

function AdminReportes() {
  const { data, error } = useFetch(getReportes);

  if (error) return <div className={ui.error}>{error}</div>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Reportes</h1>
      <p>
        Total de productos: <strong>{data.totalProductos}</strong>
      </p>

      <div className={ui.card}>
        <h2 className="mb-2 font-bold">Productos con stock bajo (5 o menos)</h2>
        <ul className="list-inside list-disc">
          {data.productosBajoStock.map((p) => (
            <li key={p.id}>
              {p.name} — stock: {p.stock}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminReportes;
