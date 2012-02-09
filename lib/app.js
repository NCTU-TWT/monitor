var net             = require('net'),
    EventEmitter    = require('events').EventEmitter,
    io              = require('./server').io;

// socket.io mute
io.set('log level', 0);

// mediator
var mediator = new EventEmitter;

chartDB = {};
valueDB = {};

var parser = function (data) {

    
    if (data.session !== undefined) {
        // chart

        if (chartDB[data.session] === undefined) {
            // new session
            chartDB[data.session] = [];
        }

        chartDB[data.session].push(data);

    } else {
        // value
        
        if (valueDB[data.id] === undefined) {
            // new id
            valueDB[data.id] = [];
        }


        valueDB[data.id].push({
            value: data.value,
            time: data.time

        });
    }

};


var socketServer = net.createServer(function (client) {
      
    client
        .on('data', function (data) {
                  
            try {
                data = JSON.parse(data.toString());
            } catch (e) {}

            parser(data);

        })
        .on('error', function (error) {
            console.log(error);
        })


  

}).listen(4900);

  
  
  
  
  
  
  
  
  
  
  
  

