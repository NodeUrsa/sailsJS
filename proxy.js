var util      = require('util'),
    colors    = require('colors'),
    http      = require('http'),
    httpProxy = require('http-proxy'),
    express   = require('express'),
    url       = require('url');

var app       = express(),
    proxy     = httpProxy.createProxyServer({});

app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.get('/js/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/css/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/fonts/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/imgs/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/sounds/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/json/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.get('/templates/*', function(req, res) {
    res.sendfile(__dirname + '/assets' + url.parse(req.url).pathname);
});

app.use(function (req, res) {
    proxy.web(req, res, { target: 'http://netvision.streamcrease.com:9004' });
    //proxy.web(req, res, { target: 'http://warehouse.netvisionllc.com' });
//    proxy.web(req, res, { target: 'http://31.43.103.68:1337/' });
//    proxy.web(req, res, { target: ' http://31.43.103.68:9001' });
//    proxy.web(req, res, { target: ' http://31.43.103.68:9000'  });http://31.43.103.68:1337/
});

util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8005'.yellow);
util.puts('http server '.blue + 'listening '.green.bold + 'on port '.blue + '8080 '.yellow);

app.listen(8005);
