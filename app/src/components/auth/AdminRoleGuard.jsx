// AdminRoleGuard.jsx protege secciones del panel según el rol del administrador.
// Uso: <AdminRoleGuard allowedRoles={['superadmin']}> ... </AdminRoleGuard>

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminRoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/sin-permiso" replace />;
  }

  return children;
}

export default AdminRoleGuard;
