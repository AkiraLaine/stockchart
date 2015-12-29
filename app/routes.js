var path = process.cwd();

module.exports = function(app){
    app.get("/", function(err,res){
        res.sendFile(path + "/public/index.html");
    })
}