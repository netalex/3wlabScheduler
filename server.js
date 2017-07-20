//server.js
var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('./public/json/Database.json');
var middlewares = jsonServer.defaults();

var fs = require('fs')
var path = require('path')
var userDir = path.join(process.cwd(), '.')
var defaultDir = path.join(__dirname, '.')
var staticDir = fs.existsSync(userDir) ? userDir : defaultDir;
var port = process.env.PORT || 3000;

var routes = require('./public/json/routes.json');
server.use(jsonServer.rewriter(routes));

server.use(middlewares);
server.use(router);
server.listen(port, function(){console.log('JSON server is running on: localhost:3000')})
