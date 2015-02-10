var http    = require("http");
var url = "http://google.com";
var body = '<p>Redirecting to <a href="' + url + '"></p>';

var server  = http.createServer(function(req,res){
	res.setHeader("Location", url);
	res.setHeader("Content-Length", body.length);
	res.setHeader("Content-Type", "text/html");
	res.statusCode = 302;
	res.end(body);
}).listen(3000);