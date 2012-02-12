var redis   = require('redis'),
    _       = require('underscore');
    async   = require('async');

//var StreamDB = function () {};




module.exports = {
    connect: function () {
        client = redis.createClient(6379, '61.222.87.71');
        client.on('error', function (err) {
            console.err(err);
        })
    },
    quit: function () {
        client.quit();
    },
    addSession: function (sessionID, callback) {
        client.sadd('monitor:sessions', sessionID, function (err, data) {
            if (err) throw err;
            
            if (callback)
                callback(data);
        
        })
    },
    removeSession: function (sessionID, callback) {
        this.getSession(sessionID, function (data) {
        
            var streamList = []
            
            _.each(data, function (elem) {
                streamList = streamList.concat(_.values(elem.value));
            });
            
            var tasks =  _.map(streamList, function (streamID) {
                return function (callback) {
                    client.del('monitor:streams:' + streamID, function (err, data) {
                        if (err) throw err;
                        callback();
                    })
                };
            });
            
            tasks.push(function (callback) {
                client.srem('monitor:sessions', sessionID, function (err, data) {
                    if (err) throw err;
                    
                    callback(null, data);        
                });
            });
            
            tasks.push(function (callback) {
                client.del('monitor:sessions:' + sessionID, function (err, data) {
                    if (err) throw err;
                    
                    callback(null, data);        
                });
            });
            
            async.parallel(tasks, function (err, result) {
                callback(result);
            });
        })
    },
    getSessions: function (callback) {
        client.smembers('monitor:sessions', function (err, data) {
            if (err) throw err;
            
            
            if (callback)
                callback(data);
        
        })
    },
    addChart: function (chart, callback) {
    
        // add to the session set
        client.sadd('monitor:sessions:' + chart.session, JSON.stringify(chart), function (err, data) {
            if (err) throw err;
            
            // new session
            if (data === 1) {
                module.exports.addSession(chart.session, function () {
                
                    if (callback)
                        callback(data);
                });
            } else {
                    
                if (callback)
                    callback(data);
            }
            
        
        })
    },
    getSession: function (sessionID, callback) {
    
        // add to the session set
        client.smembers('monitor:sessions:' + sessionID, function (err, data) {
            if (err) throw err;
            
            data = _.map(data, JSON.parse);
                        
            if (callback)
                callback(data);
        
        })
    },
    addStream: function (data, callback) {
    
        var streamID = data.id;
        var data = JSON.stringify({
            value: data.value,
            time: data.time
        });
            
        client.rpush('monitor:streams:' + streamID, data, function (err, data) {
            if (err) throw err;
            
            if (callback)
                callback(data);
        
        })
    }
};
