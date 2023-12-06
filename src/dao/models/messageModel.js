const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true // Elimina espacios en blanco al inicio y final del campo
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Establece la fecha de creación automáticamente
  }
});

// Define un índice en el campo 'user' para mejorar la velocidad de búsqueda
messageSchema.index({ user: 1 });

// Método estático para buscar mensajes por usuario y ordenarlos por fecha de creación descendente
messageSchema.statics.findByUser = function (username) {
  return this.find({ user: username }).sort({ createdAt: -1 });
};

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;

