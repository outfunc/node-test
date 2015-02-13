var pg          = require("pg");
var conString   = "tcp://nude005:005@localhost:5432/blogapp";
var client      = new pg.Client(conString);
client.connect();
client.query("INSERT INTO users (name, age) VALUES ($1, $2) RETURNING name", ["Mike", 39],
	function(err, result){
		if(err) throw err;
		console.log("Insert Name is " + result.rows[0].name)
	});