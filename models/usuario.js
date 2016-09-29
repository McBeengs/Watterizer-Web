var connection = require('../connection');
var HttpStatus = require('http-status-codes');
var randtoken = require('rand-token');
var session = require('express-session');
var aes = require('aes-cross');
var key = new Buffer("W4tT3R1z3rG5T2e4", "utf-8");
var init = new Buffer('BaTaTaElEtRiCa15', "utf-8");
var sess;
// var enc = aes.encText('testTxt',key,init);
// var dec = aes.decText('testTxt',key,init);

function Usuario() {

	// MOSTRA TODOS OS USUARIOS
	this.listAll = function(res) {
		connection.acquire(function(err, con) {
			con.query('SELECT usuario.id, username, perfil, email, nome, telefone, hora_entrada, hora_saida, TIMEDIFF(hora_saida, hora_entrada) AS expediente, hora_intervalo FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE usuario.data_exclusao IS NULL', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA UM USUARIO
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE id = ? AND data_exclusao = NULL', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// ADICIONA UM NOVO USUARIO
	this.create = function(usuario, res) {
		connection.acquire(function(err, con) {
			con.query('INSERT INTO usuario SET ?', usuario, function(err, result) {
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

	// MODIFICA UM USUARIO
	this.update = function(usuario, res) {
		connection.acquire(function(err, con) {
			con.query('UPDATE usuario SET ? WHERE id = ? AND data_exclusao = NULL', [usuario, usuario.id], function(err, result) {
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

	// DELETA UM USUARIO
	this.delete = function(id, res) {
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
	};

	// DESLOGA UM USUARIO COM BASE EM SEU TOKEN
	this.logout = function(token, res) {
		connection.acquire(function(err, con) {
			if (token != undefined){
				con.query("UPDATE usuario SET token_desktop = ? WHERE token_desktop = ?", [null, token], function(err, result) {

				});
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

	// AUTENTICA AS REQUISIÇÕES DE UM USUARIO
	this.autenticacao = function(token,req, res) {
		connection.acquire(function(err, con) {
			sess=req.session;
			con.query('SELECT * FROM usuario WHERE token_web = ? OR token_desktop = ?', [token,token], function(err, result) {
				if(result[0]!=null){
					sess.aut=true;
					return true;
				} else {
					sess.aut=false;
					return false;
				}
			});
			con.release();
		});
	}

	// CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
	this.login = function(login,senha, krypt,req, res) {
		connection.acquire(function(err, con) {
			sess = req.session;
			token = randtoken.generate(16);
			var user = [];		
			con.query('SELECT * FROM usuario WHERE (email = ? OR username = ?) AND senha = ? AND data_exclusao = NULL', [login,login,senha], function(err, result) {
				user = JSON.stringify(result);
			});
			if (user != null) {
				console.log(token);
				if (krypt) {
						con.query('UPDATE usuario SET token_desktop = ? WHERE (email = ? OR username = ?) AND senha = ?', [token, login,login,senha], function(err, result) {
					});
				}
				else  {
						con.query('UPDATE usuario SET token_web = ? WHERE (email = ? OR username = ?) AND senha = ?', [token, login,login,senha], function(err, result) {
					});
					};
				con.query('SELECT * FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE (email = ? OR username = ?) AND senha = ?', [login,login,senha], function(err, result) {
	              
					var string = JSON.stringify(result);
					var obj = string;
					if (krypt) {
						obj = aes.encText(string,key,init);
						res.send(obj);
					}
					else if (obj!='[]') {
						console.log(result[0].token_web);
						sess.nome=result[0].nome;
						sess.id=result[0].id;
						sess.token=result[0].token_web;
						res.redirect("/portal");
					}
					else {
        				sess.login=false;
						res.redirect("/index");		
					}					
					user = JSON.stringify(result);
					con.release();
				});
			}
			token = null;
		});
	};
} 

module.exports = new Usuario();
