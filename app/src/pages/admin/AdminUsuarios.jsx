// AdminUsuarios.jsx: lista de administradores (solo superadmin).

import { useFetch } from "../../hooks/useFetch.js";
import { getUsuarios } from "../../services/api.js";
import { ui } from "../../utils.js";

function AdminUsuarios() {
  const { data, error } = useFetch(getUsuarios);

  if (error) return <div className={ui.error}>{error}</div>;
  if (!data) return <p>Cargando...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Usuarios administradores</h1>
      <div className={`${ui.card} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr
                key={a.id}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="px-4 py-3">{a.nombre}</td>
                <td className="px-4 py-3">{a.email}</td>
                <td className="px-4 py-3">{a.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsuarios;
