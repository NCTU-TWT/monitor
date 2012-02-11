var server  = require('./server').server,
    db      = require('./db');

server.get('/charts', function (req, res) {
/*
    db.charts.read(function (data) {
        res.json(data);
    });*/

});

server.get('/charts/:id', function (req, res) {
/*
    db.charts.read(req.params.id, function (data) {

        console.log(req.params.id);
        res.json(data);
    });*/
});
