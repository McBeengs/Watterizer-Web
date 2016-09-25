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
			con.query('SELECT * FROM usuario', function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};

	// MOSTRA UM USUARIO
	this.getOne = function(id, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE id = ?', [id], function(err, result) {
				con.release();
				res.send(result);
			});
		});
	};
	// MOSTRA O USUARIO LOGADO
	this.getLogado = function(login, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE username = ? OR email = ?', [login,login], function(err, result) {
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
			con.query('UPDATE usuario SET ? WHERE id = ?', [usuario, usuario.id], function(err, result) {
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
			con.query('DELETE FROM usuario WHERE id = ?', [id], function(err, result) {
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
				con.query("UPDATE usuario SET token = ? WHERE token = ?", [null, token], function(err, result) {
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
	this.autenticacao = function(token, res) {
		connection.acquire(function(err, con) {
			con.query('SELECT * FROM usuario WHERE token = ?', [token], function(err, result) {
				if(result!=null){
					res.send(true);
				} else {
					res.send(false);
				}
			});
		});
	}

	// CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
	this.login = function(login,senha, krypt,req, res) {
		connection.acquire(function(err, con) {
			token = randtoken.generate(16);
			var user = [];		
			con.query('SELECT * FROM usuario WHERE (email = ? OR username = ?) AND senha = ?', [login,login,senha], function(err, result) {
				user = JSON.stringify(result);
			});
			if (user != null) {
				console.log(token);
				con.query('UPDATE usuario SET token = ? WHERE (email = ? OR username = ?) AND senha = ?', [token, login,login,senha], function(err, result) {
					
				});
				con.query('SELECT * FROM usuario INNER JOIN perfil ON(usuario.id_perfil=perfil.id) WHERE (email = ? OR username = ?) AND senha = ?', [login,login,senha], function(err, result) {
	              
					var string = JSON.stringify(result);
					var obj = string;
					if (krypt) {
						obj = aes.encText(string,key,init);
						res.send(obj);
					}
					else if (obj!='[]') {
						res.redirect("/portal");
					}
					else {
						sess = req.session;
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