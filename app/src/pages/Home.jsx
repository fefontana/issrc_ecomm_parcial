// Home.jsx: pantalla principal Mobile-First (Ejercicio 7).
// Los estilos base son para móvil; sm:, md: y lg: lo adaptan a pantallas más grandes.

import { Link } from "react-router-dom";
import { CATEGORIAS, formatearPrecio, ui } from "../utils.js";

// Productos de ejemplo para la vitrina (pantalla 100% frontend).
const destacados = [
  {
    id: 1,
    nombre: "Teclado Mecánico RGB",
    precio: 64000,
    descuento: 15,
    icono: "⌨️",
  },
  {
    id: 2,
    nombre: "Reloj Inteligente",
    precio: 52000,
    descuento: 20,
    icono: "⌚",
  },
  {
    id: 3,
    nombre: "Cafetera Express",
    precio: 95000,
    descuento: 10,
    icono: "☕",
  },
  {
    id: 4,
    nombre: "Gafas de Sol",
    precio: 29000,
    descuento: 30,
    icono: "🕶️",
  },
];


function Home() {
  return (
    <div className="space-y-12">
      {/* Hero: vertical centrado en móvil, dos columnas desde md */}
      <section className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
        {/* Imagen: arriba en móvil, a la derecha en md */}
        <div className="flex aspect-square w-48 items-center justify-center rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 text-8xl shadow-lg md:order-2 md:w-72">
          🚀
        </div>


        <div className="space-y-4 md:order-1 md:flex-1">
          <h1 className="text-3xl font-bold md:text-5xl">
            Ofertas y últimos lanzamientos
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Tecnología, electrodomesticos, indumentaria y mucho mas en un mismo lugar con los mejores precios.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link to="/productos" className={ui.btn}>
              Productos
            </Link>
            <Link to="/login" className={ui.btnSec}>
              Cliente
            </Link>
            <Link to="/admin/login" className={ui.btnSec}>
              Administrador
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías: 1 columna en móvil, 2 en tablet, 4 en escritorio */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Categorías destacadas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.nombre}
              to="/productos"
              className={`${ui.card} text-center hover:scale-105 transition-all`}
            >
              <div className="text-5xl">{c.icono}</div>
              <p className="mt-2 font-semibold">{c.nombre}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Vitrina: 1 columna en móvil, 2 en media, 4 en escritorio */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Ofertas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p) => (
            <article key={p.id} className={`${ui.card} space-y-3 p-4`}>
              {/* Contenedor de imagen de proporción fija */}
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-6xl dark:bg-slate-700">
                {p.icono}
                <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                  -{p.descuento}%
                </span>
              </div>
              <h3 className="font-semibold">{p.nombre}</h3>
              <p>
                <span className="text-lg font-bold">
                  {formatearPrecio(p.precio * (1 - p.descuento / 100))}
                </span>{" "}
                <span className="text-sm text-slate-400 line-through">
                  {formatearPrecio(p.precio)}
                </span>
              </p>
              <button className={`${ui.btn} w-full`}>Comprar</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
