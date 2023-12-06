const mongoose = require('mongoose');

class MongoDbManager {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
    this.isConnected = false; 
  }

  async connect() {
    try {
      await mongoose.connect(this.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      this.isConnected = true;
      console.log('Conexión a MongoDB establecida correctamente');
    } catch (error) {
      this.isConnected = false;
      console.error('Error al conectar a MongoDB:', error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Desconexión de MongoDB exitosa');
    } catch (error) {
      console.error('Error al desconectar de MongoDB:', error);
    }
  }

  isConnected() {
    return this.isConnected;
  }
}

module.exports = MongoDbManager;
