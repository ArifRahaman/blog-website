// models/ChatSession.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ChatMessageSchema } = require('./ChatMessage');

const ChatSessionSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  messages: { type: [ChatMessageSchema], default: [] }
});

ChatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = { ChatSessionSchema };