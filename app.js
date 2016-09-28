//webservice
// BASE
var express = require('express');
var bodyparser = require('body-parser');
var connection = require('./connection');
var routes = require('./routes');
var session = require('express-session');
var net = require('net');
var gasto = require('./models/gasto');
var sess;

// INICIA O EXPRESS E PARSER JSON
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh'}));

// POSTCSS
var postcss = require('postcss');
var cssvariables = require('postcss-css-variables');

var fs = require('fs');

var mycss = fs.readFileSync('public/css/base.css', 'utf8');

// Process your CSS with postcss-css-variables
var output = postcss([
        cssvariables(/*options*/)
    ])
    .process(mycss)
    .css;
console.log(output);

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
    var ultimoEnvioData= new Date();;
    // SE ALGUM DADO FOR RECEBIDO
    sock.on('data', function(data) {
        var encodedString = String.fromCharCode.apply(null, data),
        data = decodeURIComponent(escape(encodedString));
        if (data.localeCompare("test")) {
            console.log("ok");
            sock.write(data);
        }
        else{
            console.log(data.localeCompare("test"));
        var ultimoEnvio = ultimoEnvioData.getHours()+":"+ultimoEnvioData.getMinutes()+":"+ultimoEnvioData.getSeconds();
        // REENVIA O QUE FOI RECEBIDO
        var idArduino = JSON.parse(data).arduino;
        var gastoRecebido = JSON.parse(data).gasto;

        if (arrayDadosArduino[idArduino] == undefined) {
            arrayDadosArduino[idArduino] = new Array(0);
        }
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (i!=idArduino && arrayIpArduino[i]==sock.remoteAddress) {
                arrayIpArduino[i]=null;
            }
        };
        arrayIpArduino[idArduino]=sock.remoteAddress;
        arrayDadosArduino[idArduino].push(gastoRecebido);
        gasto.intervalo(ultimoEnvio,idArduino);
        var isCheia = false;
        for (var i = 0; i <= arrayDadosArduino[idArduino].length - 1; i++) {
            if (i==599) {
                console.log("Inseriu");
                gasto.create(arrayDadosArduino[idArduino],idArduino, null);
                arrayDadosArduino[idArduino] = new Array(0);
            }
        };

        io.sockets.emit('toClient', { array: arrayDadosArduino[idArduino], arduino: idArduino });
        sock.write(data);
    }
        

    });
    // SE A CONEXÃO FOR FECHADA

    sock.on('close', function(data) {
        // INFORMA A DESCONEXÃO
        var idArduino=0;
        for (var i = 0; i <= arrayIpArduino.length - 1; i++) {
            if (arrayIpArduino[i]==sock.remoteAddress) {
                idArduino=i;
                console.log("ip: "+sock.remoteAddress+" desconectou,idArduino= "+i);
            }
        };
        gasto.create(arrayDadosArduino[idArduino],idArduino, null);
        arrayDadosArduino[idArduino] = new Array(0);
        io.sockets.emit('noConnection',data);
    });

    // SE OCORRER UM ERRO
    sock.on('error', function(err) {
        console.log(err);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);