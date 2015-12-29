var ctx = document.getElementById("myChart").getContext("2d");
var labels = undefined;
var ydata = {};
var lineData;
var myLineChart = undefined;
var initialised = false;
var datasets = [];
var stocks = ["FB", "AAPL"];
var colors = {
    fillColor: "rgba(0,0,0,0)",
    color: function(){
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
    }
}

function chartStock(stock, cb) {
    $.ajax({
        type: "GET",
        url: "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=-mh6aB7AKrqyYRi5ztzQ",
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            var dataArr = data.dataset.data.splice(0,50);
            ydata[stock] = [];
            for(var i in dataArr){
                console.log(dataArr[i][0], dataArr[i][4]);
                ydata[stock].push(dataArr[i][4]);
            }
            if (!initialised) {
                labels = [];
                for(var i in dataArr){
                    labels.push(dataArr[i][0]);
                }
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
            } else {
                console.log(stock, ydata[stock]);
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

function callChartLoop(){
    for(var i = 0; i < stocks.length; i++){
        if (i === stocks.length - 1) {
            chartStock(stocks[i], function() {
                console.log("Test!");
                $("h3").hide();
                myLineChart = new Chart(ctx).Line({
                    labels: labels,
                    datasets: datasets
                });
            });
        } else {
            chartStock(stocks[i]);
        }
    }
}


callChartLoop()