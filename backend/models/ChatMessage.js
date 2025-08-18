// // // models/ChatMessage.js
// // const mongoose = require('mongoose');
// // const { Schema } = mongoose;

// // const ChatMessageSchema = new Schema({
// //   sender: {
// //     type: String,
// //     enum: ['user', 'bot'],
// //     required: true
// //   },
// //   content: {
// //     type: String,
// //     required: true
// //   },
// //   timestamp: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // module.exports = {
// //   ChatMessageSchema, // ✅ export the schema too
// //   ChatMessage: mongoose.model('ChatMessage', ChatMessageSchema)
// // };
// // models/ChatMessage.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const ChatMessageSchema = new Schema({
//   // sessionId is stored on the session document if embedded; keep optional for flexibility
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   sender: { type: String, enum: ['user','bot'], required: true },
//   content: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// module.exports = {
//   ChatMessageSchema,
//   ChatMessage: mongoose.model('ChatMessage', ChatMessageSchema) // optional standalone model
// };

// models/ChatMessage.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatMessageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['user','bot','system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },

  // NEW fields
  topic: { type: String, default: 'default', index: true },    // e.g. "Operating Systems"
  threadId: { type: String, default: 'main', index: true },    // thread identifier
  meta: { type: Schema.Types.Mixed }                           // any extra metadata (optional)
});

module.exports = {
  ChatMessageSchema,
  ChatMessage: mongoose.model('ChatMessage', ChatMessageSchema)
};
