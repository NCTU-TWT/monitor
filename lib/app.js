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


var alert = {}, timeout = {};
var phone;

io.sockets.on('connection', function (socket) {    
    
    if (phone)
        socket.emit('phone', phone)
    
    var callback = function (data) {
        socket.emit('data#v0.1', data);
        
        
    
        if (data.upperThreshold !== undefined && data.lowerThreshold !== undefined & (data.value > data.upperThreshold || data.value < data.lowerThreshold)) {
            
            
            
            if (!alert[data.name] && (timeout[data.name] === undefined || Date.now() - timeout[data.name] > 10000)) {
            
           
                socket.emit('boo')
                
                if (phone) {
                
                    if (/AccelerometerX/.test(data.name)) {
                        sms.send(phone, 'Your item has been moved!! Sent by con-come texting service');
                    } else if (/Temperature/.test(data.name)) {
                    
                        if (data.value > data.upperThreshold)
                            sms.send(phone, 'Warning!! Temperature is too high!! Sent by con-come texting service');
                        else
                            sms.send(phone, 'Warning!! Temperature is too low!! Sent by con-come texting service');                            
                            
                    } else if (/Humidity/.test(data.name)) {
                    
                        if (data.value > data.upperThreshold)
                            sms.send(phone, 'Warning!! Humidity is too high!! Sent by con-come texting service');
                        else
                            sms.send(phone, 'Warning!! Humidity is too low!! Sent by con-come texting service');
                            
                    }
                    
                }

                
                
                alert[data.name] = true;
                timeout[data.name] = Date.now();
            }
        } else {
            if (alert[data.name]) {
                alert[data.name] = false;
            }
        }
    };
    
    stream.on('data#v0.1', callback);    
    
    
    socket
        .on('phone', function (phoneNumber) {
            phone = phoneNumber;
        })
        .on('disconnect', function () {
            stream.removeListener('data#v0.1', callback)
        });
});




  
  
  
  
  

