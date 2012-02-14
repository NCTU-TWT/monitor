var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').createStream(4900),
    StreamDB        = require('./streamdb');

var streamDB = new StreamDB
streamDB.connect();

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

  
  
  
  
  
  
  

