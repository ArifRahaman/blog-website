// utils/sendNotification.js
const { Notification } = require('../models/Notification');

async function sendNotification({ toUserId, fromUserId, type, postId, io }) {
  if (!toUserId || !fromUserId || !type || !io) return;

  const newNotification = await Notification.create({
    user: toUserId,
    from: fromUserId,
    type,
    post: postId,
    read: false,
    date: new Date(),
  });

  // Emit real-time notification
  io.to(toUserId.toString()).emit('notification', {
    _id: newNotification._id,
    type,
    from: fromUserId,
    post: postId,
    date: newNotification.date,
  });
}

module.exports = sendNotification;
