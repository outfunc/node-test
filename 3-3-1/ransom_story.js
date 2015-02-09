// node.jsでシリアルフロー制御を実装してみる 2
// モジュールを使わずに実装してみる。

var fs = require("fs");
var request = require("request");
var htmlparser = require("htmlparser");
var configFileName = "./rss_feeds.txt";


function checkForRss(){
	fs.exists(configFileName, function(exists){
		if(!exists){
			return next(new Error("Missing RSS file : " + configFileName));
		}
		next(null, configFileName);
	});
}


function readRSSFile(configFileName){
	fs.readFile(configFileName, function(err, feedlist){
		if( err ) return next(err);


		console.log( feedlist.toString() );

		feedlist = feedlist.toString().replace(/~\s+|\s+$/g, '').split("\n");
		console.log( feedlist );
		var random = Math.floor(Math.random()*feedlist.length);
		next(null, feedlist[random]);
	});
}

function downloadRSSList( feedUrl ){
	request( {uri:feedUrl}, function(err, res, body){
		if( err ) return next(err);
		if( res.statusCode != 200 )
			return next( new Error("Abnormal response status code"));
		next( null, body);
	})
}

function parseRSSFeed( rss ){
	var handler = new htmlparser.RssHandler();
	var parser = new htmlparser.Parser(handler);

	parser.parseComplete(rss);

	if( !handler.dom.items.length){
		return next(new Error("No Rss items found"))
	}

	var item = handler.dom.items.shift();
	console.log( item.title );
	console.log( item.link );



}



var tasks = [ checkForRss, readRSSFile, downloadRSSList, parseRSSFeed ];



function next(err, result){
	if( err ) throw err;

	var currentTask = tasks.shift();

	if( currentTask ){
		currentTask(result);
	}
}
next();

