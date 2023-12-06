
const MessageModel = require('../dao/models/messageModel');

class MessageService {
  async saveMessage(user, message) {
    try {
      if (!user || !message) {
        throw new Error('El usuario y el mensaje son obligatorios');
      }

      const newMessage = new MessageModel({ user, message });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error('Error al guardar el mensaje:', error.message);
      throw error;
    }
  }

  async getAllMessages(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const messages = await MessageModel.find().skip(skip).limit(limit);
      return messages;
    } catch (error) {
      console.error('Error al obtener los mensajes:', error.message);
      throw error;
    }
  }
}

module.exports = MessageService;
