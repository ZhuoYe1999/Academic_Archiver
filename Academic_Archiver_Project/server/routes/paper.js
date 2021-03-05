const path = require('path')
const fs = require('fs')
const express = require('express');
const multer = require('multer');
const Paper = require('../models/Paper')
const User = require('../models/User')
const utils = require('../utils/index')

const paper = express.Router();
//create folder
var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};
//save uploaded files
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadFolder = `${path.resolve(__dirname, '..')}/paper/`
    createFolder(uploadFolder)
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });

//upload papers
paper.post('/upload', upload.array('fileUpaload', 20), (req, res) => {
  const userId = (req.files[0].originalname)
  res.send({
    code: 200,
    data: {
      url: `http://localhost:3232/${req.files[0].originalname}`
    },
    msg: 'upload paper successfully'
  })
})

//add new papers
paper.post('/new', (req, res) => {
  const author = req.session.user.username
  const userId = req.session.user._id
  const newPaper = new Paper({ author, ...req.body });
  newPaper.save((err, paper) => {
    if (err) throw err;
    User.findByIdAndUpdate(userId,
      { $push: { uploaded: paper._id } },
      (err, ret) => {
        if (err) {
          res.send({
            code: 400,
            msg: 'add paper fail'
          })
        } else {
          res.send({
            code: 200,
            msg: 'add paper successfully'
          })
        }
      })
  })
})

//list of papers
paper.post('/list', async (req, res) => {
  const _id = req.session.user._id
  const { status, currentPage } = req.body

  const user = await User.find({ _id }).find();

  const list = Array.from(new Set(user[0][status] || []))

  const paperIds = list.slice((currentPage - 1) * 5, currentPage * 5)

  const records = await Paper.find().where('_id').in(paperIds).exec();
  const total = list.length

  return res.json({ code: 200, msg: 'successful', data: { list: records }, total })
})

//search function with keywords
paper.post('/list/keyeword', async (req, res) => {
  const _id = req.session.user._id
  const { currentPage, keyword } = req.body
//创建匹配规则 i不分大小写
  const reg = new RegExp(keyword, 'i')
  const records = await Paper.find({
    $or: [
      { title: { $regex: reg } },
      { intro: { $regex: reg } },
    ]
  }).find();
  const total = records.length
  const list = records.slice((currentPage - 1) * 5, currentPage * 5)

  return res.json({ code: 200, msg: 'successful', data: { list: list }, total })
})

//check paper details
paper.post('/detail', async (req, res) => {
  const { _id } = req.body

  const papers = await Paper.find({ _id }).find();
  const paper = { ...papers[0]._doc };

  const authorName = paper.author
  const users = await User.find({ username: authorName }).find();
  const authorInfo = { ...users[0]._doc };
  if (!authorInfo.emailVisible) {
    delete authorInfo.email
  }

  if (!authorInfo.tagsVisible) {
    delete authorInfo.tags
  }
  
  return res.json({
    code: 200, msg: 'successful', data: {
      paper,
      author: authorInfo
    }
  })
})

//like papers
paper.post('/like', (req, res) => {
  const userId = req.session.user._id
  const paperId = req.body.id
  User.findByIdAndUpdate(userId,
    { $push: { liked: paperId } },
    (err, ret) => {
      if (err) {
        res.send({
          code: 400,
          msg: 'like paper failed'
        })
      } else {
        res.send({
          code: 200,
          msg: 'like paper successfully'
        })
      }
    })
})

//download papers
paper.post('/download', (req, res) => {
  const userId = req.session.user._id
  const paperId = req.body.id
  User.findByIdAndUpdate(userId,
    { $push: { saved: paperId } },
    (err, ret) => {
      if (err) {
        res.send({
          code: 400,
          msg: 'save paper failed'
        })
      } else {
        res.send({
          code: 200,
          msg: 'save paper successfully'
        })
      }
    })
})

//comment papers
paper.post('/comment', (req, res) => {
 
  const userId = req.session.user._id

  const { paperId, name, content, createTime } = req.body
  Paper.findByIdAndUpdate(paperId,
    { $push: { comment: { name, content, createTime } } },
    (err, paper) => {
      if (err) throw err;
      User.findByIdAndUpdate(userId,
        { $addToSet: { commented: paperId } },
        (err, ret) => {
          if (err) {
            res.send({
              code: 400,
              msg: 'comment paper failed'
            })
          } else {
            res.send({
              code: 200,
              msg: 'comment paper successfully'
            })
          }
        })
    })
})




module.exports = paper