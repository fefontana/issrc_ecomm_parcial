// Productos.jsx: catálogo público.

import ProductCatalog from "../components/products/ProductCatalog.jsx";

function Productos() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Catálogo de productos</h1>
      <ProductCatalog />
    </div>
  );
}

export default Productos;
