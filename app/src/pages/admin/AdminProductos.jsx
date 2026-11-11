// AdminProductos.jsx: gestión del catálogo (superadmin y gestor_productos).

import ProductCatalog from "../../components/products/ProductCatalog.jsx";

function AdminProductos() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Gestión de productos</h1>
      <ProductCatalog admin />
    </div>
  );
}

export default AdminProductos;
