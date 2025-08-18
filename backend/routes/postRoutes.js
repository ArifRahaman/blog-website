const express = require("express");
const {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  updatePostController,
  deletePostController,
} = require("../controllers/postControllers");
const Post = require("../models/Post");
const {Notification} = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth.js");
// console.log(typeof createPostController);
// console.log(typeof authMiddleware);
console.log(
  typeof createPostController,
  typeof getAllPostsController,
  typeof getPostBySlugController,
  typeof updatePostController,
  typeof deletePostController
);

const router = express.Router();

router.post("/", authMiddleware, createPostController);
router.get("/", getAllPostsController);
// router.get("/:slug", getPostBySlugController);
router.get("/:slug", async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "username email");
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
});
router.put("/:id", authMiddleware, updatePostController);
router.delete("/:id", authMiddleware, deletePostController);
// routes/posts.js
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.userId.toString();
    const idx = post.likedBy.findIndex((u) => u.toString() === userId);

    let liked;
    if (idx === -1) {
      // add like
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
      liked = true;
    } else {
      // remove like
      post.likedBy.splice(idx, 1);
      post.likes = Math.max(0, (post.likes || 1) - 1);
      liked = false;
    }

    await post.save();

    // optional: create notification on like (only when liked === true)
    if (liked && post.author.toString() !== userId) {
      await Notification.create({
        user: post.author,
        type: 'like',
        from: userId,
        post: post._id
      });
    }

    // return likes + whether current user liked it
    res.json({ likes: post.likes, liked, likedBy: post.likedBy });
  } catch (err) {
    next(err);
  }
});

// routes/posts.js
// routes/posts.js (or controllers)
router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const createdComment = {
      user: req.userId,
      text: text.trim(),
      date: new Date()
    };

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: createdComment } },
      { new: true }
    ).populate('comments.user', 'username avatarUrl');

    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });

    const last = updatedPost.comments[updatedPost.comments.length - 1];
    res.status(201).json(last);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
