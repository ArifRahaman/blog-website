const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow'],
    required: true
  },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = {
  Notification: mongoose.model('Notification', NotificationSchema)
};
