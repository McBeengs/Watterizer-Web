module.exports = function (prefix, router) {
    var prouter = {};
    Object.keys(router).forEach(function (key) {
        if (key === 'match') return;
        prouter[key] = router[key];
    });
    
    prouter.match = function (pathname, startAt) {
        var p = pathname.split('?')[0];
        var post = pathname.slice(prefix.length) || '/';
        
        if (p === prefix) {
            return router.match(post, startAt);
        }
        
        var pre = p.slice(0, prefix.length + 1);
        if (pre !== prefix + '/') return null;
        
        return router.match(post, startAt);
    };
    
    return prouter;
};
