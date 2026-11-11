// AdminDashboard.jsx: métricas devueltas por /api/admin/metricas.

import { useFetch } from "../../hooks/useFetch.js";
import { getMetricas } from "../../services/api.js";
import { ui } from "../../utils.js";

function AdminDashboard() {
  const { data, error } = useFetch(getMetricas);

  if (error) return <div className={ui.error}>{error}</div>;
  if (!data) return <p>Cargando...</p>;

  const tarjetas = [
    { label: "Clientes", valor: data.totalClientes },
    { label: "Administradores", valor: data.totalAdmins },
    { label: "Productos", valor: data.totalProductos },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Métricas</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.label} className={ui.card}>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.label}
            </p>
            <p className="text-4xl font-bold">{t.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
