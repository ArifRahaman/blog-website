// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { createComment, getCommentsByPost } = require("../controllers/commentController");
const {authMiddleware} = require("../middleware/auth");

router.post("/", authMiddleware, createComment); // create a comment
router.get("/:postId", getCommentsByPost);       // get all comments for a post

module.exports = router;
