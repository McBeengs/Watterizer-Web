const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Teste() {
	// TESTA CONEXÃO
	this.testConnection = function(res) {
		connection.acquire(function(err, con) {
			res.send("OK");
			con.release();
		});
	};
} 

module.exports = new Teste();