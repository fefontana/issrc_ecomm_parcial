// AdminRoute.jsx protege las rutas que son solo para administradores.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminRoute({ children }) {
  const { token, userType } = useAuth();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (userType !== "admin") return <Navigate to="/cliente/dashboard" replace />;

  return children;
}

export default AdminRoute;
