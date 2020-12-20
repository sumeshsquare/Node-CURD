var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite = require('sqlite3');
var env = require('dotenv').load();
var port = process.env.PORT || 8080;

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