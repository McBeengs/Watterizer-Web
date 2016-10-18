//webservice
// BASE
const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./connection');
const routes = require('./routes');
const session = require('express-session');
const net = require('net');
const gasto = require('./models/gasto');
var helmet = require('helmet');
var sess;

// INICIA O EXPRESS E PARSER JSON
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh',name : 'sessionId'}));

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

var ip = require("ip");
//SERVIDOR NET
var HOST = ip.address();
var PORT = 3000;


var arrayIpArduino=[];
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

var usuarioDesliga=[];
    app.post('/desliga', function(req, res) {
    var repetido=false;
    sess = req.session;
    for (var i = usuarioDesliga.length - 1; i >= 0; i--) {
        if (usuarioDesliga[i]==sess.login) {
            repetido=true;
        };
    };
    if (!repetido) {
        usuarioDesliga.push(sess.login);
    };
    res.redirect('/portal')
    console.log(usuarioDesliga);

    });
    app.post('/desligaconf', function(req, res) {
    if (req.body.confirm==true) {
        for (var i = usuarioDesliga.length - 1; i >= 0; i--) {
           if (usuarioDesliga[i]==req.body.user) {
            res.send("desligar "+usuarioDesliga[i]);
             usuarioDesliga.splice(i,1);
           };
        };
    }
    else{
        for (var i = usuarioDesliga.length - 1; i >= 0; i--) {
           if (usuarioDesliga[i]==req.body.user) {
            res.send("nao desligar "+usuarioDesliga[i]);
            usuarioDesliga.splice(i,1);
           };
        };
        
    }
    try{
        res.send("sem confirmacoes");
    }
    catch(e){

    }
    

    });
app.get('/desliga', function(req, res) {
    res.send(usuarioDesliga);
    console.log(usuarioDesliga);

});
net.createServer(function(sock) {
    // NOTIFICA A CONEXÃO RECEBIDA
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    var ultimoEnvioData= new Date();
    // SE ALGUM DADO FOR RECEBIDO
    sock.on('data', function(data) {
        var encodedString = String.fromCharCode.apply(null, data),
        data = decodeURIComponent(escape(encodedString));
        if (data.trim(data).localeCompare("test")==0) {
            console.log("ok");
            sock.write(data);
        }
        else{
            
        var ultimoEnvio = ultimoEnvioData.getHours()+":"+ultimoEnvioData.getMinutes()+":"+ultimoEnvioData.getSeconds();
        // REENVIA O QUE FOI RECEBIDO
        var idEquipamento = JSON.parse(data).arduino;
        var gastoRecebido = JSON.parse(data).gasto;
        

        if (arrayDadosArduino[idEquipamento] == undefined) {
            arrayDadosArduino[idEquipamento] = new Array(0);
        }
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (i!=idEquipamento && arrayIpArduino[i]==sock.remoteAddress) {
                arrayIpArduino[i]=null;
            }
        };
        arrayIpArduino[idEquipamento]=sock.remoteAddress;
        arrayDadosArduino[idEquipamento].push(gastoRecebido);
        gasto.intervalo(ultimoEnvio,idEquipamento);
        var isCheia = false;
        
        for (var i = 0; i <= arrayDadosArduino[idEquipamento].length - 1; i++) {
            if (i==599) {
                
                gasto.create(arrayDadosArduino[idEquipamento],idEquipamento, null);
                arrayDadosArduino[idEquipamento] = new Array(0);
            }
        };

        io.sockets.emit('toClient', { array: arrayDadosArduino[idEquipamento], arduino: idEquipamento });
        sock.write(data);
    }
        

    });
    // SE A CONEXÃO FOR FECHADA

    sock.on('close', function(data) {
        // INFORMA A DESCONEXÃO
        var idEquipamento=0;
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (arrayIpArduino[i]==sock.remoteAddress) {
                idEquipamento=i;
                console.log("ip: "+sock.remoteAddress+" desconectou,idEquipamento= "+i);
            }
        };
        gasto.create(arrayDadosArduino[idEquipamento],idEquipamento, null);
        
        arrayDadosArduino[idEquipamento] = new Array(0);
        io.sockets.emit('noConnection',data);
    });

    // SE OCORRER UM ERRO
    sock.on('error', function(err) {
        console.log(err);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);