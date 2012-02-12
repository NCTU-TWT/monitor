var server      = require('./server').server,
    StreamDB    = require('./streamdb');

var streamDB = new StreamDB;
streamDB.connect();

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
