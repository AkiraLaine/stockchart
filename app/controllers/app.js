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

function redrawChart() {
    if (myLineChart) {
        myLineChart.destroy();
    }
    myLineChart = new Chart(ctx).Line({
        labels: labels,
        datasets: datasets
    });
}

socket.on("stock added", function(stock) {
    stocks.push(stock);
    $("#stock_disp").append("<div class='delete-container'><div class='stock-color' data-stock='" + stock + "'></div><p class='delete-stock-text'>" + stock + "</p><button class='btn btn-warning btn-delete'>x</button></div>");
    $(".btn-delete").on("click", function(){
        var stockArr = $(this).parent().text().split("");
        stockArr.pop()
        var stock = stockArr.join("");
        stock = stock.replace(/[ ]/g, "");
        console.log("new" + stock);
        socket.emit("remove stock", stock);
        $(this).parent().remove();
    })
    chartStock(stock, function(stock) {
        $('*[data-stock="' + stock + '"]').attr("style", "background-color: " + getColorFromStock(stock));
        redrawChart();
    });
});

socket.on("stock removed", function(stock) {
    stocks.remove(stock);
    datasets = datasets.filter(function(dataset) {
        return stock !== dataset.label
    });
    $('*[data-stock="' + stock + '"]').parent().remove();
    redrawChart();
});

$("#submit").on("click", function() {
    var stock = $("#addStock").val();
    console.log("val" + stock)
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
                cb(stock);
            }
        }
    });
}

function getColorFromStock(stock) {
    var color = undefined;
    datasets.forEach(function(dataset) {
        if (dataset.label === stock) {
            color = dataset.strokeColor;
        }
    });
    return color;
}

function callChartLoop() {
    $("#stock_disp").empty();
    var done = 0;
    for (var i = 0; i < stocks.length; i++) {
        console.log(i);
        $("#stock_disp").append("<div class='delete-container'><div class='stock-color' data-stock='" + stocks[i] + "'> </div><p class='delete-stock-text'>" + stocks[i] + "</p><button class='btn btn-warning btn-delete'>x</button></div>");
        console.log("Checking: " + stocks[i]);
        chartStock(stocks[i], function(stock) {
            console.log(stock, 654);
            $('*[data-stock="' + stock + '"]').attr("style", "background-color: " + getColorFromStock(stock));
            done++;
        });
    }
    var interval = setInterval(function() {
        if (done === stocks.length) {
            $(".btn-delete").on("click", function(){
                var stockArr = $(this).parent().text().split("");
                stockArr.pop()
                var stock = stockArr.join("");
                stock = stock.replace(/[ ]/g, "");
                socket.emit("remove stock", stock);
                $(this).parent().remove();
            })
            $("h3").hide();
            redrawChart();
            clearInterval(interval);
        }
    }, 1000);
}

callChartLoop()
