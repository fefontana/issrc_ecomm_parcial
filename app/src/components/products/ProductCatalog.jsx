// ProductCatalog.jsx: tabla de productos con búsqueda, filtro, orden y paginación.
// Todo se resuelve en el backend (GET /api/products): solo se piden los datos de la página actual.
// Si admin = true, se agregan el formulario de alta/edición y los botones Editar/Eliminar.

import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api.js";
import { CATEGORIAS, formatearPrecio, ui } from "../../utils.js";

const LIMIT = 5;
const formVacio = {
  name: "",
  price: "",
  stock: "",
  category: CATEGORIAS[0].nombre,
};

function ProductCatalog({ admin = false }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [texto, setTexto] = useState(""); // lo que se escribe en el input
  const [search, setSearch] = useState(""); // lo que se envió a buscar
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState(""); // '' | 'ASC' | 'DESC' (por precio)
  const [error, setError] = useState("");
  const [recarga, setRecarga] = useState(0); // se incrementa para volver a pedir los datos
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);

  // Cada vez que cambia la página, un filtro o el orden, se consulta la API sin recargar la ventana.
  useEffect(() => {
    const cargar = async () => {
      try {
        const params = { page, limit: LIMIT, search, category };
        if (order) {
          params.sortBy = "price";
          params.order = order;
        }
        const data = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };
    cargar();
  }, [page, search, category, order, recarga]);

  // Buscar: Enter o botón (ambos disparan el submit del formulario).
  const buscar = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(texto);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    };
    try {
      if (editandoId) await updateProduct(editandoId, body);
      else await createProduct(body);
      setForm(formVacio);
      setEditandoId(null);
      setRecarga((r) => r + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (p) => {
    setEditandoId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
    });
  };

  const borrar = async (p) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id);
      // Si se borró el único producto de la última página, volvemos una página atrás.
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setRecarga((r) => r + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className={ui.error}>{error}</div>}

      {/* Formulario de alta / edición (solo admin) */}
      {admin && (
        <form
          onSubmit={guardar}
          className={`${ui.card} grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5`}
        >
          <input
            className={ui.input}
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className={ui.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className={ui.input}
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <select
            className={ui.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.nombre}>{c.nombre}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" className={ui.btn}>
              {editandoId ? "Guardar" : "Agregar"}
            </button>
            {editandoId && (
              <button
                type="button"
                className={ui.btnSec}
                onClick={() => {
                  setEditandoId(null);
                  setForm(formVacio);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {/* Panel de controles */}
      <div className="flex flex-col gap-3 md:flex-row">
        <form onSubmit={buscar} className="flex flex-1 gap-2">
          <input
            className={ui.input}
            placeholder="Buscar por nombre..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button type="submit" className={ui.btn}>
            Buscar
          </button>
        </form>

        <select
          className={`${ui.input} md:w-48`}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c.nombre}>{c.nombre}</option>
          ))}
        </select>

        <select
          className={`${ui.input} md:w-56`}
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Sin ordenar</option>
          <option value="ASC">Precio: menor a mayor</option>
          <option value="DESC">Precio: mayor a menor</option>
        </select>
      </div>

      {/* Tabla */}
      <div className={`${ui.card} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              {admin && <th className="px-4 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatearPrecio(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                {admin && (
                  <td className="space-x-2 px-4 py-3">
                    <button onClick={() => editar(p)} className={ui.btnSec}>
                      Editar
                    </button>
                    <button onClick={() => borrar(p)} className={ui.btnSec}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={admin ? 5 : 4} className="px-4 py-6 text-center">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4">
        <button
          className={ui.btnSec}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {page} de {totalPages}
        </span>
        <button
          className={ui.btnSec}
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ProductCatalog;
