var server      = require('./server').server,
    stream      = require('./stream').stream,
    streamDB    = require('./stream').streamDB;

server.get('/sessions', function (req, res) { 
    streamDB.getSessions(function (data) {
        res.json(data);
    });
});

server.get('/sessions/:id', function (req, res) {
    streamDB.getSession(req.params.id, function (data) {
        res.json(data);   
    });
});

server.get('/streams/:id', function (req, res) {
    streamDB.getStream(req.params.id, function (data) {
        res.json(data);   
    });
});
