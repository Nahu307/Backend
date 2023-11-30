const express = require('express');
const router = express.Router();
const MessageService = require('../services/messageService');


const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


router.get('/chat', asyncHandler(async (req, res) => {
  const messageService = new MessageService();
  const messages = await messageService.getAllMessages();
  res.render('chat', { messages });
}));

module.exports = router;


