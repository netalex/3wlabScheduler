//server.js
var jsonServer = require('json-server');
var server = jsonServer.create();
var router = jsonServer.router('./src/json/Database.json');
var middlewares = jsonServer.defaults();

var fs = require('fs')
var path = require('path')
var userDir = path.join(process.cwd(), '.')
var defaultDir = path.join(__dirname, '.')
var staticDir = fs.existsSync(userDir) ? userDir : defaultDir

server.use(middlewares);
server.use(router);
server.listen(3000, function(){console.log('JSON server is running on: localhost:3000')})
