var routes = require('routes');

module.exports = function () {
    var r = routes();
    r.addRoute('/', function (req, res) {
        res.end('oh hello\n');
    });
    r.addRoute('/robot', function (req, res) {
        res.end('beep boop\n');
    });
    return r;
};
