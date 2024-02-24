const mongoose = require('mongoose');
// const users=require('./users')

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
 
  currentDate: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
