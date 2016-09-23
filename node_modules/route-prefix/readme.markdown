# route-prefix

add a prefix in front of a [router](https://npmjs.org/package/routes)

[![build status](https://secure.travis-ci.org/substack/route-prefix.png)](http://travis-ci.org/substack/route-prefix)

# example

Suppose you have a router.js file:

``` js
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
```

Now you can mount that router at a prefix.
In this case, the prefix is `/xyz`:

``` js
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
```

# methods

``` js
var prefix = require('route-prefix')
```

## var prouter = prefix(pre, router)

Return a new router `prouter` that mounts the
[routes](https://npmjs.org/package/routes) `router` at the prefix string `pre`.

The given `router` just needs to have a `router.match(url)` function that
returns a falsy value when the route doesn't match. The
[routes](https://npmjs.org/package/routes) package happens to supply that
interface but you can use whatever module you want and the enumerable properties
are copied from `router` to create the `prouter` copy.

# install

With [npm](https://npmjs.org) do:

```
npm install route-prefix
```

# license

MIT
