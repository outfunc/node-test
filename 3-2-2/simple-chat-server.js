var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on("join", function(id, client){
	var welcome = "Welcome!\n" + "Guests online: " + this.listeners("broadcast").length;
	client.write(welcome + "\n");

	this.clients[id] = client;
	this.subscriptions[id] = function(senderId, message){
		if( id != senderId ){
			this.clients[id].write(message);
		}
	}

	this.on('broadcast', this.subscriptions[id]);
});

channel.on('shutdown', function(){
	console.log("shutdown");
	channel.emit('broadcast', '', "==========================\nChat has shut down.\n==========================\n");
	channel.removeAllListeners("broadcast");
});

var server = net.createServer(function(client){
	var id = client.remoteAddress + ":" + client.remotePort;
	// client.on('connection', function(){
	// 	channel.emit("join", id, client);
	// });
	client.on('data', function(data){
		data = data.toString();

		if( data == "shutdown\r\n" ){
			channel.emit('shutdown');
		}

		channel.emit('broadcast', id, data);
	})
	channel.emit("join", id, client);
	client.write('startig form scratch\n');

});

server.listen(8888)