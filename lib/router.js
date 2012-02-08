var server = require('./server').server;

server.get('/test', function (req, res) {
    res.send('test la');
})
