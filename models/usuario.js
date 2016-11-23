const connection = require('../connection');
const HttpStatus = require('http-status-codes');
const randtoken = require('rand-token');
const session = require('express-session');
const aes = require('aes-cross');
var key = new Buffer("W4tT3R1z3rG5T2e4", "utf-8");
var init = new Buffer('BaTaTaElEtRiCa15', "utf-8");
const nodemailer = require('nodemailer');
// var enc = aes.encText('testTxt',key,init);
// var dec = aes.decText('testTxt',key,init);

function Usuario() {

	// MOSTRA TODOS OS USUARIOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT usuario.id,usuario.id_perfil,usuario.id_setor, username, perfil, email, nome, telefone, hora_entrada, hora_saida, TIMEDIFF(hora_saida, hora_entrada) AS expediente, hora_intervalo FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE usuario.data_exclusao IS NULL', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// CONTA REGISTROS DO BANCO
	this.contarRegistros = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT COUNT(*) as advertencia,(SELECT COUNT(*) FROM usuario WHERE data_exclusao IS NULL) as usuario ,(SELECT COUNT(*) FROM setor) as setor FROM advertencia', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA UM USUARIO
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) INNER JOIN setor ON(usuario.id_setor=setor.id) WHERE usuario.id = ? AND data_exclusao IS NULL', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// MOSTRA O USUARIO LOGADO
	this.getLogado = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE usuario.id = ? AND data_exclusao IS NULL', [id], function(err, result) {
				con.release();
				if (result[0]!=undefined) {
					result[0].senha=aes.decText(result[0].senha,key,init);
				}
				res.send(result);
				
			});
		});
	};
	// GERA USUÁRIO AUTOMATICAMENTE
	this.geraUsuario = function(nome,req, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE data_exclusao IS NULL', function(err, result) {
				var user = nome.nome.replace(/ /g,"");
				var count=[];

				for (var i = 0; i <= 3; i++) {
					count.push(Math.floor((Math.random() * 9) + 1));
					user += count[i];
				};
				for (var i = result.length - 1; i >= 0; i--) {
					if (result[i].username==user) {
						count.splice(1, 1);
						count.push(Math.floor((Math.random() * 9) + 1));
						user=nome.nome.replace(/ /g,"")+count.toString().replace(/,/g,"");
					};
				};
				con.release();
				req.session.autoUser=user;
				res.send(user);
			});
		});
	};
	// VERIFICA SE O EMAIL EXISTE NO BANCO DE DADOS
	this.checaEmailCadastrado = function(usuario, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE data_exclusao IS NULL', function(err, result) {
				console.log(result)
				var isCadastrado=false;
				for (var i = result.length - 1; i >= 0; i--) {
					if (result[i].email==usuario.email && result[i].id!=usuario.id) {
						isCadastrado=true;
					};
				};
				con.release();
				res.send(isCadastrado);
			});
		});
	};

	// ADICIONA UM NOVO USUARIO
	this.create = function(usuario,req, res) {
		connection.acquire(function(err, con) {
			var sess=req.session;
			var senha = randtoken.generate(8);
			usuario.senha=aes.encText(senha,key,init);
			if (sess.autoUser!='' && sess !=undefined) {
				usuario.username=sess.autoUser;
				con.query('INSERT INTO usuario SET username=?,senha=?,email=?,nome=?,telefone=?,hora_entrada=?,hora_saida=?,hora_intervalo=?,id_perfil=?,id_setor=?', [usuario.username,usuario.senha,usuario.email,usuario.nome,usuario.telefone,usuario.hora_entrada,usuario.hora_saida,usuario.hora_intervalo,usuario.id_perfil,usuario.id_setor], function(err, result) {
					con.release();

					if (err) {
						console.log(err);
						res.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.send({
							error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
						});
					} else {
						res.status(HttpStatus.CREATED)
						.send('CREATED');
						var text = 'Senha '+senha;
						var transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
					            user: 'watterizer@gmail.com', // Your email id
					            pass: 'senairianos115' // Your password
					        }
					    });
						var mailOptions = {
						    from: 'watterizer@gmail.com', // sender address
						    to: usuario.email, // list of receivers
						    subject: 'Senha', // Subject line
						    text: text //, // plaintext body
						    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
						};
						transporter.sendMail(mailOptions, function(error, info){
							if(error) {
								console.log(error);
								
							} else {
								console.log('Message sent: ' + info.response);
								
							};
						});
					}
				});
}
else{
	res.status(HttpStatus.INTERNAL_SERVER_ERROR)
	.send({
		error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
	});
}

});
};


	// MODIFICA UM USUARIO
	this.update = function(usuario,req, res) {
		var sess = req.session;
		if (usuario.senha!=null || usuario.senha!=undefined) {
			usuario.senha=aes.encText(usuario.senha,key,init);
		};
		if (usuario.id!=sess.idUser ) {
			connection.acquire(function(err, con) {
					con.query('UPDATE usuario SET ? WHERE id = ? AND data_exclusao IS NULL', [usuario, usuario.id], function(err, result) {
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
		}
		else{
			res.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.send({
				error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
			});
		}
		
	};
	// MODIFICA UMA CONTA
	this.updateConta = function(usuario, res) {
		usuario.hora_entrada= new Date(usuario.hora_entrada);
		usuario.hora_intervalo= new Date(usuario.hora_intervalo);
		usuario.hora_saida= new Date(usuario.hora_saida);
		usuario.hora_entrada= usuario.hora_entrada.getHours()+":"+usuario.hora_entrada.getMinutes()+":"+usuario.hora_entrada.getSeconds();
		usuario.hora_intervalo= usuario.hora_intervalo.getHours()+":"+usuario.hora_intervalo.getMinutes()+":"+usuario.hora_intervalo.getSeconds();
		usuario.hora_saida= usuario.hora_saida.getHours()+":"+usuario.hora_saida.getMinutes()+":"+usuario.hora_saida.getSeconds();
		usuario.senha = aes.encText(usuario.senha, key,init)
		connection.acquire(function(err, con) {
			con.query('UPDATE usuario SET ? WHERE id = ? AND data_exclusao IS NULL', [usuario, usuario.id], function(err, result) {
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

	// DELETA UM USUARIO
	this.delete = function(id,req, res) {
		var sess = req.session;
		if (id!=sess.idUser) {
			connection.acquire(function(err, con) {
				con.query('UPDATE usuario SET data_exclusao = NOW() WHERE id = ?', [id], function(err, result) {
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
		}else{
			res.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.send({
				error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
			});
		}
	};
	// DESLOGA UM USUARIO COM BASE EM SEU TOKEN WEB
	this.logoutWeb = function(token, res) {
		connection.acquire(function(err, con) {
			if (token != undefined){
				con.query("UPDATE usuario SET token_web = ? WHERE token_web = ?", [null, token], function(err, result) {
					con.release();
					res.redirect("/index");
				});
			} else {
				con.release();
				res.redirect("/index");
			}
		});
	};
	// DESLOGA UM USUARIO COM BASE EM SEU TOKEN DESKTOP
	this.logoutDesktop = function(token, res) {
		connection.acquire(function(err, con) {
			if (token != undefined){
				con.query("UPDATE usuario SET token_desktop = ? WHERE token_desktop = ?", [null, token], function(err, result) {
					con.release();
					res.end();
				});
				
			} else {
				con.release();
				res.end();
			}
		});
	};

	// AUTENTICA AS REQUISIÇÕES DE UM USUARIO
	this.autenticacao = function(token,req, res) {
		connection.acquire(function(err, con) {
			var sess=req.session;
			con.query('SELECT * FROM usuario WHERE token_web = ? OR token_desktop = ? AND data_exclusao IS NULL', [token,token], function(err, result) {
				if (sess!=undefined) {
					if(result[0]!=null){
						sess.aut=true;
						return true;
					} else {
						sess.aut=false;
						return false;
					}
				}
			});
			con.release();
		});
	}

	// CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
	this.login = function(login,senha,req, res) {
		connection.acquire(function(err, con) {
			var sess = req.session;
			con.query('SELECT * FROM usuario WHERE (email = ? OR username = ?) AND senha = ? AND data_exclusao IS NULL', [login,login,senha], function(err, result) {
				if (result[0] != null) {
					var token = randtoken.generate(16);	
					con.query('UPDATE usuario SET token_desktop = ? WHERE (email = ? OR username = ?) AND senha = ?', [token, login,login,senha], function(err, result) {
					});
					con.query('SELECT usuario.id,username,senha,email,nome,telefone,hora_entrada,id_perfil,id_setor,id_pergunta,resposta_pergunta,token_web,token_desktop,hora_saida,hora_intervalo,data_exclusao,perfil.perfil FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE (email = ? OR username = ?) AND senha = ?', [login,login,senha], function(err, result) {
						var string = JSON.stringify(result);
						var obj = string;
						obj = aes.encText(string,key,init);
						res.send(obj);			
						
					});
				}
				else{
					res.end();
				}
			});
			con.release();
			token = null;
		});
};
	// CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
	this.loginWeb = function(login,senha,req, res) {
		connection.acquire(function(err, con) {
			var sess = req.session;
			var token = randtoken.generate(16);	
			con.query('SELECT usuario.id,username,senha,email,nome,telefone,hora_entrada,id_perfil,id_setor,id_pergunta,resposta_pergunta,token_web,token_desktop,hora_saida,hora_intervalo,data_exclusao,perfil.perfil FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE (email = ? OR username = ?) AND senha = ? AND data_exclusao IS NULL', [login,login,senha], function(err, result) {
				if (result[0] != null) {
					if (result[0].username!="admin" || result[0].token_web==null) {
						con.query('UPDATE usuario SET token_web = ? WHERE (email = ? OR username = ?) AND senha = ?', [token, login,login,senha], function(err, result) {
						});
					}
					if (result[0].perfil.toLowerCase()=='administrador') {
						sess.nome=result[0].nome;
						sess.idUser=result[0].id;
						sess.perfil=result[0].perfil;
						if (result[0].token_web==null || result[0].username!="admin") {
							sess.token=token;
						}
						else{
							sess.token=result[0].token_web;
						}
						if (result[0].id_pergunta==null || result[0].resposta_pergunta==null) {
							res.redirect("/portal/configuracoes");
						}
						else{
							res.redirect("/portal");
						}
					}
					
				}
				else {
					sess.login=false;

					res.redirect("/index");	


				}
			});
con.release();
});
};
} 

module.exports = new Usuario();
