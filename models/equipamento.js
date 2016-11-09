const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Equipamento() {
	// LISTA OS EQUIPAMENTOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM equipamento', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// LISTA EQUIPAMENTO POR ID
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM equipamento WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// CHECA EQUIPAMENTO COM SETOR E ARDUINO
	this.check = function(mac, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT equipamento.mac, equipamento.nome, equipamento.descricao, setor.id AS id_setor, setor.setor, arduino.id AS id_arduino FROM equipamento INNER JOIN arduino ON(equipamento.id_arduino=arduino.id) INNER JOIN setor ON(arduino.id_setor=setor.id) WHERE mac = ?', [mac], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// VERIFICA EQUIPAMENTOS SEM ARDUINO
	this.checkNovo = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM equipamento WHERE id_arduino IS NULL', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// SELECIONA EQUIPAMENTO COM O MESMO ID ARDUINO
	this.checkArduino = function(mac, res) {
		connection.acquire(function(err, con) {
			var idArduino=0;
			con.query('SELECT id_arduino FROM equipamento WHERE mac = ?', [mac], function(err, result) {

				if (result[0]!=null) {
					idArduino=result[0].id_arduino;
				}
				con.query('SELECT equipamento.id,equipamento.numero_porta,equipamento.mac, equipamento.nome, equipamento.descricao, setor.id AS id_setor, setor.setor, arduino.id AS id_arduino FROM equipamento INNER JOIN arduino ON(equipamento.id_arduino=arduino.id) INNER JOIN setor ON(arduino.id_setor=setor.id) WHERE id_arduino = ?', idArduino, function(err, result) {

					con.release();
					res.send(result);
				});

			});
			
		});
	};
	// CRIA UM EQUIPAMENTO OU ATUALIZA O MESMO
	this.create = function(equipamento, res) {
		connection.acquire(function(err, con) {
			delete equipamento.command;
			con.query('SELECT id FROM equipamento WHERE mac = ?', [equipamento.mac], function(err, result) {
				if (result[0]==null) {
					con.query('INSERT INTO equipamento SET ?', [equipamento], function(err, result) {
						if (err) {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.send({
								error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
							});
						} else {
							res.status(HttpStatus.OK).send(result.insertId.toString())
						}
					});
				}
				else{
					con.query('UPDATE equipamento SET ? WHERE mac = ?', [equipamento, equipamento.mac], function(err, result) {
						if (err) {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.send({
								error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
							});
						} else {
							res.status(HttpStatus.OK).send(result.insertId.toString())
						}
					});
				}
				con.query('SELECT * FROM equipamento WHERE mac = ?', [equipamento.mac], function(err, result) {
					var equipamentoResponsavel = result[0];
					if (equipamentoResponsavel!=undefined && equipamentoResponsavel.mac!="null") {
						console.log(equipamentoResponsavel);
						con.query('UPDATE ARDUINO SET id_computador_responsavel = ? WHERE id = ? AND id_computador_responsavel IS NULL', [equipamentoResponsavel.id,equipamentoResponsavel.id_arduino], function(err, result) {
						});
					}
					con.release();
				});
				

			});

});
};
	// APENAS ATUALIZA O EQUIPAMENTO
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
	// APAGA UM EQUIPAMENTO COM BASE NO MAC
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