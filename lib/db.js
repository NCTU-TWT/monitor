/*var redis = require('redis');

var client = redis.createClient(6379, '61.222.87.71');




client.on('error', function (err) {
    console.err(err);
})






module.exports = {
    charts: {
        read: function () {

            var id, callback;



            if (arguments.length === 1) {

                callback = arguments[0];

                client.lrange('monitor:charts', 0, -1, function (err, data) {
                    if (err) throw err;
                    callback(data);
                });
 
            } else if (arguments.length === 2) {    // get the chart
    
                id = arguments[0].toString();
                callback = arguments[1];

                client.get('monitor:charts:' + id, function (err, data) {
                    if (err) throw err;
                    callback(data);
                });
            
            }
       }
    }
};*/
