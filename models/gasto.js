const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Gasto() {
	// MOSTRA TODOS OS GASTOS DE TODOS OS ARDUINOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gasto FROM gasto", function(err, result) {
				var gastos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastos+=result[i].gasto;
						console.log(result[i])

					}
					else{
						gastos+=result[i].gasto+',';

					}
				};
				
				var arraygastos = gastos.split(",");
				var soma = 0;
				for (var i = arraygastos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastos[i]);
					
				};

				for (var i = 0; i <= arraygastos.length - 1; i++) {
					arraygastos[i] = i + "':'" + arraygastos[i];

				};
				con.release();
				res.send(arraygastos)

			});
		});
	};

	// MOSTRA TODOS OS GASTOS DE HOJE DE TODOS OS ARDUINOS
	this.listHoje = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = CURDATE();", function(err, result) {
				var gastos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastos+=result[i].gasto;
					}
					else{
						gastos+=result[i].gasto+',';
					}
				};
				
				var arraygastos = gastos.split(",");
				var soma = 0;
				for (var i = arraygastos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastos[i]);
					
				};

				for (var i = 0; i <= arraygastos.length - 1; i++) {
					arraygastos[i] = i + "':'" + arraygastos[i];

				};
				con.release();
				res.send(arraygastos)

			});
		});
	};

	// MOSTRA O GASTO DE UM ARDUINO EM UMA DATA ESPECIFICADA
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM gasto WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA O GASTO DE UM ARDUINO HOJE
	this.getOneHoje = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT ultimo_update, CONVERT(gasto USING utf8) AS gasto FROM gasto INNER JOIN arduino ON(gasto.id_arduino=arduino.id) WHERE data = CURDATE() AND arduino.id = ?",[id], function(err, result) {
				var gastos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					
					if (i==result.length-1) {
						gastos+=result[i].gasto;
					}
					else{
						gastos+=result[i].gasto+',';
					}

				};
				
				var arraygastos = gastos.split(",");
				var soma = 0;
				for (var i = arraygastos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastos[i]);
					
				};

				for (var i = 0; i <= arraygastos.length - 1; i++) {
					if (gastos!=='') {
						arraygastos[i] = i + "':'" + arraygastos[i];

					}
				};
				con.release();

				if (gastos=='') {
					// if (res==null) {
					// 	return '[]';
					// }
					res.send('[]');

				}
				else {
					arraygastos[arraygastos.length]= "hora':'" + result[0].ultimo_update;
					// if (res==null) {
						
					// 	return arraygastos;
					// }
					res.send(arraygastos);
				}
				

			});
});
};

	// MOSTRA TODOS OS GASTOS DE UMA DATA ESPECIFICADA
	this.listData = function(data,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = ?;",[data], function(err, result) {
				var gastos='';
				
				for (var i = 0; i <= result.length - 1; i++) {
					if (i==result.length-1) {
						gastos+=result[i].gasto;
					}
					else{
						gastos+=result[i].gasto+',';
					}
				};
				var arraygastos = gastos.split(",");
				var soma = 0;
				for (var i = arraygastos.length - 1; i >= 0; i--) {
					soma+=Number(arraygastos[i]);
				};
				for (var i = 0; i <= arraygastos.length - 1; i++) {
					arraygastos[i] = i + "':'" + arraygastos[i];
				};
				con.release();
				res.send(arraygastos);
			});
		});
		
	};

	// ADICIONA UM NOVO GASTO
	this.create = function(arrayGasto,idEquipamento, res) {
		console.log("equip"+idEquipamento);
		connection.acquire(function(err, con) {
			var especifico;
			var idArduino;
			con.query('SELECT mac,id_arduino FROM equipamento WHERE id=?',[idEquipamento], function(err, result) {
				idArduino=0;
				if (result[0]!=null) {
					idArduino=result[0].id_arduino;
					if (result[0].mac!=null) {
					especifico=false;
				}
				else{
					especifico=true;
				}
				}

			});
			// se nao especifico
			if (!especifico) {
				console.log("arduino");
				con.query('SELECT *, TIMEDIFF(CURTIME(), ultimo_update) AS intervalo FROM gasto WHERE data = CURDATE() AND id_arduino=?',[idArduino], function(err, result) {

					var gastos='';
					if (JSON.stringify(result)=='[]') {

						for (var i = 0; i <= arrayGasto.length - 1; i++) {
							if (i!=arrayGasto.length - 1) {
								gastos+=arrayGasto[i]+',';
							}
							else{
								gastos+=arrayGasto[i];
							}
							
						};
						console.log("insert");
						con.query('INSERT INTO gasto SET gasto=CONVERT(?, BINARY),data=CURDATE(),id_arduino=?, ultimo_update=CURTIME()',[gastos,idArduino]);
					}
					else {
						con.query('SELECT CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = CURDATE()  AND id_arduino=?',[idArduino], function(err, result) {
							gastos+=result[0].gasto+',';
							for (var i = 0; i <= arrayGasto.length - 1; i++) {
								if (i!=arrayGasto.length - 1) {
									gastos+=arrayGasto[i]+',';
								}
								else{
									gastos+=arrayGasto[i];
								}

							};

							var arraygastos = gastos.split(",");
							var soma = 0;
							for (var i = arraygastos.length - 1; i >= 0; i--) {
								soma+=Number(arraygastos[i]);
							};

							con.query('UPDATE gasto SET gasto=CONVERT(?, BINARY), ultimo_update=CURTIME() WHERE data = CURDATE() AND id_arduino=?', [gastos,idArduino]);

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
}
					  //se especifico
					  else{
					  	console.log("nao arduino");
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
					  			con.query('INSERT INTO gastoespecifico SET gasto=CONVERT(?, BINARY),data=CURDATE(),id_arduino=?, ultimo_update=CURTIME(),id_equipamento=?',[gastosespecificos,idArduino,idEquipamento]);
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
}  

});
};
	// ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
	this.intervalo = function(data,idArduino, res) {
		connection.acquire(function(err, con) {
			
			con.query('SELECT * FROM gasto WHERE data = CURDATE()', function(err, result) {

				if (JSON.stringify(result)=='[]') {
					
				} else {
					con.query('SELECT CONVERT(gasto USING utf8) as gasto,TIMEDIFF(?,gasto.ultimo_update) as intervalo FROM gasto WHERE data = CURDATE()',[data], function(err, result) {
						
						var gastos='';
						var intervalo = result[0].intervalo;
						intervalo = intervalo.split(':'); // split it at the colons
						var segundos = (+intervalo[0]) * 60 * 60 + (+intervalo[1]) * 60 + (+intervalo[2]); 
						if (segundos>1) {
							gastos+=result[0].gasto+','
							for (var i = segundos -1 ; i >= 0; i--) {
								gastos+=0+',';
							};
							gastos = gastos.substring(0, gastos.length - 1);

							var arraygastos = gastos.split(",");
							var soma = 0;
							for (var i = arraygastos.length - 1; i >= 0; i--) {
								soma+=Number(arraygastos[i]);
							};

							con.query('UPDATE gasto SET gasto=CONVERT(?, BINARY), ultimo_update=CURTIME() WHERE data = CURDATE()', gastos);
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
		con.query('DELETE FROM gasto WHERE id = ?', [id], function(err, result) {
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

module.exports = new Gasto();