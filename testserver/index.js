var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(401, {'Content-Type': 'text/json'});
    //res.write('Hello World!');
    res.end();
}).listen(8080);