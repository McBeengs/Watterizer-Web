var http = require('http');
var prefix = require('../');
var router = prefix('/xyz', require('./router')());

var server = http.createServer(function (req, res) {
    var m = router.match(req.url);
    if (m) return m.fn(req, res, m);
    res.statusCode = 404;
    res.end('not found\n');
});
server.listen(5000);
