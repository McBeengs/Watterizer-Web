var connection = require('../connection');
var HttpStatus = require('http-status-codes');

function Pergunta() {
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perguntaseguranca', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perguntaseguranca WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.create = function(pergunta, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO perguntaseguranca SET ?', pergunta, function(err, result) {
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
	this.update = function(pergunta, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE perguntaseguranca SET ? WHERE id = ?', [pergunta, pergunta.id], function(err, result) {
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
	this.delete = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM perguntaseguranca WHERE id = ?', [id], function(err, result) {
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

module.exports = new Pergunta();