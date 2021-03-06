const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Pergunta() {
	// LISTA TODAS AS PERGUNTAS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perguntasecreta', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// LISTA POR ID
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perguntasecreta WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// CRIA PERGUNTA
	this.create = function(pergunta, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO perguntasecreta SET ?', pergunta, function(err, result) {
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
	// ATUALIZA PERGUNTA
	this.update = function(pergunta, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE perguntasecreta SET ? WHERE id = ?', [pergunta, pergunta.id], function(err, result) {
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
	// DELETA PERGUNTA
	this.delete = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM perguntasecreta WHERE id = ?', [id], function(err, result) {
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