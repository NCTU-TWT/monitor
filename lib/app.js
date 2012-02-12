var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').createStream(4900),
    StreamDB        = require('./streamdb');

var streamDB = new StreamDB
streamDB.connect();

// socket.io mute
io.set('log level', 0);


stream.on('chart', function (data) {

    console.log('new chart!!!');
    streamDB.addChart(data, function (data) {        
        console.log('chart added!!!');
    });
    
})  
  
stream.on('value', function (data) {

})

stream.on('error', function (error) {
    console.log(error)
})

    
    
io.sockets.on('connection', function (socket) {
        
    
    
  
});

  
  
  
  
  
  
  

