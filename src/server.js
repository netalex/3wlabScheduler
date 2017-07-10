var express = require('express'),
    fs = require('fs')
    url = require('url');
var app = express();

app.use('/', express.static(__dirname + '/'));
app.use(express.static(__dirname + '/'));

app.post('/receive', function(request, respond) {
    var body = '';
    filePath = __dirname + '/data.json';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});

app.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
