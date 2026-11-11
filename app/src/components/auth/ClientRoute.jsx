// ClientRoute.jsx protege las rutas que son solo para clientes.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function ClientRoute({ children }) {
  const { token, userType } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (userType !== "client") return <Navigate to="/admin/dashboard" replace />;

  return children;
}

export default ClientRoute;
