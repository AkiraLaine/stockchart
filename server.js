'use strict';

var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var route = require("./app/routes.js");
var stocks = ["FB", "AMZN"];
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

var server = app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit("stock list", stocks);
  
  socket.on("add stock", function(stock) {
  	console.log("Added stock: " + stock);
  	stocks.push(stock);
  	io.emit("stock added", stock);
  });
  
  socket.on("remove stock", function(stock) {
  	console.log(stock + " got wants to be removed");
  	if (stocks.indexOf(stock) !== -1) {
  		console.log(stock + " is in ze stocks");
  		stocks.remove(stock);
  		console.log(stock + " got sliced");
  		console.log(stocks);
  		io.emit("stock removed", stock);
  	}
  });
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};