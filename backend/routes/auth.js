// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const {authMiddleware}= require('../middleware/auth');
JWT_SECRET="sdsadwfefefefefeffefadafafafaf"
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function applyUserUpdates(userId, updates) {
  // return updated user (without passwordHash)
  return await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
    select: '-passwordHash'
  });
}

// POST /api/auth/signup
// router.post('/signup', async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
//     const exists = await User.findOne({ $or: [{ email }, { username }] });
//     if (exists) {
//       return res.status(409).json({ error: 'Email or username already in use' });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     const user = new User({ username, email, passwordHash });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.status(201).json({ token, user: { id: user._id, username, email, avatarUrl: user.avatarUrl } });
//   } catch (err) {
//     next(err);
//   }
// });
// router.post("/signup", async (req, res) => {
//   const { username, email, password, bio, avatarUrl } = req.body;

//   // Basic validation
//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "Username, email, and password are required" });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash password
//     const passwordHash = await bcrypt.hash(password, 10);

//     // Create new user (bio and avatarUrl are optional)
//     const newUser = new User({
//       username,
//       email,
//       passwordHash,
//       bio: bio || "",             // Optional
//       avatarUrl: avatarUrl || ""  // Optional
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         bio: newUser.bio,
//         avatarUrl: newUser.avatarUrl
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

const upload = require("../middleware/uploadAvatar");

router.post("/signup", async (req, res) => {
  const { username, email, password, bio, avatarUrl } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      passwordHash,
      bio: bio || "",
      avatarUrl: avatarUrl || ""
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email, avatarUrl: user.avatarUrl } });
  } catch (err) {
    next(err);
  }
});
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (req.userId.toString() !== targetId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { username, email, bio, avatarUrl } = req.body;
    const updates = {};

    if (username !== undefined) {
      const uname = String(username).trim();
      if (!uname) return res.status(400).json({ error: 'Username cannot be empty' });

      // check uniqueness
      const existing = await User.findOne({ username: uname, _id: { $ne: targetId } });
      if (existing) return res.status(409).json({ error: 'Username already in use' });

      updates.username = uname;
    }

    if (email !== undefined) {
      const em = String(email).trim().toLowerCase();
      if (!emailRe.test(em)) return res.status(400).json({ error: 'Invalid email' });

      const existing = await User.findOne({ email: em, _id: { $ne: targetId } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });

      updates.email = em;
    }

    if (bio !== undefined) {
      updates.bio = String(bio).slice(0, 1000); // limit length if you want
    }

    if (avatarUrl !== undefined) {
      updates.avatarUrl = String(avatarUrl);
    }

    // if nothing to update
    if (Object.keys(updates).length === 0) {
      const user = await User.findById(targetId).select('-passwordHash');
      return res.json(user);
    }

    const updated = await applyUserUpdates(targetId, updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
// GET /api/auth/me
// PUT /api/auth/me - update current user profile
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});
router.put('/me/update', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { username, email, bio, avatarUrl } = req.body;
    const updates = {};

    if (username !== undefined) {
      const uname = String(username).trim();
      if (!uname) return res.status(400).json({ error: 'Username cannot be empty' });

      const existing = await User.findOne({ username: uname, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ error: 'Username already in use' });

      updates.username = uname;
    }

    if (email !== undefined) {
      const em = String(email).trim().toLowerCase();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(em)) return res.status(400).json({ error: 'Invalid email' });

      const existing = await User.findOne({ email: em, _id: { $ne: userId } });
      if (existing) return res.status(409).json({ error: 'Email already in use' });

      updates.email = em;
    }

    if (bio !== undefined) {
      updates.bio = String(bio).slice(0, 1000);
    }

    if (avatarUrl !== undefined) {
      updates.avatarUrl = String(avatarUrl);
    }

    if (Object.keys(updates).length === 0) {
      const user = await User.findById(userId).select('-passwordHash');
      return res.json(user);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-passwordHash');
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
