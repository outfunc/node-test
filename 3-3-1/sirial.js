// node.jsでシリアルフロー制御を実装してみる 1
// まずは便利なモジュールを使用する

var flow = require("nimble");

flow.series([
	function( callback ){
		setTimeout(function(){
			console.log("I excute first.");
			callback();

		}, 1000);

	},
	function( callback ){
		setTimeout(function(){
			console.log( "I excute next.");
			callback();

		}, 500);
	},
	function( callback ){
		setTimeout(function(){
			console.log( "I excute last.");
			callback();
		}, 100);
	}
]);