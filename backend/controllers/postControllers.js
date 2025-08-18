const Post = require("../models/Post");
const slugify =require( "slugify");

// CREATE a new post
const createPostController = async (req, res) => {
  try {
    const { title, summary, content, coverUrl, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const slug = slugify(title, { lower: true });

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(409).json({ error: "Post with similar title already exists" });
    }

    const newPost = new Post({
      title,
      summary,
      slug,
      content,
      coverUrl,    // <--- Add coverUrl here
      tags,
      author: req.user._id, // from authMiddleware
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating post", details: err.message });
  }
};


// GET all posts
const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts", details: err.message });
  }
};

// GET post by slug
//  const getPostBySlugController = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const post = await Post.findOne({ slug }).populate("author", "username email");
//     if (!post) return res.status(404).json({ error: "Post not found" });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching post", details: err.message });
//   }
// };
const getPostBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate("author", "username email avatarUrl")
      .populate({ path: "comments.user", select: "username avatarUrl" });

    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error fetching post", details: err.message });
  }
};



// UPDATE post
 const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Author check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to update this post" });
    }

    const updatedSlug = title ? slugify(title, { lower: true }) : post.slug;

    post.title = title || post.title;
    post.slug = updatedSlug;
    post.content = content || post.content;

    const updated = await post.save();
    res.json({ message: "Post updated", post: updated });
  } catch (err) {
    res.status(500).json({ error: "Error updating post", details: err.message });
  }
};

// DELETE post
 const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Author check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting post", details: err.message });
  }
};

module.exports = {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  updatePostController,
  deletePostController,
};