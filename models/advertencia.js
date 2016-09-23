var connection = require('../connection');
var HttpStatus = require('http-status-codes');

function Advertencia() {
	// MOSTRA TODAS AS ADVERTENCIAS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT * FROM advertencia", function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// ADICIONA UMA NOVA ADVERTENCIA
	this.create = function(advertencia, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO advertencia SET ?, data = NOW()', advertencia, function(err, result) {
				con.release();
				if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.CREATED)
					.send('CREATED');
				}
			});
		});

	};
} 

module.exports = new Advertencia();