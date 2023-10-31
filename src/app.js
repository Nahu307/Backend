const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

// Middleware para el manejo de JSON
app.use(express.json());

// Rutas para productos
const products = [];

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const productList = limit ? products.slice(0, limit) : products;
  res.json(productList);
});

// Ruta para obtener un producto por ID
app.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos obligatorios son requeridos' });
  }

  const newProductId = generateUniqueProductId(); // Implementa esta función según tu lógica
  const status = true;

  const newProduct = {
    id: newProductId,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto por su ID
app.put('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...products[productIndex], ...req.body };
  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// Ruta para eliminar un producto por su ID
app.delete('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Producto eliminado' });
});

// Rutas para carritos
const carts = [];

// Ruta para crear un nuevo carrito
app.post('/api/carts', (req, res) => {
  const newCartId = generateUniqueCartId(); // Implementa esta función según tu lógica
  const newCart = {
    id: newCartId,
    products: [],
  };
  carts.push(newCart);
  res.status(201).json(newCart);
});

// Ruta para listar los productos de un carrito por su ID
app.get('/api/carts/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

// Ruta para agregar un producto a un carrito
app.post('/api/carts/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const product = cart.products.find((p) => p.product === productId);

  if (product) {
    // Si el producto ya existe en el carrito, incrementa la cantidad
    product.quantity++;
  } else {
    // Agrega el producto al carrito con cantidad 1
    cart.products.push({ product: productId, quantity: 1 });
  }

  res.json(cart.products);
});

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

// Función para generar un ID único para productos
function generateUniqueProductId() {
  // Implementa la generación de ID único según tus necesidades.
}

// Función para generar un ID único para carritos
function generateUniqueCartId() {
  // Implementa la generación de ID único según tus necesidades.
}
