var ctx = document.getElementById("myChart").getContext("2d");
var labels = [];
var ydata = [];
var lineData;

$.ajax({
    type: "GET",
    url: "https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=-mh6aB7AKrqyYRi5ztzQ",
    contentType: "application/json",
    dataType: "json",
    success: function(data){
        var dataArr = data.dataset.data.splice(0,10);
        for(var i in dataArr){
            console.log(dataArr[i][0], dataArr[i][4]);
            labels.push(dataArr[i][0]);
            ydata.push(dataArr[i][4]);
        }
        console.log(labels);
        lineData = {
            labels: labels,
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: ydata
                }
            ]
        };
        var myLineChart = new Chart(ctx).Line(lineData);
    }
});