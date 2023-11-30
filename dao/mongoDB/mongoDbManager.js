const mongoose = require('mongoose');

class MongoDbManager {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
  }

  async connect() {
    try {
      await mongoose.connect(this.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Desconexión de MongoDB exitosa');
    } catch (error) {
      console.error('Error al desconectar de MongoDB:', error);
    }
  }

  // Puedes agregar más métodos según tus necesidades para realizar operaciones en la base de datos
}

module.exports = MongoDbManager;
