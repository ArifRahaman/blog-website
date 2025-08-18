// models/Comment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  date: { type: Date, default: Date.now }
});

module.exports = {
  CommentSchema, // ✅ export schema too
  Comment: mongoose.model('Comment', CommentSchema)
};
