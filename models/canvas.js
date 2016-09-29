var connection = require('../connection');
var HttpStatus = require('http-status-codes');

function Canvas() {
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM canvas', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM canvas WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	this.create = function(canvas, res) {
		connection.acquire(function(err, con) {
			var nome = canvas.nome;
			delete canvas.nome;
			con.query('INSERT INTO canvas SET ?', canvas, function(err, result) {
				if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.CREATED)
					.send('CREATED');
				}
				console.log(result.insertId);
				con.query('UPDATE computador SET id_canvas=? ,posicionado=1 WHERE nome = ?', [result.insertId,nome], function(err, result) {
					con.release();
				});
			});
		});
	};

	this.update = function(canvas, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE canvas SET ? WHERE id = ?', [canvas, canvas.id], function(err, result) {
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
			con.query('DELETE FROM canvas WHERE id = ?', [id], function(err, result) {
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

module.exports = new Canvas();