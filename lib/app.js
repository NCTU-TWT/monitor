var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').stream,
    streamDB        = require('./stream').streamDB;

// socket.io mute
io.set('log level', 0);


stream.on('chart', function (data) {

    streamDB.addChart(data);
    
})  
  
stream.on('stream', function (data) {

    streamDB.addStream(data);
})

stream.on('error', function (error) {
    console.log(error)
})

    
    
io.sockets.on('connection', function (socket) {
        
    
    
  
});

  
  
  
  
  
  
  

