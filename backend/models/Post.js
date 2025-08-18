// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const { CommentSchema } =require('./Comments.js');
// const PostSchema = new Schema({
//   author: { type: Schema.Types.ObjectId, ref: 'User' },
//   title: { type: String, required: true },
//   slug: { type: String, required: true, unique: true },
//   summary: String,
//   content: String, // markdown or HTML
//   tags: [{ type: String }],
//   coverUrl: String,
//   likes: { type: Number, default: 0 },
//   comments: [CommentSchema],
//   createdAt: { type: Date, default: Date.now }
// });
// module.exports = {
//  CommentSchema,
//  Post: mongoose.model('Post', PostSchema)
// };
// //export like this 

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { CommentSchema } = require('./Comments.js');

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: String,
  content: String,
  tags: [{ type: String }],
  coverUrl: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // <-- new
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
