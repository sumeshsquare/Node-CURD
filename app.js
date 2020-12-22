var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite = require('sqlite3');
var env = require('dotenv').load();
var port = process.env.PORT || 8080;
const jwt = require('jsonwebtoken')
require("dotenv").config();

// const cors = require('cors');
// app.use(cors());
// app.options('*', cors());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// models
var models = require("./models");

// routes
var flows = require('./routes/flows');

//Sync Database
models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// register routes
app.use('/flows', flows);

// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send('API Running')
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});

module.exports = app;


let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(req.body.password === process.env.ADMIN_PASS && req.body.username === "admin") {
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '450s' })
}
