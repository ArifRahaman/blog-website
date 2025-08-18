const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;         // ✅ so you can access req.user._id
    req.userId = user._id;   // optional for other routes
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
// middleware/auth.js
// const jwt = require('jsonwebtoken');
// const {User} = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//   const hdr = req.headers.authorization || '';
//   if (!hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
//   const token = hdr.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(payload.sub || payload.id);
//     if (!user) return res.status(401).json({ error: 'User not found' });
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Auth error', err);
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };
//  module.exports = { authMiddleware };
