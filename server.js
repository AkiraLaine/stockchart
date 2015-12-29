'use strict';

var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var route = require("./app/routes.js");
var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

route(app);

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});