const express = require('express');
const User = require('../models/User')

const user = express.Router();

// sign up
user.post('/join', (req, res) => {
  //get users name and email
  let newUserInfo = Object.assign(req.body, { tasks: [] }),
    username = newUserInfo.username,
    email = newUserInfo.email;

  User.find({ username, email }, (err, docs) => {
    if (docs.length > 0) {
      res.send({
        code: 400,
        msg: 'Email or username is invalid or already taken'
      })
    } else {
      req.session.user = newUserInfo;
      const newUser = new User(newUserInfo);
      newUser.save((err) => {
        if (err) throw err;
        res.send({
          code: 200,
          msg: 'join successfully'
        })
      })
    }
  })
})

// login
user.post('/login', (req, res) => {
  let userInfo = req.body,
    data;
  User.find(userInfo, (err, docs) => {
    if (err) throw err;
    else {
      if (docs.length > 0) {
        req.session.user = docs[0],
          data = {
            code: 200,
            msg: 'login successfully'
          }
      } else {
        data = {
          code: 400,
          msg: 'Incorrect username or password.'
        }
      }
      res.send(data);
    }
  })
});

// get user info
user.get('/userInfo', async (req, res) => {
  let data;
  if (req.session.user) {
    const _id = req.session.user._id
    const user = await User.find({ _id }).find();
    const { tags, email, username, emailVisible, tagsVisible } = user[0]
    const publicUserInfo = { username }
    
    publicUserInfo.emailVisible = emailVisible
    publicUserInfo.email = email
  
    publicUserInfo.tagsVisible = tagsVisible
    publicUserInfo.tags = tags
    

    data = {
      data: { ...publicUserInfo },
      code: 200,
      msg: '1'
    }
  } else {
    data = {
      code: 400,
      msg: 'not login'
    }
  }
  res.send(data)
})

//update user info
user.post('/updateUser', (req, res) => {
  const userId = req.session.user._id
  const newInfo = req.body

  User.findByIdAndUpdate(userId,
    { ...newInfo },
    (err, ret) => {
      if (err) {
        res.send({
          code: 200,
          msg: 'update user falfid'
        })
      } else {
        req.session.user = ret
        res.send({
          code: 200,
          msg: 'update user successfully'
        })
      }
    })
})

// log out
user.get('/logout', (req, res) => {
  req.session.user = null
  res.send({
    code: 200,
    msg: 'logout successfully'
  })
})

module.exports = user;
