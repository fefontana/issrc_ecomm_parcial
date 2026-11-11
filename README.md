# Arquitectura Fullstack e-Commerce
## Examen Parcial Desarrollo de aplicaciones moviles (web)
ISSRC - Tecnicatura de Desarrollo de Aplicaciones Webs - 2026
Docente: Pablo Arona
Estudiante: Fernando Fontana


## Instalacion, configuración y ejecución

1. Crear manual o automaticamente la DB  `ecommerce_p` (`CREATE DATABASE ecommerce_p;`).

O mediante script provisto:

Para ello dar permisos de ejecucion al script
chmod +x crear_db.sh

Ejecutar:
./crear_db.sh

se solicita nombre de la base y password de mysql/mariadb
ecommerce_p

En paso 3 como se nota en la configuración del package.json se puede ejecutar
npm run seed
para que node realice la carga de datos preconfigurada en la DB al primer inicio.

2. Ajustar usuario y contraseña en `api/.env`.

3. Backend: `cd api && npm install && npm run dev` (puerto 3000).
   Al iniciar, `sequelize.sync({ alter: true })` crea las tablas y se cargan los datos de prueba.

4. Frontend: `cd app && npm install && npm run dev` (puerto 5173).

## Usuarios

| Tipo    | Email               | Contraseña | Rol              |
|---------|---------------------|------------|------------------|
| Admin   | admin@tienda.com    | admin123   | superadmin       |
| Admin   | gestor@tienda.com   | gestor123  | gestor_productos |
| Admin   | auditor@tienda.com  | auditor123 | auditor          |
| Cliente | cliente@tienda.com  | cliente123 | –                |

## Resolucion incremental de ejercicios


Organización del proyecto con la resolución de consigna 7 ejercicios (`api/` = backend, `app/` = frontend).

[Ejercicio 1: Back Core] ──> Modelos separados (Admin / Client) + JWT + Middlewares

[Ejercicio 2: Front Core] ─> AuthContext Dual + Redirección + Rutas Protegidas

[Ejercicio 3: RBAC Admin] ─> Roles jerárquicos (Superadmin, Gestor, Auditor) + AdminGuard

[Ejercicio 4: Data Flow] ──> CRUD Productos + Paginación + Orden + Filtros (Back & Front)

[Ejercicio 5: Sesiones] ───> Refresh Token + Persistencia F5 + Aislamiento de Entornos

[Ejercicio 6: UI Context] ─> ThemeContext + Header Reactivo Multi-rol + Persistencia

[Ejercicio 7: Layout UI] ──> Home Mobile-First Responsivo con Tailwind CSS

| Ej. | Backend (`api/src`) | Frontend (`app/src`) |
|-----|---------------------|----------------------|
| 1 | `models/clients.model.js`, `models/admins.model.js`, `middleware/auth.js` (`verifyToken`, `isClient`, `isAdmin`), `controllers/authController.js`, `routes/*` | – |
| 2 | – | `context/AuthContext.jsx`, `components/auth/ClientRoute.jsx`, `AdminRoute.jsx`, `pages/Login.jsx`, dashboards |
| 3 | campo `role` en Admin, `checkAdminRole`, `routes/adminRoutes.js` | `components/auth/AdminRoleGuard.jsx`, `pages/admin/AdminLayout.jsx` (menú dinámico), `SinPermiso.jsx` |
| 4 | `models/products.model.js`, `controllers/productController.js`, `routes/productRoutes.js` | `components/products/ProductCatalog.jsx` |
| 5 | `refresh` y `logout` en `authController.js`, campo `refreshToken` | `AuthContext.jsx` (verificación al montar, aislamiento), `Login.jsx` (advertencia bloqueante), interceptor en `services/api.js` |
| 6 | – | `context/ThemeContext.jsx`, `components/layout/Header.jsx` |
| 7 | – | `pages/Home.jsx`, `components/layout/Header.jsx` (hamburguesa), `Footer.jsx` |

## Endpoints

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/auth/client/login` | Público |
| POST | `/api/auth/admin/login` | Público |
| POST | `/api/auth/refresh` (body: `refreshToken`) | Público |
| POST | `/api/auth/logout` (body: `refreshToken`) | Público |
| GET | `/api/client/perfil` | Cliente |
| GET | `/api/admin/metricas` | Cualquier admin |
| GET | `/api/admin/usuarios` | superadmin |
| POST | `/api/admin/productos` | superadmin, gestor_productos |
| GET | `/api/admin/reportes` | superadmin, auditor |
| GET | `/api/products?page&limit&search&category&sortBy&order` | Público |
| POST / PUT `/:id` / DELETE `/:id` | `/api/products` | superadmin, gestor_productos |

Pruebas en Postman: enviar `Authorization: Bearer <token>`.
Un token de cliente en una ruta de admin devuelve 403; sin token o vencido, 401.
