var server      = require('./server').server,
    streamdb    = require('./streamdb');

server.get('/sessions', function (req, res) {

});

server.get('/sessions/:id', function (req, res) {

    db.getSession(req.params.id, function (data) {

        console.log(req.params.id);
        res.json(data);
        
        
    });
});
