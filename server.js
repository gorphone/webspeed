var http = require('http');

var host = '127.0.0.1',
	port = 1337;

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Panda Nodejs!');
}).listen(port, host);

console.log('Server running at ' + host + ':' + port);