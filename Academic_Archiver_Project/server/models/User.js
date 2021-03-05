//user table Entity 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  emailVisible: Boolean,
  tagsVisible: Boolean,
  tags: [String],
  uploaded: [String],
  saved: [String],
  liked: [String],
  commented: [String]
});

const User = mongoose.model("user", userSchema, 'user');

module.exports = User