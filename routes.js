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
var prefixoDados = "/dados";
var prefixoPortal = "/portal"


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
var computador = require('./models/computador');
var token ="h6a44d1g5s5s";
var sess;
// MANUSEIA AS DIFERENTES AÇÕES PARA DIFERENTES URLS
module.exports = {
  configure: function(app) {
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
    app.use(prefixoPortal+'*', function(req,res,next){
        sess = req.session;
        if(sess.login) {
            next();
        } else {
            res.redirect('/index')
            res.end();
        }
    });

    app.get(prefixoPortal+'',function(req,res){
        res.sendFile(__dirname + "/public/portal.html");
    });

    // ACESSO AOS GASTOS
    app.get(prefixoPortal+'/gastos', function(req, res) {
        res.sendFile(__dirname + "/public/sections/gasto.html");
    });

    // ACESSO AOS SETORES
    app.get(prefixoPortal+'/setores', function(req, res) {
        res.sendFile(__dirname + "/public/sections/setor.html");
    });

    // ACESSO AOS USUARIOS
    app.get(prefixoPortal+'/usuarios', function(req, res) {
        res.sendFile(__dirname + "/public/sections/usuario.html");
    });

    // ACESSO AS ADVERTENCIAS
    app.get(prefixoPortal+'/advertencias', function(req, res) {
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

    // ACESSO AOS DADOS
    app.use(prefixoDados+'*', function(req,res,next){
        // sess = req.session;
        // if(sess.login) {
        //     next();
        // } else {
        //     res.redirect('/index')
        //     res.end();
        // }
        next();
    });

    // TESTE
    app.get('/test', function(req, res) {
        teste.testConnection(res);
    });

    /* ADVERTENCIAS */
    // MOSTRA TODAS AS ADVERTENCIAS
    app.get(prefixoDados+'/advertencia/', function(req, res){
        advertencia.listAll(res);
    });

    // ADICIONA UMA NOVA ADVERTENCIA
    app.post(prefixoDados+'/advertencia/', function(req, res){
        advertencia.create(req.body, res);
    });

    /* ARDUINOS */
    // MOSTRA TODOS OS ARDUINOS
    app.get(prefixoDados+'/arduino/', function(req, res) {
        arduino.listAll(res);
    });

    // MOSTRA TODOS OS ARDUINOS DE UM SETOR ESPECIFICADO
    app.get(prefixoDados+'/arduino/setor/:id/', function(req, res) {
        arduino.listBySetor(req.params.id, res);
    });

    // MOSTRA UM ARDUINO
    app.get(prefixoDados+'/arduino/:id/', function(req, res) {
        arduino.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO ARDUNO
    app.post(prefixoDados+'/arduino/', function(req, res) {
        arduino.create(req.body, res);
    });

    // MODIFICA UM ARDUNO
    app.put(prefixoDados+'/arduino/', function(req, res) {
        arduino.update(req.body, res);
    });

    // DELETA UM ARDUNO
    app.delete(prefixoDados+'/arduino/:id/', function(req, res) {
        arduino.delete(req.params.id, res);
    });

    app.get(prefixoDados+'/computador/', function(req, res) {
        computador.listAll(res);
    });

    // MOSTRA UM computador
    app.get(prefixoDados+'/computador/:id/', function(req, res) {
        computador.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO ARDUNO
    app.post(prefixoDados+'/computador/', function(req, res) {
        computador.create(req.body, res);
    });

    // MODIFICA UM ARDUNO
    app.put(prefixoDados+'/computador/', function(req, res) {
        computador.update(req.body, res);
    });

    // DELETA UM ARDUNO
    app.delete(prefixoDados+'/computador/:id/', function(req, res) {
        computador.delete(req.params.id, res);
    });

    app.post(prefixoDados+'/pccheck', function(req, res) {
        if (req.body.command=="check") {
            computador.check(req.body.mac,res);
        }
        else if(req.body.command=="delete"){
            computador.delete(req.body.mac,res);
        }
    });

    /* GASTOS */
    // MOSTRA TODOS OS GASTOS DE TODOS OS ARDUINOS
    app.get(prefixoDados+'/gasto/', function(req, res) {
        gasto.listAll(res);
    });

    // MOSTRA TODOS OS GASTOS DE HOJE DE TODOS OS ARDUINOS
    app.get(prefixoDados+'/gasto/hoje', function(req, res) {
        gasto.listHoje(res);
    });

    // MOSTRA O GASTO DE UM ARDUINO EM UMA DATA ESPECIFICADA
    app.get(prefixoDados+'/gasto/:id/', function(req, res) {
        gasto.getOne(req.params.id, res);
    });
    
    // MOSTRA O GASTO DE UM ARDUINO HOJE
    app.get(prefixoDados+'/gasto/hoje/:id/', function(req, res) {
        gasto.getOneHoje(req.params.id, res);
    });

    // MOSTRA TODOS OS GASTOS DE UMA DATA ESPECIFICADA
    app.get('/gasto/:data', function(req, res) {
        gasto.listData(req.params.data,res);
    });

    // ADICIONA UM NOVO GASTO
    app.post(prefixoDados+'/gasto/', function(req, res) {
        gasto.create(req.body, res);
    });

    // ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
    app.post(prefixoDados+'/gasto/nulo', function(req, res) {
        gasto.intervalo(req.body, res);
    });


    app.delete(prefixoDados+'/gasto/:id/', function(req, res) {
        gasto.delete(req.params.id, res);
    });

    /* PERFIL */
    app.get(prefixoDados+'/perfil/', function(req, res) {
        perfil.listAll(res);
    });

    app.get(prefixoDados+'/perfil/:id/', function(req, res) {
        perfil.getOne(req.params.id, res);
    });

    app.post(prefixoDados+'/perfil/', function(req, res) {
        perfil.create(req.body, res);
    });

    app.put(prefixoDados+'/perfil/', function(req, res) {
        perfil.update(req.body, res);
    });

    app.delete(prefixoDados+'/perfil/:id/', function(req, res) {
        perfil.delete(req.params.id, res);
    });

    /* PERGUNTAS */
    app.get(prefixoDados+'/pergunta/', function(req, res) {
        pergunta.listAll(res);
    });

    app.get(prefixoDados+'/pergunta/:id/', function(req, res) {
        pergunta.getOne(req.params.id, res);
    });

    app.post(prefixoDados+'/pergunta/', function(req, res) {
        pergunta.create(req.body, res);
    });

    app.put(prefixoDados+'/pergunta/', function(req, res) {
        pergunta.update(req.body, res);
    });

    app.delete(prefixoDados+'/pergunta/:id/', function(req, res) {
      pergunta.delete(req.params.id, res);
  });

    /* SETORES */
    // MOSTRA TODOS OS SETORES
    app.get(prefixoDados+'/setor/', function(req, res) {
        setor.listAll(res);
    });

    // MOSTRA UM SETOR
    app.get(prefixoDados+'/setor/:id/', function(req, res) {
        setor.getOne(req.params.id, res);
    });

    // CRIA UM NOVO SETOR
    app.post(prefixoDados+'/setor/', function(req, res) {
        setor.create(req.body, res);
    });

    // MODIFICA UM SETOR
    app.put(prefixoDados+'/setor/', function(req, res) {
        setor.update(req.body, res);
    });

    // DELETA UM SETOR
    app.delete(prefixoDados+'/setor/:id/', function(req, res) {
        setor.delete(req.params.id, res);
    });

    /* USUARIOS */
    // MOSTRA TODOS OS USUARIOS
    app.get(prefixoDados+'/usuario/', function(req, res) {
        usuario.listAll(res);
    });

    // MOSTRA UM USUARIO
    app.get(prefixoDados+'/usuario/:id/', function(req, res) {
        usuario.getOne(req.params.id, res);
    });
    
    app.get(prefixoDados+'/sessao/', function(req, res) {
        res.send(sess.nome);
    });

    // ADICIONA UM NOVO USUARIO
    app.post(prefixoDados+'/usuario/', function(req, res) {
        usuario.create(req.body, res);
    });

    // MODIFICA UM USUARIO
    app.put(prefixoDados+'/usuario/', function(req, res) {
        usuario.update(req.body, res);
    });

    // DELETA UM USUARIO
    app.delete(prefixoDados+'/usuario/:id/', function(req, res) {
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
    app.use(prefixoPortal+'/logout', function(req, res) {
        usuario.logout(req.body.token, res);
        req.session.destroy(function(err) {
        });
    });
}
};