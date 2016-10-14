const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Perfil() {
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perfil', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM perfil WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.create = function(perfil, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO perfil SET ?', perfil, function(err, result) {
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
	this.update = function(perfil, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE perfil SET ? WHERE id = ?', [perfil, perfil.id], function(err, result) {
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
			con.query('DELETE FROM perfil WHERE id = ?', [id], function(err, result) {
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

module.exports = new Perfil();