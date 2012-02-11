var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').createStream(4900);

// socket.io mute
io.set('log level', 0);


io.sockets.on('connection', function (socket) {
        
    stream.on('chart', function (data) {
    
        // pipe it to the browser
        socket.emit('chart', data);
               
    })  
      
    stream.on('value', function (data) {
    
        // pipe it to the browser   
        socket.emit('value', data);
    })
    
  
  
});

  
  
  
  
  
  
  

