// App.jsx define los proveedores de contexto y todas las rutas.
// BrowserRouter va por fuera porque AuthProvider usa useNavigate.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ClientRoute from "./components/auth/ClientRoute.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminRoleGuard from "./components/auth/AdminRoleGuard.jsx";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import Login from "./pages/Login.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminReportes from "./pages/admin/AdminReportes.jsx";
import SinPermiso from "./pages/admin/SinPermiso.jsx";
import { PERMISOS } from "./utils.js";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <Header />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
              <Routes>
                {/* Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/login" element={<Login tipo="client" />} />
                <Route path="/admin/login" element={<Login tipo="admin" />} />

                {/* Cliente */}
                <Route
                  path="/cliente/dashboard"
                  element={
                    <ClientRoute>
                      <ClientDashboard />
                    </ClientRoute>
                  }
                />

                {/* Administración: protegida por AdminRoute y, dentro, por rol */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route
                    path="usuarios"
                    element={
                      <AdminRoleGuard allowedRoles={PERMISOS.usuarios}>
                        <AdminUsuarios />
                      </AdminRoleGuard>
                    }
                  />
                  <Route
                    path="productos"
                    element={
                      <AdminRoleGuard allowedRoles={PERMISOS.productos}>
                        <AdminProductos />
                      </AdminRoleGuard>
                    }
                  />
                  <Route
                    path="reportes"
                    element={
                      <AdminRoleGuard allowedRoles={PERMISOS.reportes}>
                        <AdminReportes />
                      </AdminRoleGuard>
                    }
                  />
                  <Route path="sin-permiso" element={<SinPermiso />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
