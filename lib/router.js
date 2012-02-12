var server  = require('./server').server,
    db      = require('./db');

server.get('/sessions', function (req, res) {

    db.getSessions(function (data) {
        res.json(data);
    });

});

server.get('/sessions/:id', function (req, res) {

    db.getSession(req.params.id, function (data) {

        console.log(req.params.id);
        res.json(data);
        
        
    });
});
