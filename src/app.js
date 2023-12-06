const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cartRouter = require('./routes/cart');
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

// Asignar las rutas a los endpoints correspondientes
app.use('/api/carts', cartRouter);

// Middleware para el manejo de JSON
app.use(express.json());

// Modelo de Producto
const ProductModel = require('./models/productModel');
const MessageService = require('./services/messageService');

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await ProductModel.find().limit(parseInt(limit));
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Configuración de WebSockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Lógica para obtener y enviar los productos a través de WebSocket
  socket.on('getProducts', async () => {
    try {
      const products = await ProductModel.find();
      socket.emit('products', products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  });

  // Manejar mensajes del chat
  socket.on('chatMessage', async (data) => {
    const messageService = new MessageService();
    try {
      await messageService.saveMessage(data.user, data.message);
      io.emit('chatMessage', data);
    } catch (error) {
      console.error('Error al guardar mensaje en MongoDB:', error);
    }
  });
});

// Ruta para la vista raíz
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'views', 'index.handlebars');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo de vista:', err);
      res.status(500).send('Error al leer el archivo de vista');
    } else {
      res.send(data);
    }
  });
});

// Ruta para "/realtimeproducts"
app.get('/realtimeproducts', (req, res) => {
  res.send('Ruta /realtimeproducts');
});

// Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});


