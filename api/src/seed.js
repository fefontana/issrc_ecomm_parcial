// seed.js inserta los datos iniciales (solo si todavía no existen).

import Admin from './models/admins.model.js';
import Client from './models/clients.model.js';
import Product from './models/products.model.js';

export const sembrar = async () => {
  // Un administrador por cada rol.
  const admins = [
    { nombre: 'Super Admin', email: 'admin@tienda.com', password: 'admin123', role: 'superadmin' },
    { nombre: 'Gestor', email: 'gestor@tienda.com', password: 'gestor123', role: 'gestor_productos' },
    { nombre: 'Auditor', email: 'auditor@tienda.com', password: 'auditor123', role: 'auditor' },
  ];
  for (const a of admins) {
    await Admin.findOrCreate({ where: { email: a.email }, defaults: a });
  }

  await Client.findOrCreate({
    where: { email: 'cliente@tienda.com' },
    defaults: { nombre: 'Cliente Demo', password: 'cliente123', direccion: 'Calle Falsa 123', telefono: '3546-000000' },
  });

  // Productos de ejemplo para probar la paginación.
  if ((await Product.count()) === 0) {
    await Product.bulkCreate([
      { name: 'Auriculares Bluetooth', price: 45000, stock: 20, category: 'Tecnología' },
      { name: 'Teclado Mecánico', price: 62000, stock: 12, category: 'Tecnología' },
      { name: 'Mouse Inalámbrico', price: 18000, stock: 3, category: 'Tecnología' },
      { name: 'Monitor 24 pulgadas', price: 210000, stock: 8, category: 'Tecnología' },
      { name: 'Lámpara de Escritorio', price: 18000, stock: 15, category: 'Hogar' },
      { name: 'Juego de Sábanas', price: 32000, stock: 25, category: 'Hogar' },
      { name: 'Cafetera Eléctrica', price: 55000, stock: 4, category: 'Hogar' },
      { name: 'Remera Algodón', price: 12000, stock: 40, category: 'Ropa' },
      { name: 'Campera Impermeable', price: 78000, stock: 10, category: 'Ropa' },
      { name: 'Zapatillas Running', price: 82000, stock: 14, category: 'Deportes' },
      { name: 'Pelota de Fútbol', price: 25000, stock: 30, category: 'Deportes' },
      { name: 'Mochila Urbana', price: 36000, stock: 2, category: 'Deportes' },
    ]);
  }
};
