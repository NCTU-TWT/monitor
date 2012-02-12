var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').createStream(4900),
    db              = require('./db');

// socket.io mute
io.set('log level', 0);


stream.on('chart', function (data) {

    console.log('new chart!!!');
    db.addChart(data);
})  
  
stream.on('value', function (data) {

})

stream.on('error', function (error) {
    console.log(error)
})

    
    
io.sockets.on('connection', function (socket) {
        
    
  
  
});

  
  
  
  
  
  
  

