var server  = require('./server').server,
    db      = require('./db');

server.get('/charts', function (req, res) {

    var data = db.getCharts();
    res.send({data: 'helo'});


})
