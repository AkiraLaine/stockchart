'use strict';

var express = require('express');
var session = require('express-session');
var route = require("./app/routes.js");
var stocks = ["FB", "AMZN"];
var app = express();
var request = require('request');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

route(app);

var port = process.env.PORT || 8080;

var server = app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
    socket.emit("stock list", stocks);
    
    socket.on("add stock", function(stock) {
        stock = stock.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/&/g, "").replace(/\?/g, "");
        request("https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=-mh6aB7AKrqyYRi5ztzQ", function (error, response, body) {
            if (!error && response.statusCode == 200) {
                stocks.push(stock);
    	        io.emit("stock added", stock);
            }
        })
    });
    
    socket.on("remove stock", function(stock) {
            stock = stock.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/&/g, "").replace(/\?/g, "");
            if (stocks.indexOf(stock) > -1) {
                stocks.remove(stock);
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