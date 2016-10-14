const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Gastoespecifico() {
	// MOSTRA TODOS OS gastosespecificos DE TODOS OS ARDUINOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gastoespecifico FROM gastoespecifico", function(err, result) {
				var gastosespecificos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastosespecificos+=result[i].gastoespecifico;
						console.log(result[i])

					}
					else{
						gastosespecificos+=result[i].gastoespecifico+',';
					}
				};
				var arraygastosespecificos = gastosespecificos.split(",");
				var soma = 0;
				for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastosespecificos[i]);
					
				};

				for (var i = 0; i <= arraygastosespecificos.length - 1; i++) {
					arraygastosespecificos[i] = i + "':'" + arraygastosespecificos[i];

				};
				con.release();
				res.send(arraygastosespecificos)

			});
		});
	};

	// MOSTRA TODOS OS gastosespecificos DE HOJE DE TODOS OS ARDUINOS
	this.listHoje = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gastoespecifico FROM gastoespecifico WHERE data = CURDATE();", function(err, result) {
				var gastosespecificos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastosespecificos+=result[i].gastoespecifico;
					}
					else{
						gastosespecificos+=result[i].gastoespecifico+',';
					}
				};
				
				var arraygastosespecificos = gastosespecificos.split(",");
				var soma = 0;
				for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastosespecificos[i]);
					
				};

				for (var i = 0; i <= arraygastosespecificos.length - 1; i++) {
					arraygastosespecificos[i] = i + "':'" + arraygastosespecificos[i];

				};
				con.release();
				res.send(arraygastosespecificos)

			});
		});
	};

	// MOSTRA O GASTO DE UM ARDUINO EM UMA DATA ESPECIFICADA
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM gastoespecifico WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA O GASTO DE UM ARDUINO HOJE
	this.getOneHoje = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT ultimo_update, CONVERT(gasto USING utf8) AS gastoespecifico FROM gastoespecifico INNER JOIN arduino ON(gastoespecifico.id_arduino=arduino.id) WHERE data = CURDATE() AND arduino.id = ?",[id], function(err, result) {
				var gastosespecificos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					
					if (i==result.length-1) {
						gastosespecificos+=result[i].gastoespecifico;
					}
					else{
						gastosespecificos+=result[i].gastoespecifico+',';
					}

				};
				
				var arraygastosespecificos = gastosespecificos.split(",");
				var soma = 0;
				for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastosespecificos[i]);
					
				};

				for (var i = 0; i <= arraygastosespecificos.length - 1; i++) {
					if (gastosespecificos!=='') {
						arraygastosespecificos[i] = i + "':'" + arraygastosespecificos[i];

					}
				};
				con.release();

				if (gastosespecificos=='') {
					// if (res==null) {
					// 	return '[]';
					// }
					res.send('[]');

				}
				else {
					arraygastosespecificos[arraygastosespecificos.length]= "hora':'" + result[0].ultimo_update;
					// if (res==null) {
						
					// 	return arraygastosespecificos;
					// }
					res.send(arraygastosespecificos);
				}
				

			});
		});
	};
	
	// MOSTRA TODOS OS gastosespecificos DE UMA DATA ESPECIFICADA
	this.listData = function(data,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gastoespecifico FROM gastoespecifico WHERE data = ?;",[data], function(err, result) {
				var gastosespecificos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastosespecificos+=result[i].gastoespecifico;
					}
					else{
						gastosespecificos+=result[i].gastoespecifico+',';
					}
				};
				var arraygastosespecificos = gastosespecificos.split(",");
				var soma = 0;
				for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastosespecificos[i]);
				};
				for (var i = 0; i <= arraygastosespecificos.length - 1; i++) {
					arraygastosespecificos[i] = i + "':'" + arraygastosespecificos[i];
				};
				con.release();
				res.send(arraygastosespecificos);
			});
		});
		
	};

	// ADICIONA UM NOVO GASTO
	this.create = function(arrayGasto,idArduino, res) {
		connection.acquire(function(err, con) {
                 
			con.query('SELECT *, TIMEDIFF(CURTIME(), ultimo_update) AS intervalo FROM gastoespecifico WHERE data = CURDATE() AND id_arduino=?',[idArduino], function(err, result) {
				
                var gastosespecificos='';
				if (JSON.stringify(result)=='[]') {
					
					for (var i = 0; i <= arrayGasto.length - 1; i++) {
							if (i!=arrayGasto.length - 1) {
								gastosespecificos+=arrayGasto[i]+',';
							}
							else{
								gastosespecificos+=arrayGasto[i];
							}
							
						};
						console.log("insert");
					con.query('INSERT INTO gastoespecifico SET gasto=CONVERT(?, BINARY),data=CURDATE(),id_arduino=?, ultimo_update=CURTIME()',[gastosespecificos,idArduino]);
				}
				else {
					con.query('SELECT CONVERT(gasto USING utf8) AS gastoespecifico FROM gastoespecifico WHERE data = CURDATE()  AND id_arduino=?',[idArduino], function(err, result) {
						gastosespecificos+=result[0].gastoespecifico+',';
						for (var i = 0; i <= arrayGasto.length - 1; i++) {
							if (i!=arrayGasto.length - 1) {
								gastosespecificos+=arrayGasto[i]+',';
							}
							else{
								gastosespecificos+=arrayGasto[i];
							}
							
						};
						
						var arraygastosespecificos = gastosespecificos.split(",");
						var soma = 0;
						for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
							soma+=Number(arraygastosespecificos[i]);
						};
						
						con.query('UPDATE gastoespecifico SET gasto=CONVERT(?, BINARY), ultimo_update=CURTIME() WHERE data = CURDATE() AND id_arduino=?', [gastosespecificos,idArduino]);
                         
					});  

				}
				con.release();
				if (res!=null) {
					if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.CREATED)
					.send('CREATED');
				}
				}
				
			});
		});
	};
	// ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
	this.intervalo = function(data,idArduino, res) {
		connection.acquire(function(err, con) {
			console.log(data);
			con.query('SELECT * FROM gastoespecifico WHERE data = CURDATE()', function(err, result) {

				if (JSON.stringify(result)=='[]') {
					
				} else {
					con.query('SELECT CONVERT(gasto USING utf8) as gastoespecifico,TIMEDIFF(?,gastoespecifico.ultimo_update) as intervalo FROM gastoespecifico WHERE data = CURDATE()',[data], function(err, result) {
						
						var gastosespecificos='';
						var intervalo = result[0].intervalo;
						intervalo = intervalo.split(':'); // split it at the colons
						var segundos = (+intervalo[0]) * 60 * 60 + (+intervalo[1]) * 60 + (+intervalo[2]); 
						if (segundos>1) {
							gastosespecificos+=result[0].gastoespecifico+','
						for (var i = segundos -1 ; i >= 0; i--) {
							gastosespecificos+=0+',';
						};
						gastosespecificos = gastosespecificos.substring(0, gastosespecificos.length - 1);

						var arraygastosespecificos = gastosespecificos.split(",");
						var soma = 0;
						for (var i = arraygastosespecificos.length - 1; i >= 0; i--) {
							soma+=Number(arraygastosespecificos[i]);
						};

						con.query('UPDATE gastoespecifico SET gasto=CONVERT(?, BINARY), ultimo_update=CURTIME() WHERE data = CURDATE()', gastosespecificos);
						}
					});

				}
				con.release();
				if (res!=undefined) {
					if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					res.status(HttpStatus.CREATED)
					.send('ok');
				}
				}
				
			});
		});
	};

	
	this.delete = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('DELETE FROM gastoespecifico WHERE id = ?', [id], function(err, result) {
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

module.exports = new Gastoespecifico();