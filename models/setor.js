var connection = require('../connection');
var HttpStatus = require('http-status-codes');

function Setor() {
	// MOSTRA TODOS OS SETORES
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM setor', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA UM SETOR
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM setor WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// CRIA UM NOVO SETOR
	this.create = function(setor, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO setor SET ?', setor, function(err, result) {
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

	// MODIFICA UM SETOR
	this.update = function(setor, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE setor SET ? WHERE id = ?', [setor, setor.id], function(err, result) {
				con.release();
				if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.OK)
					.send('OK');
				}
			});
		});
	};

	// DELETA UM SETOR
	this.delete = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM setor WHERE id = ?', [id], function(err, result) {
				con.release();
				if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.NO_CONTENT)
					.send('NO CONTENT');
				}
			});
		});
	};
} 

module.exports = new Setor();