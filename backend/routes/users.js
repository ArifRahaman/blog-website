// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const {authMiddleware} = require('../middleware/auth');

// GET /api/users/:id - get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('followers', 'username avatarUrl')
      .populate('following', 'username avatarUrl');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id - update profile (auth and own only)



// POST /api/users/:id/follow - follow/unfollow user
router.post('/:id/follow', authMiddleware, async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    if (userId.toString() === targetId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // ensure target exists
    const target = await User.findById(targetId).select('_id username followers').lean();
    if (!target) return res.status(404).json({ error: 'User not found' });

    // determine current state
    const currentlyFollowing = Array.isArray(target.followers) && target.followers.some(f => String(f) === String(userId));

    if (currentlyFollowing) {
      // unfollow
      await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { following: targetId } }),
        User.findByIdAndUpdate(targetId, { $pull: { followers: userId } })
      ]);
    } else {
      // follow (idempotent)
      await Promise.all([
        User.findByIdAndUpdate(userId, { $addToSet: { following: targetId } }),
        User.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } })
      ]);
    }

    // fetch fresh target data
    const updatedTarget = await User.findById(targetId).select('_id username followers').lean();
    const followerCount = Array.isArray(updatedTarget.followers) ? updatedTarget.followers.length : 0;
    const nowFollowing = Array.isArray(updatedTarget.followers) && updatedTarget.followers.map(String).includes(String(userId));

    res.json({
      message: currentlyFollowing ? 'Successfully unfollowed user.' : 'Successfully followed user.',
      followerCount,
      isFollowing: nowFollowing,
      author: {
        _id: updatedTarget._id,
        username: updatedTarget.username,
        followersCount: followerCount
      }
    });
  } catch (err) {
    console.error('follow route error', err);
    next(err);
  }
});


module.exports = router;
