// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const slugify = require('../utils/slugify');


// GET /api/posts - list posts with optional pagination and filters
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username avatarUrl');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug - get single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username avatarUrl')
      .populate('comments.user', 'username avatarUrl');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - create new post
router.post('/', authMiddleware, async (req, res, next) => {
  console.log('Raw req.body:', req.body);
  try {
    const { title, summary, content, tags, coverUrl } = req.body;
        console.log('Received coverUrl:', coverUrl);  // <---- add this

    const slug = slugify(title);
    const exists = await Post.findOne({ slug });
    if (exists) return res.status(409).json({ error: 'Title conflicts, choose another' });
  // console.log('req.user:', req.user);

    const post = new Post({
      author: req.user._id,
      title,
      slug,
      summary,
      content,
      tags,
      coverUrl,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// PUT /api/posts/:id - update post (author only)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    const { title, summary, content, tags, coverUrl } = req.body;
    if (title && title !== post.title) {
      post.slug = slugify(title);
      post.title = title;
    }
    post.summary = summary;
    post.content = content;
    post.tags = tags;
    post.coverUrl = coverUrl;
    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id - delete post (author only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts/:id/like - like post


// POST /api/posts/:id/comment - add comment
router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const { text } = req.body;
    const comment = { user: req.userId, text, date: new Date() };
    post.comments.push(comment);
    await post.save();

    // Populate only the newly added comment's user
    await post.populate({
      path: 'comments.user',
      select: 'username email'
    });

    // Create notification if commenting on someone else's post
    if (post.author.toString() !== req.userId) {
      await Notification.create({
        user: post.author,
        type: 'comment',
        from: req.userId,
        post: post._id
      });
    }

    // Send back the last comment with populated user
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
