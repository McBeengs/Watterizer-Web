const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Canvas() {
	// LISTA TODOS OS Canvas
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM setor', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// LISTA OS CANVAS POR SETOR
	this.getOne = function(setor, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT canvas FROM setor WHERE id = ?', [setor], function(err, result) {

				con.release();
				res.send(result);
			});
		});
	};
	// CRIA O CANVAS COM BASE NO SETOR
	this.create = function(canvas, res) {
		canvas.setor=canvas.setor.substr(canvas.setor.lastIndexOf(":")+1,canvas.setor.length-1);
		canvas.codigo=JSON.stringify(canvas.codigo)
		connection.acquire(function(err, con) {
			con.query('UPDATE setor SET canvas=? WHERE id = ?', [canvas.codigo,canvas.setor], function(err, result) {
								console.log(err)
				con.release();
				res.status(HttpStatus.OK)
				.send('OK');
			});
		});
	};
	// ATUALIZA UM CANVAS BASEADO NO SETOR
	this.update = function(canvas, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE setor SET canvas=? WHERE id = ?', [canvas, canvas.id], function(err, result) {
				con.release();
				if (err) {
					console.log(err)
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
	// APAGA UM CANVAS COM BASE NO SETOR
	this.delete = function(setor, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE `setor` set canvas=NULL WHERE id=?', [setor], function(err, result) {
				console.log(result)
				if (err) {
					console.log(err)
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.NO_CONTENT)
					.send('NO CONTENT');
				}
			});
			// con.query('DELETE FROM `canvas`WHERE `id` in (SELECT DISTINCT `id_canvas` FROM `setor`) AND ? in (SELECT DISTINCT `setor` FROM `setor`)', [setor], function(err, result) {
				
			// });
		con.release();
	});
	};
} 

module.exports = new Canvas();