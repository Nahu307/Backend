const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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



// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Enviar lista de productos a través de WebSocket
  socket.emit('products', products);
});

// Ruta para la vista raíz
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'views', 'index.handlebars');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error al leer el archivo de vista.');
    } else {
      res.send(data);
    }
  });
});

// Ruta para "/realtimeproducts" - No es necesario, pero puedes usarla si lo deseas
app.get('/realtimeproducts', (req, res) => {
  res.send('Ruta /realtimeproducts');
});

server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

