// // models/ChatSession.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const { ChatMessageSchema } = require('./ChatMessage'); // ✅ import the schema

// const ChatSessionSchema = new Schema({
//   sessionId: { type: String, required: true },
//   startedAt: { type: Date, default: Date.now },
//   messages: [ChatMessageSchema]
// });

// module.exports = {
//   ChatSessionSchema,
//   ChatSession: mongoose.model('Chatsession', ChatSessionSchema)
// };

// models/ChatSession.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ChatMessageSchema } = require('./ChatMessage');

const ChatSessionSchema = new Schema({
  userId: { type: String, required: true, index: true }, // X-User-Id owner
  title: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // embedded messages (simple & efficient for typical chat flows)
  messages: { type: [ChatMessageSchema], default: [] }
});

ChatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = { ChatSessionSchema }; // ✅ export as object
