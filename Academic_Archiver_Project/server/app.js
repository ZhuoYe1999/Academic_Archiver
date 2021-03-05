//This is the main entry file
const path = require('path')
const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession);
const config = require('./config');
const user = require('./routes/user');
const paper = require('./routes/paper');
const app = express()

//built middleware body-Parser and expressSession 
app.use(bodyParser.urlencoded({ extended: false }))
//ake care of http request formatting
app.use(bodyParser.json())
app.use(expressSession({
  secret: config.sessionSecret,
  name: 'username',
  saveUninitialized: false,
  resave: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,
  },
  store: new MongoStore({
    url: config.sessionMongoUrl
  })
}))
//print request 
app.use(function logRequest(req, res, next) {
  console.log(`
  ------BEGIN------
  req.url: ${req.url},
  req.body: ${JSON.stringify(req.body)}
  ------END------
  `)
  next();
})
//solve Cross‑origin resource sharing problem
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin'));
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use('/api/user', user);
app.use('/api/paper', paper);

//connect to db
mongoose.connect(config.mongoUrl);
//listen to status of connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongoDB connected successfully')
});
//join the path of dirname and paper，static file agency
app.use(express.static(path.join(__dirname, 'paper')))
//back end port 3232 
app.listen(3232, () => console.log('listening on port 3232!'))