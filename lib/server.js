var express     = require('express'),
    socketio    = require('socket.io');
    



var app = express.createServer();
var io  = socketio.listen(app);


// Configuration    

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});
        
app.configure('development', function () {

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    })); 
    app.use(express.static(__dirname + '/../../monitor-client/lib'));
    
});

app.configure('production', function () {

    app.use(express.errorHandler()); 
    app.use(express.static(__dirname + '/../node_modules/monitor-client'));
    
});


app.listen(3000);
console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);



module.exports = {
    server: app,
    io: io
}
