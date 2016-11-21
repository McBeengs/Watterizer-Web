// BASE
const express = require('express');
var app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const aes = require('aes-cross');
const crypto = require('crypto');
var key = new Buffer("W4tT3R1z3rG5T2e4", "utf-8");
var init = new Buffer('BaTaTaElEtRiCa15', "utf-8");
var prefixoDados = "/dados";
var prefixoPortal = "/portal";
var fs = require('fs');
// MODELS
const teste = require('./models/teste');
const advertencia = require('./models/advertencia');
const arduino = require('./models/arduino');
const gasto = require('./models/gasto');
const perfil = require('./models/perfil');
const pergunta = require('./models/pergunta');
const setor = require('./models/setor');
const usuario = require('./models/usuario');
const canvas = require('./models/canvas');
const equipamento = require('./models/equipamento');
const ip = require("ip");

//UPLOAD DE ARQUIVOS
const multer  =   require('multer');
var isvalid;
const mime = require('mime');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './img');
    },
    filename: function (req, file, callback) {
        var ext = require('path').extname(file.originalname);
        ext = ext.length>1 ? ext : "." + require('mime').extension(file.mimetype);
        if (ext=='.png'||ext=='.jpg'||ext=='.gif') {
            isvalid=true;
            callback(null, 'fotoid'+req.session.idUser+".png");
        }
        else {
            isvalid=false;
            callback(null, 'invalid');
        }
    }
});

var upload = multer({ storage : storage}).single('user-photo');
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
            res.redirect('/sessaoExpirada')
            res.end();
        }
    });
    app.get("/sessaoExpirada",function(req,res) {
        res.sendFile(__dirname + "/public/sessaoExpirada.html");
    })

    app.get(prefixoPortal+'',function(req,res){
        res.sendFile(__dirname + "/public/portal.html");
    });
    app.get(prefixoPortal+'/computadores',function(req,res){
        res.sendFile(__dirname + "/public/sections/computador.html");
    });

    // ACESSO AOS GASTOS
    app.get(prefixoPortal+'/gastos', function(req, res) {
        res.sendFile(__dirname + "/public/sections/gasto.html");
    });
    // CONFIGURAÇÃO DE CONTA
    app.get(prefixoPortal+'/configuracoes', function(req, res) {
        res.sendFile(__dirname + "/public/sections/configuracaoConta.html");
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
                res.redirect("/portal/configuracoes")
            }
            else {
                res.end("File is invalid");
            }
        });
    });

    // ACESSO AOS DADOS
    app.use(prefixoDados+'*', function(req,res,next){
        sess=req.session;
        console.log("token "+req.headers.token)
        usuario.autenticacao(req.headers.token,req, res);
        setTimeout(function() {
            sess=req.session;
            if(sess.aut) {
                sess.aut=false;
                next();
            } else {
                req.session.destroy(function(err) {
                });
                res.end();
            }
        }, 30);
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
    app.get('/ip', function(req, res) {
        res.send(ip.address());
    });

    // ADICIONA UMA NOVA ADVERTENCIA
    app.post(prefixoDados+'/advertencia/', function(req, res){
        advertencia.create(req.body, res);
    });
    app.get('/foto.png', function (req, res) {
        res.contentType('png')
        try{
            res.sendFile(__dirname + "/img/fotoid"+req.session.idUser+".png");
        }
        catch(err){
            res.sendFile(__dirname + "public/img/avatar-placeholder.gif");
        }
        
    }); 


    /* ARDUINOS */
    // MOSTRA TODOS OS ARDUINOS
    app.get(prefixoDados+'/arduino/', function(req, res) {
        arduino.listAll(res);
    });
    app.get(prefixoDados+'/contador/', function(req, res) {
        usuario.contarRegistros(res);
    });
    app.get(prefixoDados+'/logado/', function(req, res) {
        usuario.getLogado(req.session.idUser,res);
    });
    ///
    // MOSTRA TODOS OS ARDUINOS DE UM SETOR ESPECIFICADO
    app.get(prefixoDados+'/arduino/setor/:id/', function(req, res) {
        arduino.listBySetor(req.params.id, res);
    });

    // MOSTRA UM ARDUINO ///
    app.get(prefixoDados+'/arduino/:id/', function(req, res) {
        arduino.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO ARDUNO //
    app.post('/arduino/', function(req, res) {
        arduino.create(req.body, res);
    });

    // MODIFICA UM ARDUNO //
    app.put(prefixoDados+'/arduino/', function(req, res) {
        arduino.update(req.body, res);
    });

    // DELETA UM ARDUNO //
    app.delete(prefixoDados+'/arduino/:id/', function(req, res) {
        arduino.delete(req.params.id, res);
    });
    ///
    app.post('/equipamentocheck', function(req, res) {
        if (req.body.command=="check") {
            equipamento.check(req.body.mac,res);
        }
        else if(req.body.command=="create"){
            equipamento.create(req.body,res);
        }
        else{
            res.send("INVALID COMMAND");
        }
        
    });
    ///
    app.get('/equipamentonew', function(req, res) {
      equipamento.checkNovo(res);
  });
    //
    app.post(prefixoDados+'/equipamentocheckarduino', function(req, res) {
        equipamento.checkArduino(req.body.mac,res);
    });
    /* EQUIPAMENTOS */
    // MOSTRA TODOS OS EQUIPAMENTOS //
    app.get(prefixoDados+'/equipamento/', function(req, res) {
        equipamento.listAll(res);
    });

    // MOSTRA UM EQUIPAMENTO //
    app.get(prefixoDados+'/equipamento/:id/', function(req, res) {
        equipamento.getOne(req.params.id, res);
    });

    // ADICIONA UM NOVO EQUIPAMENTO //
    app.post(prefixoDados+'/equipamento/', function(req, res) {
        equipamento.create(req.body, res);
    });

    // MODIFICA UM EQUIPAMENTO //
    app.put(prefixoDados+'/equipamento/', function(req, res) {
        equipamento.update(req.body, res);
    });

    // DELETA UM EQUIPAMENTO
    app.delete(prefixoDados+'/equipamento/:id/', function(req, res) {
        equipamento.delete(req.params.id, res);
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
    
    // MOSTRA O GASTO DE UM EQUIPAMENTO HOJE
    app.get(prefixoDados+'/gasto/hoje/:id/', function(req, res) {
        gasto.getOneHoje(req.params.id, res);
    });
     // MOSTRA O GASTO DE UM EQUIPAMENTO HOJE
     app.get(prefixoDados+'/gasto/arduino/:id/', function(req, res) {
        gasto.getOneHojeArduino(req.params.id, res);
    });

    // MOSTRA TODOS OS GASTOS DE UMA DATA ESPECIFICADA
    app.get(prefixoDados+'/gasto/:data', function(req, res) {
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
    //GASTO ESPECIFICO
    app.get(prefixoDados+'/gastoespecifico/', function(req, res) {
        gastoespecifico.listAll(res);
    });

    // MOSTRA TODOS OS gastoespecificoS DE HOJE DE TODOS OS ARDUINOS
    app.get(prefixoDados+'/gastoespecifico/hoje', function(req, res) {
        gastoespecifico.listHoje(res);
    });

    // MOSTRA O gastoespecifico DE UM ARDUINO EM UMA DATA ESPECIFICADA
    app.get(prefixoDados+'/gastoespecifico/:id/', function(req, res) {
        gastoespecifico.getOne(req.params.id, res);
    });
    
    // MOSTRA O gastoespecifico DE UM ARDUINO HOJE
    app.get(prefixoDados+'/gastoespecifico/hoje/:id/', function(req, res) {
        gastoespecifico.getOneHoje(req.params.id, res);
    });

    // MOSTRA TODOS OS gastoespecificoS DE UMA DATA ESPECIFICADA
    app.get(prefixoDados+'/gastoespecifico/:data', function(req, res) {
        gastoespecifico.listData(req.params.data,res);
    });

    // ADICIONA UM NOVO gastoespecifico
    app.post(prefixoDados+'/gastoespecifico/', function(req, res) {
        gastoespecifico.create(req.body, res);
    });

    // ADICIONA VALORES NULOS PARA COBRIR PERIODO DE INATIVIDADE
    app.post(prefixoDados+'/gastoespecifico/nulo', function(req, res) {
        gastoespecifico.intervalo(req.body, res);
    });


    app.delete(prefixoDados+'/gastoespecifico/:id/', function(req, res) {
        gastoespecifico.delete(req.params.id, res);
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

    /* CANVAS */
    app.get('/canvas/', function(req, res) {
        canvas.listAll(res);
    });

    app.get('/canvas/:setor/', function(req, res) {
        canvas.getOne(req.params.setor, res);
    });

    app.post('/canvas/', function(req, res) {
        canvas.create(req.body, res);
    });

    app.put('/canvas/', function(req, res) {
        canvas.update(req.body, res);
    });

    app.delete('/canvas/', function(req, res) {
        canvas.delete(req.body, res);
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
    app.get('/setor/', function(req, res) {
        setor.listAll(res);
    });

    app.get('/setor/arduino', function(req, res) {
        setor.listAllWArduino(res);
    });

    // MOSTRA UM SETOR
    app.get(prefixoDados+'/setor/:id/', function(req, res) {
        setor.getOne(req.params.id, res);
    });

    // CRIA UM NOVO SETOR
    app.post(prefixoDados+'/setor/', function(req, res) {
        setor.create(req.body, res);
    });
    
    app.post('/emailcheck', function(req, res) {
        usuario.checaEmailCadastrado(req.body, res);
    });

    // MODIFICA UM SETOR
    app.put(prefixoDados+'/setor/', function(req, res) {
        setor.update(req.body, res);
    });

    // DELETA UM SETOR
    app.delete(prefixoDados+'/setor/:id/', function(req, res) {
        setor.delete(req.params.id, res);
    });

    // VERIFICA SE EXISTEM SETORES CADASTRADOS
    app.get('/setorcheck', function(req, res) {
        setor.check(res);
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
    
    app.get('/sessao', function(req, res) {
        var array=[];
        array.push(sess.nome);
        array.push(sess.token);
        array.push(sess.idUser);
        array.push(sess.perfil);
        
        res.send(array);
    });
    app.post('/gerausuario', function(req, res) {
        usuario.geraUsuario(req.body,req, res);
    });

    // ADICIONA UM NOVO USUARIO
    app.post(prefixoDados+'/usuario/', function(req, res) {
        usuario.create(req.body,req, res);
    });

    // MODIFICA UM USUARIO
    app.put(prefixoDados+'/usuario/', function(req, res) {
        usuario.update(req.body,req, res);
    });
    // MODIFICA UM USUARIO
    app.put(prefixoDados+'/usuarioConta/', function(req, res) {
        usuario.updateConta(req.body, res);
    });

    // DELETA UM USUARIO
    app.delete(prefixoDados+'/usuario/:id/', function(req, res) {
        usuario.delete(req.params.id,req, res);
    });

    // CONTROLA O ACESSO AO SISTEMA COM BASE NOS DADOS DO USUARIO
    app.post('/login', function(req, res) {
        usuario.login(aes.decText(req.body.login,key,init),req.body.senha, req, res);
    });
    app.post('/loginWeb', function(req, res) {
        sess = req.session;
        sess.login=req.body.login;
        usuario.loginWeb(req.body.login,aes.encText(req.body.senha,key,init),req, res);
    });

}
};