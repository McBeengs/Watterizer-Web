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
			var setor = canvas.setor;
			delete canvas.setor;
			con.query('SELECT * FROM canvas,setor WHERE setor.setor=? AND setor.id_canvas=canvas.id ', [setor], function(err, result) {
				var resultado = result;
				var id;
				if(resultado.length>0){
					con.query('DELETE FROM canvas WHERE id = ?', [resultado[0].id_canvas], function(err, result) {
					});
				}

				con.query('INSERT INTO canvas SET ?', canvas, function(err, result) {
					id=result.insertId
					if (err) {
						res.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.send({
							error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
						});
					} else {
						res.status(HttpStatus.CREATED)
						.send('CREATED');
					}
					console.log(id);
					console.log(setor)
					con.query('UPDATE setor SET id_canvas=? WHERE setor = ?', [id,setor], function(err, result) {
						con.release();
					});
				});;
			});
		});
	};

	this.update = function(canvas, res) {
		connection.acquire(function(err, con) {
			var setor = canvas.setor;
			delete canvas.setor;
			con.query('UPDATE canvas,setor SET ? WHERE setor.setor=? AND setor.id_canvas=canvas.id', [canvas, setor], function(err, result) {
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
	this.delete = function(canvas, res) {
		connection.acquire(function(err, con) {
			var setor = canvas.setor;
			delete canvas.setor;
			con.query('DELETE FROM `canvas`WHERE `id` in (SELECT DISTINCT `id_canvas` FROM `setor`) AND ? in (SELECT DISTINCT `setor` FROM `setor`)', [setor], function(err, result) {
				
			});
			con.query('UPDATE `setor` set id_canvas=0 WHERE setor=?', [setor], function(err, result) {
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