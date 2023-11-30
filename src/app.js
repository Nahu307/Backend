const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

// Conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/Ecommerce';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB local');
});

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para el manejo de JSON
app.use(express.json());

// Modelo y servicio de mensajes
const MessageModel = require('./dao/models/messageModel');
const MessageService = require('./services/messageService');

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

  // Manejar mensajes del chat
  socket.on('chatMessage', async (data) => {
    // Guardar el mensaje en MongoDB
    const messageService = new MessageService();
    await messageService.saveMessage(data.user, data.message);

    // Emitir el mensaje a todos los clientes conectados
    io.emit('chatMessage', data);
  });
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

// Ruta para la vista de chat
app.get('/chat', async (req, res) => {
  // Obtener todos los mensajes desde MongoDB
  const messageService = new MessageService();
  const messages = await messageService.getAllMessages();

  // Renderizar la vista de chat con los mensajes
  res.render('chat', { messages });
});

// Ruta para "/realtimeproducts" - No es necesario, pero puedes usarla si lo deseas
app.get('/realtimeproducts', (req, res) => {
  res.send('Ruta /realtimeproducts');
});

server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

