var connection = require('../connection');
var HttpStatus = require('http-status-codes');

function Computador() {
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM computador', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM computador WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.check = function(mac, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT *,setor FROM computador INNER JOIN setor ON(computador.id_setor=setor.id) WHERE mac = ?', [mac], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.create = function(computador, res) {
		connection.acquire(function(err, con) {
			 delete computador.command;
			con.query('INSERT INTO computador SET ?', [computador], function(err, result) {
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
	this.update = function(computador, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE computador SET ? WHERE id = ?', [computador, computador.id], function(err, result) {
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
	this.delete = function(mac, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM computador WHERE mac = ?', [mac], function(err, result) {
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

module.exports = new Computador();