const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Arduino() {
	// MOSTRA TODOS OS ARDUINOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM arduino', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA TODOS OS ARDUINOS DE UM SETOR ESPECIFICADO
	this.listBySetor = function(idSetor, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM arduino WHERE id_setor = ?', [idSetor], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA UM ARDUINO
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM arduino WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// ADICIONA UM NOVO ARDUNO
	this.create = function(arduino, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO arduino SET ?', arduino, function(err, result) {
				con.release();
				if (err) {
					console.log(err);
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.OK).send(result.insertId.toString());
				}
			});
		});
	};

	// MODIFICA UM ARDUNO
	this.update = function(arduino, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE arduino SET ? WHERE id = ?', [arduino, arduino.id], function(err, result) {
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

	// DELETA UM ARDUNO
	this.delete = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM arduino WHERE id = ?', [id], function(err, result) {
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

module.exports = new Arduino();