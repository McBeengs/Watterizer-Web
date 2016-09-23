// BASE
var express = require('express');
var app = express();
var session = require('express-session');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var aes = require('aes-cross');
var crypto = require('crypto')
var key = new Buffer("W4tT3R1z3rG5T2e4", "utf-8");
var init = new Buffer('BaTaTaElEtRiCa15', "utf-8");

//UPLOAD DE ARQUIVOS
var multer  =   require('multer');
var isvalid;
var mime = require('mime');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './img');
},
filename: function (req, file, callback) {

 var ext = require('path').extname(file.originalname);
 ext = ext.length>1 ? ext : "." + require('mime').extension(file.mimetype);
 if (ext=='.png'||ext=='.jpg'||ext=='.jpg') {
    isvalid=true;
    callback(null, 'fotoid1'+ext);
}
else {
    isvalid=false;
    callback(null, 'invalid');
}
}

});
var upload = multer({ storage : storage}).single('userPhoto');

// MODELS
var teste = require('./models/teste');
var advertencia = require('./models/advertencia');
var arduino = require('./models/arduino');
var gasto = require('./models/gasto');
var perfil = require('./models/perfil');
var pergunta = require('./models/pergunta');
var setor = require('./models/setor');
var usuario = require('./models/usuario');
var token ="h6a44d1g5s5s";
var sess;
// MANUSEIA AS DIFERENTES AÇÕES PARA DIFERENTES URLS
module.exports = {
  configure: function(app) {
    app.use('/portal*', function(req,res,next){
        sess = req.session;
        if(sess.login) {
            next();
        } else {
            res.redirect('/index')
            res.end();
        }
    });

    // ACESSO A PAGINA INICIAL
    app.get('/index',function(req,res){
        sess = req.session;
        if(sess.login) {
            res.redirect('/portal');
        }
        else {
            res.sendFile(__dirname + "/public/index.html");
        }
        
    });

    // ACESSO AO PORTAL
    app.get('/portal',function(req,res){
        res.sendFile(__dirname + "/public/portal.html");
    });

    // ACESSO AOS GASTOS
    app.get('/portal/gastos', function(req, res) {
        res.sendFile(__dirname + "/public/sections/gasto.html");
    });

    // ACESSO AOS SETORES
    app.get('/portal/setores', function(req, res) {
        res.sendFile(__dirname + "/public/sections/setor.html");
    });

    // ACESSO AOS USUARIOS
    app.get('/portal/usuarios', function(req, res) {
        res.sendFile(__dirname + "/public/sections/usuario.html");
    });

    // ACESSO AS ADVERTENCIAS
    app.get('/portal/advertencias', function(req, res) {
        res.sendFile(__dirname + "/public/sections/advertencia.html");
    });

    app.post('/upload',function(req,res){
      upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        else if (isvalid) {
            res.end("File is uploaded");
        }
        else {
            res.end("File is invalid");
        }
    });
  });

    // TESTE
    app.get('/test/', function(req, res) {
        teste.testConnection(res);
    });

    /* ADVERTENCIAS */
    // MOSTRA TODAS AS ADVERTENCIAS
    app.get('/advertencia/', function(req, res){
        advertencia.listAll(res);
    });

    // ADICIONA UMA NOVA ADVERTENCIA
    app.post('/advertencia/', function(req, res){
        advertencia.create(req.body, res);
    });

    /* ARDUINOS */
    // MOSTRA TODOS OS ARDUINOS
    app.get('/arduino/', function(req, res) {
        arduino.listAll(res);
    });

    // MOSTRA UM ARDUINO
    app.get('/arduino/:id/', function(req, res) {
        arduino.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO ARDUNO
    app.post('/arduino/', function(req, res) {
        arduino.create(req.body, res);
    });

    // MODIFICA UM ARDUNO
    app.put('/arduino/', function(req, res) {
        arduino.update(req.body, res);
    });

    // DELETA UM ARDUNO
    app.delete('/arduino/:id/', function(req, res) {
        arduino.delete(req.params.id, res);
    });

    /* GASTOS */
    // MOSTRA TODOS OS GASTOS DE TODOS OS ARDUINOS
    app.get('/gasto/', function(req, res) {
        gasto.listAll(res);
    });

    // MOSTRA TODOS OS GASTOS DE HOJE DE TODOS OS ARDUINOS
    app.get('/gasto/hoje', function(req, res) {
        gasto.listHoje(res);
    });

    // MOSTRA O GASTO DE UM ARDUINO EM UMA DATA ESPECIFICADA
    app.get('/gasto/:id/', function(req, res) {
        gasto.getOne(req.params.id, res);
    });
    
    // MOSTRA O GASTO DE UM ARDUINO HOJE
    app.get('/gasto/hoje/:id/', function(req, res) {
        gasto.getOneHoje(req.params.id, res);
    });

    // MOSTRA TODOS OS GASTOS DE UMA DATA ESPECIFICADA
    app.get('/gasto/:data', function(req, res) {
        gasto.listData(req.params.data,res);
    });

    // ADICIONA UM NOVO GASTO
    app.post('/gasto/', function(req, res) {
        gasto.create(req.body, res);
    });

    // ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
    app.post('/gasto/nulo', function(req, res) {
        gasto.intervalo(req.body, res);
    });


    app.delete('/gasto/:id/', function(req, res) {
        gasto.delete(req.params.id, res);
    });

    /* PERFIL */
    app.get('/perfil/', function(req, res) {
        perfil.listAll(res);
    });

    app.get('/perfil/:id/', function(req, res) {
        perfil.getOne(req.params.id, res);
    });

    app.post('/perfil/', function(req, res) {
        perfil.create(req.body, res);
    });

    app.put('/perfil/', function(req, res) {
        perfil.update(req.body, res);
    });

    app.delete('/perfil/:id/', function(req, res) {
        perfil.delete(req.params.id, res);
    });

    /* PERGUNTAS */
    app.get('/pergunta/', function(req, res) {
        pergunta.listAll(res);
    });

    app.get('/pergunta/:id/', function(req, res) {
        pergunta.getOne(req.params.id, res);
    });

    app.post('/pergunta/', function(req, res) {
        pergunta.create(req.body, res);
    });

    app.put('/pergunta/', function(req, res) {
        pergunta.update(req.body, res);
    });

    app.delete('/pergunta/:id/', function(req, res) {
      pergunta.delete(req.params.id, res);
  });

    /* SETORES */
    // MOSTRA TODOS OS SETORES
    app.get('/setor/', function(req, res) {
        setor.listAll(res);
    });

    // MOSTRA UM SETOR
    app.get('/setor/:id/', function(req, res) {
        setor.getOne(req.params.id, res);
    });

    // CRIA UM NOVO SETOR
    app.post('/setor/', function(req, res) {
        setor.create(req.body, res);
    });

    // MODIFICA UM SETOR
    app.put('/setor/', function(req, res) {
        setor.update(req.body, res);
    });

    // DELETA UM SETOR
    app.delete('/setor/:id/', function(req, res) {
        setor.delete(req.params.id, res);
    });

    /* USUARIOS */
    // MOSTRA TODOS OS USUARIOS
    app.get('/usuario/', function(req, res) {
        usuario.listAll(res);
    });

    // MOSTRA UM USUARIO
    app.get('/usuario/:id/', function(req, res) {
        usuario.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO USUARIO
    app.post('/usuario/', function(req, res) {
        usuario.create(req.body, res);
    });

    // MODIFICA UM USUARIO
    app.put('/usuario/', function(req, res) {
        usuario.update(req.body, res);
    });

    // DELETA UM USUARIO
    app.delete('/usuario/:id/', function(req, res) {
        usuario.delete(req.params.id, res);
    });

    // CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
    app.post('/login', function(req, res) {
        sess = req.session;
        sess.login=req.body.login;
        try {
            usuario.login(aes.decText(req.body.login,key,init),req.body.senha, true, req, res);
        } catch(e) {
            usuario.login(req.body.login,aes.encText(req.body.senha,key,init), false,req, res);
        }
    });
    
    // DESLOGA UM USUARIO COM BASE EM SEU TOKEN
    app.use('/logout', function(req, res) {
        usuario.logout(req.body.token, res);
        req.session.destroy(function(err) {
        });
    });
}
};