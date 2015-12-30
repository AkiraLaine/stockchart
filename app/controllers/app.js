var ctx = document.getElementById("myChart").getContext("2d");
var labels = undefined;
var ydata = {};
var lineData;
var myLineChart = undefined;
var initialised = false;
var datasets = [];
var colors = {
    fillColor: "rgba(0,0,0,0)",
    color: function() {
        return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    }
}
var socket = io();
var stocks = [];
socket.on("stock added", function(stock) {
    stocks.push(stock);
    $("#stock_disp").append("<div><p>" + stock + "</p><button class='delete'>x</button></div>");
    $(".delete").on("click", function(){
        var stockArr = $(this).parent().text().split("");
        stockArr.pop()
        var stock = stockArr.join("");
        socket.emit("remove stock", stock);
        $(this).parent().remove();
    })
    chartStock(stock, function() {
        myLineChart = new Chart(ctx).Line({
            labels: labels,
            datasets: datasets
        });
    });
});

socket.on("stock removed", function(stock) {
    stocks.remove(stock);
    datasets = datasets.filter(function(dataset) {
        return stock !== dataset.label
    });
    myLineChart = new Chart(ctx).Line({
        labels: labels,
        datasets: datasets
    });
});

$("#submit").on("click", function() {
    var stock = $("#addStock").val();
    socket.emit("add stock", stock);
    $("#addStock").val("");
});

socket.on("stock list", function(stock_array) {
    stocks = stock_array;
    callChartLoop();
});

// socket.emit("remove stock", "FB");

Chart.defaults.global.responsive = true;

function chartStock(stock, cb) {
    $.ajax({
        type: "GET",
        url: "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=-mh6aB7AKrqyYRi5ztzQ",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            var dataArr = data.dataset.data.splice(0, 50);
            ydata[stock] = [];
            for (var i in dataArr) {
                ydata[stock].push(dataArr[i][4]);
            }
            ydata[stock].pop();
            if (!initialised) {
                labels = [];
                for (var i in dataArr) {
                    labels.push(dataArr[i][0]);
                }
                labels.pop();
                labels = labels.reverse()
                initialised = true;
                var color = colors.color();
                datasets.push({
                    label: stock,
                    fillColor: colors.fillColor,
                    strokeColor: color,
                    pointColor: color,
                    // pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    // pointHighlightStroke: "rgba(220,220,220,1)",
                    data: ydata[stock].reverse()
                });
            }
            else {
                var color = colors.color();
                datasets.push({
                    label: stock,
                    fillColor: colors.fillColor,
                    strokeColor: color,
                    pointColor: color,
                    // pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    // pointHighlightStroke: "rgba(110,100,40,1)",
                    data: ydata[stock].reverse()
                });
            }
            if (typeof cb === "function") {
                cb();
            }
        }
    });
}

function callChartLoop() {
    $("#stock_disp").empty();
    for (var i = 0; i < stocks.length; i++) {
        console.log(i);
        if (i === stocks.length -1 ) {
            $("h3").html("<h3>Loading " + stocks[i] + "</h3>")
            $("#stock_disp").append("<div><p>" + stocks[i] + "</p><button class='delete'>x</button></div>");
            $(".delete").on("click", function(){
                var stockArr = $(this).parent().text().split("");
                stockArr.pop()
                var stock = stockArr.join("");
                socket.emit("remove stock", stock);
                $(this).parent().remove();
            })
            chartStock(stocks[i], function() {
                $("h3").hide();
                myLineChart = new Chart(ctx).Line({
                    labels: labels,
                    datasets: datasets
                });
            });
        }
        else {
            $("h3").html("<h3>Loading " + stocks[i] + "</h3>")
            $("#stock_disp").append("<div><p>" + stocks[i] + "</p><button class='delete'>x</button></div>");
            console.log("Checking: " + stocks[i]);
            chartStock(stocks[i]);
        }
    }
}

callChartLoop()
