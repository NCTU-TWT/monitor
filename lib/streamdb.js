var redis   = require('redis'),
    _       = require('underscore');
    async   = require('async');

var StreamDB = function () {
    this.client;
};



StreamDB.prototype.connect = function (port, host) {
    this.client = redis.createClient(
        port || 6379, 
        host || '61.222.87.71'
    );
    this.client.on('error', function (err) {
        console.err(err);
    });
}



StreamDB.prototype.quit = function () {
    this.client.quit();
};



StreamDB.prototype.addChart = function (chart, callback) {
    
    var self = this;
    
    // add to the session set
    this.client.sadd('monitor:sessions:' + chart.session, JSON.stringify(chart), function (err, data) {
        if (err) throw err;
        
        // new session
        if (data === 1) {
            self._addSession(chart.session, function () {            
                if (callback)
                    callback(data);
            });
        } else {                
            if (callback)
                callback(data);
        }
    });
};



StreamDB.prototype.addStream = function (data, callback) {
    
    var streamID = data.id;
    var data = JSON.stringify({
        value: data.value,
        time: data.time
    });
        
    this.client.rpush('monitor:streams:' + streamID, data, function (err, data) {
        if (err) throw err;        
        if (callback)
            callback(data);
    
    });
};

StreamDB.prototype._addSession = function (sessionID, callback) {
    this.client.sadd('monitor:sessions', sessionID, function (err, data) {
        if (err) throw err;
        
        if (callback)
            callback(data);    
    })
},

StreamDB.prototype.getSession = function (sessionID, callback) {

    // add to the session set
    this.client.smembers('monitor:sessions:' + sessionID, function (err, data) {
        if (err) throw err;        
        data = _.map(data, JSON.parse);                    
        if (callback)
            callback(data);    
    });
};



StreamDB.prototype.getSessions = function (callback) {
    this.client.smembers('monitor:sessions', function (err, data) {
        if (err) throw err;
        if (callback)
            callback(data);    
    });
};

StreamDB.prototype.removeSession = function (sessionID, callback) {

    var self = this;

    this.getSession(sessionID, function (data) {
    
        var streamList = []
        
        _.each(data, function (elem) {
            streamList = streamList.concat(_.values(elem.value));
        });
        
        var tasks =  _.map(streamList, function (streamID) {
            return function (callback) {
                self.client.del('monitor:streams:' + streamID, function (err, data) {
                    if (err) throw err;
                    callback();
                })
            };
        });
        
        tasks.push(function (callback) {
            self.client.srem('monitor:sessions', sessionID, function (err, data) {
                if (err) throw err;
                
                callback(null, data);        
            });
        });
        
        tasks.push(function (callback) {
            self.client.del('monitor:sessions:' + sessionID, function (err, data) {
                if (err) throw err;
                
                callback(null, data);        
            });
        });
        
        async.parallel(tasks, function (err, result) {
            callback(result);
        });
    });
};

module.exports = StreamDB;
