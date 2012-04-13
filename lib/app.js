var EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io,
    stream          = require('./stream').stream/*,
    streamDB        = require('./stream').streamDB;*/
    
    
var sms = require('hinet-sms').createConnection();


sms.auth('89929940', '8ae7214f');



// socket.io mute
io.set('log level', 0);


stream.on('header', function (data) {
    //streamDB.addHeader(data);   
})  
  
stream.on('data', function (data) {    
    //streamDB.addData(data);
})

stream.on('error', function (error) {
    console.log(error)
})


var alert = {};
var phone;

io.sockets.on('connection', function (socket) {    
    
    if (phone)
        socket.emit('phone', phone)
    
    var callback = function (data) {
        socket.emit('data#v0.1', data);
        
        
    
        if (data.value > data.upperThreshold || data.value < data.lowerThreshold) {
            
            
            if (!alert[data.name]) {
            
            
            
                socket.emit('boo')
                
                if (phone) {
                    sms.send(phone, 'Your item has been moved!! sent by Con-Come Text Messaging Service');
                    
                }

                
                
                alert[data.name] = true;
            }
        } else {
            if (alert[data.name]) {
                alert[data.name] = false;
            }
        }
    };
    
    stream.on('data#v0.1', callback);    
    console.log(stream.listeners('data#v0.1').length);
    
    
    socket
        .on('phone', function (phoneNumber) {
            phone = phoneNumber;
        })
        .on('disconnect', function () {
            stream.removeListener('data#v0.1', callback)
        });
});




  
  
  
  
  

