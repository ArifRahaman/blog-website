// controllers/commentController.js
const {Comment} = require("../models/Comments");
const Post = require("../models/Post");

exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      content,
    });
    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('comments.user', 'username avatarUrl');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};