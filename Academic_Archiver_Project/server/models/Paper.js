//Paer table Entity 
const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  id: String,
  author: String,
  title: String,
  intro: String,
  url: String,
  comment: [{
    name: String,
    content: String,
    createTime: Number
  }]
});

const Paper = mongoose.model("paper", PaperSchema, 'paper');

module.exports = Paper