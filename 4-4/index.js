var http        = require("http");
var qs          = require("querystring");
var formidable  = require("formidable");
var items       = [];

var server = http.createServer(function(req,res){

	if("/" == req.url){
		switch( req.method ){
			case "GET":
				show( res );
				break;

			case "POST":
				upload(req, res);
				break;

			default:
				badrequest(res);
				break;
		}
	}
	else{
		notFound(res);
	}
});

server.listen(3000);



function show( res ){
	var html = ""
	+ "<!DOCTYPE html>"
	+ "<html>"
	+ "<head>"
	+ "<title>TO-DO List</title>"
	+ '<script src="/socket.io/socket.io.js" type="text/javascript"></script>'
	+ "</head>"
	+ "<body>"
	+ "<ul>"
	+ items.map(function(item){
			return "<li>" + item + "</li>"
		}).join("")
	+ "</ul>"
	+ '<form method="post" action="/" enctype="multipart/form-data">'
	+ '<p><input type="text" name="name"></p>'
	+ '<p><input type="file" name="file"></p>'
	+ '<p><input type="submit" value="Upload"></p>'
	+ '</form>'
	+ '</body>'
	+ '</html>';

	res.setHeader("Content-Type", "text/html");
	res.setHeader("Content-Length", Buffer.byteLength(html));
	res.end(html);
}


function upload( req, res ){
	if( !isFormData(req) ){
		res.statusCode = 400;
		res.end("Bad Request: expecting multipart/form-data");
		return;
	}

	var form = new formidable.IncomingForm();

	// form.on("field", function(field, value){
	// 	console.log(field)
	// 	console.log(value);
	// });

	// form.on("file", function(name, file){
	// 	console.log(name);
	// 	console.log(file);
	// })

	// form.on("end", function(){
	// 	res.end("upload complete");
	// })
	form.parse(req, function(err, fields, file){
		console.log( fields);
		console.log(file);
		res.end("upload complete");
	});

	form.on("progress", function(bytesReceived, bytesExpected){
		var percent = Math.floor(bytesReceived / bytesExpected * 100 );
		console.log( percent );
	});
}

function isFormData(req){
	var type = req.headers['content-type'] || "";
	return 0 == type.indexOf("multipart/form-data");
}

function add( req, res ){
	var body = '';
	req.on("data", function(chunk){
		body += chunk;
	});
	req.on("end", function(){
		var obj = qs.parse(body);
		items.push(obj.item);
		show(res);
	})
}

function notFound(res){
	res.statusCode = 404;
	res.setHeader("Content-Type","text/plain");
	res.end("Not Found");
}

function badRequest(res){
	res.statusCode = 400;
	res.setHeader("Content-Type", "test/plain");
	res.end("Bad Request");
}