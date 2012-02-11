var net             = require('net'),
    EventEmitter    = require('events').EventEmitter;

module.exports.createStream = function (port) {
        
    var stream = new EventEmitter; 
    
    var parser = function (data) {
        if (data.session !== undefined) 
            stream.emit('chart', data);
        else 
            stream.emit('value', data);
    };


    var socketServer = net.createServer(function (client) {
          
        client
            .on('data', function (data) {
                // parse with caution   
                try {
                    data = JSON.parse(data.toString());
                } catch (e) {
                    stream.emit('error', e);
                }
                // hand to the parse
                parser(data);

            }).on('error', function (error) {
                // pipe error
                stream.emit('error', error);
            })
        
    }).listen(port || 4900);

    stream.pipe = function (event, destination) {    
        stream.on(event, function (data) {            
            destination.emit(event, data);
        });
    };

    return stream;
};