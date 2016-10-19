const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Equipamento() {
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM equipamento', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM equipamento WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.check = function(mac, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT equipamento.mac, equipamento.nome, equipamento.descricao, setor.id AS id_setor, setor.setor, arduino.id AS id_arduino FROM equipamento INNER JOIN arduino ON(equipamento.id_arduino=arduino.id) INNER JOIN setor ON(arduino.id_setor=setor.id) WHERE mac = ?', [mac], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	this.checkArduino = function(mac, res) {
		connection.acquire(function(err, con) {
			var idArduino=0;
			con.query('SELECT id_arduino FROM equipamento WHERE mac = ?', [mac], function(err, result) {

				if (result[0]!=null) {
					idArduino=result[0].id_arduino;
				}
				con.query('SELECT equipamento.id,equipamento.mac, equipamento.nome, equipamento.descricao, setor.id AS id_setor, setor.setor, arduino.id AS id_arduino FROM equipamento INNER JOIN arduino ON(equipamento.id_arduino=arduino.id) INNER JOIN setor ON(arduino.id_setor=setor.id) WHERE id_arduino = ?', idArduino, function(err, result) {
				
				con.release();
				res.send(result);
			});

			});
			
		});
	};
	this.create = function(equipamento, res) {
		connection.acquire(function(err, con) {
			delete equipamento.command;
			con.query('SELECT id FROM equipamento WHERE mac = ?', [equipamento.mac], function(err, result) {
				if (result[0]==null) {
					con.query('INSERT INTO equipamento SET ?', [equipamento], function(err, result) {
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
				}
				else{
					con.query('UPDATE equipamento SET ? WHERE mac = ?', [equipamento, equipamento.mac], function(err, result) {
						con.release();
						if (err) {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.send({
								error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
							});
						} else {
							res.status(HttpStatus.OK)
							.send('UPDATED');
						}
					});
				}

			});
			
		});
	};
	this.update = function(equipamento, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE equipamento SET ? WHERE mac = ?', [equipamento, equipamento.mac], function(err, result) {
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
			con.query('DELETE FROM equipamento WHERE mac = ?', [mac], function(err, result) {
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

module.exports = new Equipamento();