var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').stream,
    streamDB        = require('./stream').streamDB;

// socket.io mute
io.set('log level', 0);


stream.on('header', function (data) {
    streamDB.addHeader(data);   
})  
  
stream.on('data', function (data) {    
    streamDB.addData(data);
})

stream.on('error', function (error) {
    console.log(error)
})

   
io.sockets.on('connection', function (socket) {
    stream.pipe('header', socket);
    stream.pipe('data', socket);
});

  
  
  
  
  
  
  

