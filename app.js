//webservice
// BASE
const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./connection');
const routes = require('./routes');
const session = require('express-session');
const net = require('net');
const gasto = require('./models/gasto');
const usuario = require('./models/usuario');
var helmet = require('helmet');
var sess;

// INICIA O EXPRESS, PARSER JSON E SESSÃO
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh',name : 'sessionId',resave:true,saveUninitialized:false}));
app.use(helmet());

// POSTCSS
const postcss = require('postcss');
const cssvariables = require('postcss-css-variables');
// var autoprefixer = require('autoprefixer');

const fs = require('fs');
var css = [fs.readFileSync('public/css/raw/base.css', 'utf8'), fs.readFileSync('public/css/raw/home.css', 'utf8'), fs.readFileSync('public/css/raw/portal.css', 'utf8')];
var cssName = ['base', 'home', 'portal'];

// PROCESSA OS ARQUIVOS CSS
var output;
for (var i = css.length - 1; i >= 0; i--) {
    var output = postcss([
        cssvariables(/*options*/)
        ])
    .process(css[i])
    .css;
    fs.writeFile("public/css/post-processed/post-"+cssName[i]+".css", output);
}

// FAZ A CONEXÃO E DEFINE AS ROTAS
connection.init();
routes.configure(app);
var server = app.listen(1515, function() {
	console.log('Server listening on port ' + server.address().port);
});
var macDesliga=[];
var pcsLigados=[];
//desktop
app.post('/desligaconf', function(req, res) {
    if (req.body.option!=undefined) {
        if (req.body.option=="sim") {
            var index = macDesliga.indexOf(req.body.mac);
            macDesliga.splice(index, 1);
            io.sockets.emit('continuaUsando', req.body.mac);
        }
        else if (req.body.option=="nao") {
            var index = pcsLigados.indexOf(req.body.mac);
            pcsLigados.splice(index, 1);
            var index = macDesliga.indexOf(req.body.mac);
            macDesliga.splice(index, 1);
        }
    }
    else{
        var index = pcsLigados.indexOf(req.body.mac);
            pcsLigados.splice(index, 1);
            var index = macDesliga.indexOf(req.body.mac);
            macDesliga.splice(index, 1);
    }
    io.sockets.emit('pcLigado', req.body.mac);
    res.send(pcsLigados);

});

//desktop
app.post('/pcligado', function(req, res) {
    var repetido=false
    for (var i = pcsLigados.length - 1; i >= 0; i--) {
        if (pcsLigados[i]==req.body.mac) {
            repetido=true
        }
    }
    if (!repetido) {
        pcsLigados.push(req.body.mac);
    }
    io.sockets.emit('pcLigado', req.body.mac);
    res.send(pcsLigados);

});
//web
app.get('/pcligado', function(req, res) {
    res.send(pcsLigados);

});
app.post('/desligapc', function(req, res) {
    var repetido=false
    for (var i = macDesliga.length - 1; i >= 0; i--) {
        if (macDesliga[i].mac==req.body.mac) {
            repetido=true
        }
    };
    if (!repetido) {
        macDesliga.push({
            mac: req.body.mac
        });
    }
    res.send(macDesliga);

});
//desktop
app.get('/desligapc', function(req, res) {
    res.send(macDesliga);
});
// DESLOGA UM USUARIO COM BASE EM SEU TOKEN
app.post('/logout', function(req, res) {
    usuario.logoutDesktop(req.body.token, res);
    var index = macDesliga.indexOf(req.body.mac);
    pcsLigados.splice(index, 1);
    console.log("deslogou");
    io.sockets.emit('pcLigado', req.body.mac);
    req.session.destroy(function(err) {
    });
});
app.get('/logout', function(req, res) {
    usuario.logoutWeb(req.session.token, res);
    req.session.destroy(function(err) {
    });
});
var precoKilowatt={};
precoKilowatt.valor=0;
var custoTotal=0;
app.post('/kilowatt', function(req, res) {
    console.log(req.body.valor);
   precoKilowatt.valor=req.body.valor;
   precoKilowatt.data = new Date();
   res.end();
});
// CAPTURA IP DA MAQUINA
var ip = require("ip");
//SERVIDOR NET
var HOST = ip.address();
var PORT = 3000;


var arrayIpArduino=[];
var arrayDadosEquipamento= new Array(0);
arrayDadosEquipamento[0] = new Array(0);
var arrayDadosArduino= new Array(0);
arrayDadosArduino[0] = new Array(0);
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log("conectou");
    sockets = socket;
    socket.on('load',function(data) {
        // var aasd = gasto.getOneHoje(data, null);
        // console.log(aasd);
        socket.emit('toClientLoad', arrayDadosArduino[data]);
    });
    
});


net.createServer(function(sock) {
    // NOTIFICA A CONEXÃO RECEBIDA
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    var ultimoEnvioData= new Date();
    // SE ALGUM DADO FOR RECEBIDO
    sock.on('data', function(data) {
        var encodedString = String.fromCharCode.apply(null, data),
        data = decodeURIComponent(escape(encodedString));
        if (data.trim().localeCompare("test")==0) {
            sock.write(data);
        }
        else{

           var ultimoEnvio = ultimoEnvioData.getHours()+":"+ultimoEnvioData.getMinutes()+":"+ultimoEnvioData.getSeconds();

        // REENVIA O QUE FOI RECEBIDO
        var idEquipamento = JSON.parse(data).equipamento;
        var gastoRecebido = JSON.parse(data).gasto;
        var arduino = JSON.parse(data).arduino;
        // console.log("custo total "+custoTotal);
        // console.log("preco kilowatt "+precoKilowatt.valor);
        // console.log("gasto recebido "+gastoRecebido);

        custoTotal=custoTotal+(precoKilowatt.valor*gastoRecebido)
        gasto.intervalo(ultimoEnvio,idEquipamento);    
        // console.log('ultimoEnvio'+ultimoEnvio);
        if (arrayDadosEquipamento[idEquipamento] == undefined) {
            arrayDadosEquipamento[idEquipamento] = new Array(0);
        }
        if (arrayDadosArduino[arduino] == undefined) {
            arrayDadosArduino[arduino] = new Array(0);
        }
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (i!=idEquipamento && arrayIpArduino[i]==sock.remoteAddress +':'+ sock.remotePort) {
                arrayIpArduino[i]=null;
            }
        };
        arrayIpArduino[idEquipamento]=sock.remoteAddress +':'+ sock.remotePort;
        arrayDadosEquipamento[idEquipamento].push(gastoRecebido);
        arrayDadosArduino[arduino].push(gastoRecebido);
        
        var isCheia = false;
        
        for (var i = 0; i <= arrayDadosEquipamento[idEquipamento].length - 1; i++) {
            if (i==599) {
                gasto.create(arrayDadosEquipamento[idEquipamento],idEquipamento, null);
                ultimoEnvioData= new Date();
                arrayDadosEquipamento[idEquipamento] = new Array(0);
            }
        };
        io.sockets.emit('toClient', { gasto: gastoRecebido, arduino: arduino, custo: custoTotal });
        sock.write(data);
    }


});
    // SE A CONEXÃO FOR FECHADA

    sock.on('close', function(data) {
        console.log("DESCONECTADO");
        // INFORMA A DESCONEXÃO
        var idEquipamento=0;
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (arrayIpArduino[i]==sock.remoteAddress +':'+ sock.remotePort) {
                idEquipamento=i;
                console.log("ip: "+sock.remoteAddress +':'+ sock.remotePort+" desconectou,idEquipamento= "+i);
            }
        };

        gasto.create(arrayDadosEquipamento[idEquipamento],idEquipamento, null);
        arrayDadosEquipamento[idEquipamento] = new Array(0);
        io.sockets.emit('noConnection',data);
    });

    // SE OCORRER UM ERRO
    sock.on('error', function(err) {
        console.log(err);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);