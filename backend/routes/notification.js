// routes/notifications.js
const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const authMiddleware = require('../middleware/auth');

// GET /api/notifications - get current user's notifications
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ date: -1 })
      .populate('from', 'username avatarUrl')
      .populate('post', 'title slug');
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/mark-read - mark notifications as read
router.post('/mark-read', authMiddleware, async (req, res, next) => {
  try {
    const { ids } = req.body; // array of notification IDs
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'ids must be an array' });
    }
    await Notification.updateMany(
      { _id: { $in: ids }, user: req.userId },
      { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
});


// POST /api/notifications/clear - clear all notifications
router.post('/clear', authMiddleware, async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.userId });
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    next(err);
  }
});
module.exports = router;