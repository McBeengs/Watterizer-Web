var routes = require('routes');
var prefix = require('../');
var test = require('tape');
var concat = require('concat-stream');
var through = require('through2');

test('router', function (t) {
    t.plan(6);
    
    var r = createRouter();
    var router = prefix('/xyz', r);
    
    capture(router, '/xyz', function (err, body) {
        t.ifError(err);
        t.equal(body.toString('utf8'), 'oh hello\n');
    });
    capture(router, '/xyz/robot', function (err, body) {
        t.ifError(err);
        t.equal(body.toString('utf8'), 'beep boop\n');
    });
    capture(router, '/abc', function (err, body) {
        t.ok(err);
    });
    capture(router, '/robot', function (err, body) {
        t.ok(err);
    });
});

function createRouter () {
    var r = routes();
    r.addRoute('/', function (req, res) {
        res.end('oh hello\n');
    });
    r.addRoute('/robot', function (req, res) {
        res.end('beep boop\n');
    });
    return r;
}

function capture (router, p, cb) {
    var m = router.match(p);
    if (!m) return cb(new Error('no match'));
    var req = through(), res = through();
    res.pipe(concat(function (body) { cb(null, body) }));
    m.fn(req, res, m);
}
