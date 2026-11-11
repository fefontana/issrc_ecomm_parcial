// Login.jsx: formulario de acceso para clientes (tipo="client") y administradores (tipo="admin").
// Aislamiento de sesiones: si ya hay una sesión del OTRO tipo, se bloquea el formulario.

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ui } from "../utils.js";

const nombres = { client: "Cliente", admin: "Administrador" };

function Login({ tipo }) {
  const { userType, loginClient, loginAdmin, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Ya hay sesión de este mismo tipo: vamos directo a su dashboard.
  if (userType === tipo) {
    return (
      <Navigate
        to={tipo === "admin" ? "/admin/dashboard" : "/cliente/dashboard"}
        replace
      />
    );
  }

  // Hay una sesión del otro tipo: advertencia bloqueante.
  if (userType) {
    return (
      <div className={`${ui.card} mx-auto max-w-md space-y-4 text-center`}>
        <h1 className="text-xl font-bold">Sesión activa</h1>
        <p>
          Ya posee una sesión de {nombres[userType]} activa. Para ingresar al
          panel de {nombres[tipo]}, debe cerrar su sesión actual.
        </p>
        <button onClick={() => logout(false)} className={ui.btn}>
          Cerrar sesión de {nombres[userType]} y continuar
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setEnviando(true);
      if (tipo === "admin") await loginAdmin(email, password);
      else await loginClient(email, password);
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-center text-3xl font-bold">
        {tipo === "admin"
          ? "Ingreso de administradores"
          : "Ingreso de clientes"}
      </h1>

      {error && <div className={ui.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={`${ui.card} space-y-4`}>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={ui.input}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={ui.input}
            required
          />
        </div>
        <button
          type="submit"
          disabled={enviando}
          className={`${ui.btn} w-full`}
        >
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

export default Login;
