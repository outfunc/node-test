var events      = require('events'),
    util        = require('util'),
    fs          = require('fs'),
    watchDir    = './watch',
    processDir  = './done';

function Watcher( watchDir, processDif  ){
	this.watchDir = watchDir;
	this.processDir = processDir;
}

util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function(){
	var watcher = this;
	fs.readdir( this.watchDir, function(err , files){
		if( err  ) throw err;

		for( var index in files ){
			watcher.emit('process', files[index]);
		}
	} )
}


Watcher.prototype.start = function(){
	var watcher = this;
	//* watchFile関数は非推奨のためwatchを
	//fs.watch( watchDir, function(){
	fs.watchFile( watchDir, function(){
		watcher.watch();
	} )
}


var watcher = new Watcher( watchDir, processDir  );

watcher.on('process', function process(file){
	var watchFile = this.watchDir + '/' + file;
	var processFile = this.processDir + '/' + file.toLowerCase();
	fs.rename( watchFile, processFile, function(err){
		if( err ) throw err;
	} )
});

watcher.start();

