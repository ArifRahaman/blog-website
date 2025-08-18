const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ChatSessionSchema } =require('./ChatSession.js');
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  badges: [{ type: String }],
  chatSessions: [ChatSessionSchema]
});
module.exports = {
  User: mongoose.model('User', UserSchema)
  
};
