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
const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const port = 8080;

// Conexión a MongoDB
const mongoURI = 'mongodb://localhost:27017/Ecommerce';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB local');
});

// Configuración de estrategia local de Passport para registro y login
passport.use('local', new LocalStrategy(
  (username, password, done) => {
    // Lógica para verificar el usuario y la contraseña en tu base de datos
    // Reemplaza 'User' con el modelo de usuario en tu aplicación
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Usuario incorrecto.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Contraseña incorrecta.' });
        }
      });
    });
  }
));

// Configuración de estrategia de GitHub para autenticación
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, 
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
  }
));

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Lógica para recuperar el usuario de la base de datos por su ID
  
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Rutas para login y autenticación de GitHub
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/auth/github',
  passport.authenticate('github')
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Agregar las rutas de autenticación
app.use('/auth', authRoutes);

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

app.listen(3000, () => {
  console.log('Servidor en el puerto 3000');
});


