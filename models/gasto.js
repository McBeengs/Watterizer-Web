const connection = require('../connection');
const HttpStatus = require('http-status-codes');

function Gasto() {
	// MOSTRA TODOS OS GASTOS DE TODOS OS ARDUINOS E EQUIPAMENTOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gasto FROM gasto", function(err, result) {
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
	this.custoEquipamento = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT SUM(custo) as custo FROM gasto WHERE id_equipamento=? AND data = CURDATE()",[id], function(err, result) {
				con.release();
				if (result[0].custo==null) {
					result[0].custo=0
				};
				res.send(result)

			});
		});
	};

		// MOSTRA TODOS OS GASTOS DE TODOS OS ARDUINOS E EQUIPAMENTOS
	this.listaPorMes = function(res) {
		connection.acquire(function(err, con) {
			con.query("SELECT CONVERT(gasto USING utf8) AS gasto,MONTH(data) as month FROM gasto", function(err, result) {
				var somaMensal=[0,0,0,0,0,0,0,0,0,0,0,0]
				for (var i = result.length - 1; i >= 0; i--) {
					result[i].gasto=result[i].gasto.split(",")
					switch(result[i].month) {
						case 1:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[0]=somaMensal[0]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 2:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[1]=somaMensal[1]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 3:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[2]=somaMensal[2]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 4:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[3]=somaMensal[3]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 5:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[4]=somaMensal[4]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 6:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[5]=somaMensal[5]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 7:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[6]=somaMensal[6]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 8:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[7]=somaMensal[7]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 9:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[8]=somaMensal[8]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 10:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[9]=somaMensal[9]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 11:
							console.log(result[i].gasto.length);
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[10]=somaMensal[10]+Number((result[i].gasto[j]*127)/1000)
							};
							break;
						case 12:
							for (var j = result[i].gasto.length - 1; j >= 0; j--) {
								somaMensal[11]+=Number((result[i].gasto[j]*127)/1000)
							};
							break;
					}
					
				};

				con.release();
				res.send(somaMensal)

			});
		});
	};

	// MOSTRA TODOS OS GASTOS DE HOJE DE TODOS OS ARDUINOS E EQUIPAMENTOS
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

	// MOSTRA O GASTO POR ID
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM gasto WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA O GASTO DE UM EQUIPAMENTO HOJE POR ID
	this.getOneHoje = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT ultimo_update, CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = CURDATE() AND id_equipamento = ?",[id], function(err, result) {
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
	// MOSTRA O GASTO DE UM ARDUINO HOJE
	this.getOneHojeArduino = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT ultimo_update, CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = CURDATE() AND id_arduino = ?",[id], function(err, result) {
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
// MOSTRA O GASTO DE UM EQUIPAMENTO HOJE
	this.getOneHojeEquipamento = function(id,res) {
		connection.acquire(function(err, con) {
			con.query("SELECT ultimo_update, CONVERT(gasto USING utf8) AS gasto FROM gasto WHERE data = CURDATE() AND id_equipamento = ?",[id], function(err, result) {
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
	this.create = function(arrayGasto,idEquipamento,custo, res) {
		connection.acquire(function(err, con) {
			var idArduino;
			con.query('SELECT mac,id_arduino FROM equipamento WHERE id=?',[idEquipamento], function(err, result) {
				if (err) {
					console.log(err);
				}
				
				idArduino=0;
				if (result[0]!=null) {
					idArduino=result[0].id_arduino;
					if (result[0].mac!=null) {
						especifico=false;
					}
					else {
						especifico=true;
					}
				}
				con.query('SELECT *, TIMEDIFF(CURTIME(), ultimo_update) AS intervalo FROM gasto WHERE data = CURDATE() AND id_arduino=? AND id_equipamento=?',[idArduino,idEquipamento], function(err, result) {
					if (err) {
						console.log("select"+err);
					}
					var gastos='';
					if (JSON.stringify(result)=='[]') {

						for (var i = 0; i <= arrayGasto.length - 1; i++) {
							if (i!=arrayGasto.length - 1) {
								gastos+=arrayGasto[i]+',';
							}
							else {
								gastos+=arrayGasto[i];
							}

						};
						console.log("insert");
						con.query('INSERT INTO gasto SET gasto=CONVERT(?, BINARY),data=CURDATE(),id_arduino=?,id_equipamento=?, ultimo_update=CURTIME(), custo=?',[gastos,idArduino,idEquipamento,custo], function(err, result) {
							if (err) {
								console.log("insert"+err);
								console.log("custo"+custo);
							}
						})
					}
					else {
						con.query('SELECT CONVERT(gasto USING utf8) AS gasto,custo FROM gasto WHERE data = CURDATE()  AND id_arduino=? AND id_equipamento=?',[idArduino,idEquipamento], function(err, result) {
							if (result[0]!=undefined) {
								gastos+=result[0].gasto+',';
							}
							for (var i = 0; i <= arrayGasto.length - 1; i++) {
								if (i!=arrayGasto.length - 1) {
									gastos+=arrayGasto[i]+',';
								}
								else {
									gastos+=arrayGasto[i];
								}

							};

							var arraygastos = gastos.split(",");
							var soma = 0;
							for (var i = arraygastos.length - 1; i >= 0; i--) {
								soma+=Number(arraygastos[i]);
							};
							
							custo=custo+result[0].custo;

							console.log("update");
							con.query('UPDATE gasto SET gasto=CONVERT(?, BINARY), ultimo_update=CURTIME(),custo=? WHERE data = CURDATE() AND id_arduino=? AND id_equipamento=?', [gastos,custo,idArduino,idEquipamento],function (err,result) {
								if (err) {
									console.log("update"+err);
								}
							});

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


});
};
	// ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
	this.intervalo = function(data,idEquipamento, res) {
		connection.acquire(function(err, con) {
			var segundos;
			con.query('SELECT * FROM gasto WHERE data = CURDATE() AND id_equipamento=?',[idEquipamento], function(err, result) {

				if (JSON.stringify(result)=='[]') {
					
				} else {
					con.query('SELECT CONVERT(gasto USING utf8) as gasto,ultimo_update,TIMEDIFF(?,gasto.ultimo_update) as intervalo FROM gasto WHERE data = CURDATE() AND id_equipamento=?',[data,idEquipamento], function(err, result) {
						var gastos='';
						var intervalo = result[0].intervalo;
						intervalo = intervalo.split(':'); // split it at the colons
						segundos = (+intervalo[0]) * 60 * 60 + (+intervalo[1]) * 60 + (+intervalo[2]); 

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

							con.query('UPDATE gasto SET gasto=CONVERT(?, BINARY), ultimo_update=? WHERE data = CURDATE()  AND id_equipamento=?', [gastos,data,idEquipamento]);
						}
					});

				}
				con.release();
				if (err) {
					console.log(err);
					res.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.send({
						error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
					});
				} else {
					return segundos;
				}
				
				
			});
});
};
// MOSTRA O INTERVALO
this.getIntervalo = function(data,idArduino, res) {
	connection.acquire(function(err, con) {
		var segundos=0;
		con.query('SELECT * FROM gasto WHERE data = CURDATE() AND id_arduino=?',[idArduino], function(err, result) {

			if (JSON.stringify(result)=='[]') {
				
			} else {
				con.query('SELECT CONVERT(gasto USING utf8) as gasto,ultimo_update,TIMEDIFF(?,gasto.ultimo_update) as intervalo FROM gasto WHERE data = CURDATE() AND id_arduino=?',[data,idArduino], function(err, result) {
					var intervalo=0
					if (result[0].intervalo!=undefined) {
						 intervalo= result[0].intervalo;
					}
					intervalo = intervalo.split(':'); // split it at the colons
					segundos = (+intervalo[0]) * 60 * 60 + (+intervalo[1]) * 60 + (+intervalo[2]); 
					if (res!=undefined) {
						con.release();

						res.status(HttpStatus.OK).send(segundos.toString())
					}

				});
			}
		});
	});
};

// APAGA UM GASTO
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