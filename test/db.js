var assert  = require('assert'),
    _       = require('underscore'),
    redis   = require('redis'),
    async   = require('async'),
    colors  = require('colors'),
    db      = require('../lib/db'); 


db.connect();

var client = redis.createClient(6379, '61.222.87.71');
client.on('error', function (err) {
    console.err(err);
});
    
var charts = [{
        'session': 'session01',
        'unit': 'G',
        'value': {
            'a': 1000,
            'b': 1001,
            'c': 1002
        },
        'upperBound': '100',
        'lowerBound': '-100',
        'reference': '0'
    }, {
        'session': 'session01',
        'unit': 'G',
        'value': {
            'A': 1003,
            'B': 1004,
            'C': 1005
        },
        'upperBound': '100',
        'lowerBound': '-100',
        'reference': '0'
    }, {
        'session': 'session02',
        'unit': 'G',
        'value': {
            'a': 2000,
            'b': 2001,
            'c': 2002
        },
        'upperBound': '100',
        'lowerBound': '-100',
        'reference': '0'
    }, {
        'session': 'session02',
        'unit': 'G',
        'value': {
            'A': 2003,
            'B': 2004,
            'C': 2005
        },
        'upperBound': '100',
        'lowerBound': '-100',
        'reference': '0'
}]

var sessions = [
    'session01',
    'session02'
];

var streams = [
    { id: 1003, value: 0, time: 1 },
    { id: 1003, value: 1, time: 2 },
    { id: 1003, value: 2, time: 3 },
    { id: 1003, value: 3, time: 4 },
    { id: 1003, value: 4, time: 5 },
    { id: 1003, value: 5, time: 6 },
    { id: 1004, value: 10, time: 11 },
    { id: 1004, value: 11, time: 12 },
    { id: 1004, value: 12, time: 13 },
    { id: 1004, value: 13, time: 14 },
    { id: 1004, value: 14, time: 15 },
    { id: 1004, value: 15, time: 16 },
    { id: 1005, value: 30, time: 21 },
    { id: 1005, value: 31, time: 22 },
    { id: 1005, value: 32, time: 23 },
    { id: 1005, value: 33, time: 24 },
    { id: 1005, value: 34, time: 25 },
    { id: 1005, value: 35, time: 26 },
]

var sameArray = function (a, b) {
    return _.all(a, function (aElem) {
        return _.any(b, function (bElem) {
            return _.isEqual(bElem, aElem);
        });
    }) && _.all(b, function (bElem) {
        return _.any(a, function (aElem) {
            return _.isEqual(aElem, bElem);
        });
    });
};



// addChart
var testAddChart = function (callback) {

    tests = _.map(charts, function (chart) {
        return function (callback) {
                    
            db.addChart(chart, function (data) {

                async.parallel([
                    function (callback) {
                    
                        client.smembers('monitor:sessions', function (err, data) {  
                            if (err) throw err;                          
                            assert.deepEqual(sessions, data, 'new session not added to the session sets'.red);
                            callback();
                        });
                        
                    },
                    function (callback) {
                
                        client.smembers('monitor:sessions:' + chart.session, function (err, data) { 
                            if (err) throw err; 
                            data = _.map(data, JSON.parse);  
                            var ok = _.any(data, function (ch) {
                                return _.isEqual(ch, chart);
                            });                            
                            assert(ok, 'new chart not adding to the session');
                            callback();
                        });
                }], function () {
                    callback();
                });
            
            });
            
            
        };
    });
    
    async.parallel(tests, function (err, result) {
        console.log('addChart ' + 'pass'.green)       
        callback();
    });
    
};




// getSession
var testGetSession = function (callback) {

    tests = _.map(charts, function (chart) {
        return function (callback) {
            
            db.getSession(chart.session, function (result) {
            
                result = _.map(result, JSON.parse);
                
                expected = _.filter(charts, function (elem) {
                    return elem.session === chart.session;
                })
                
                var ok = sameArray(result, expected);
    
                
                assert(ok, 'unable to get the session');            
                callback();
            });
            
            
            
        };
    });

    async.parallel(tests, function (err, result) {
        console.log('getSession ' + 'pass'.green)       
        callback();
    });
    
};



// getSessions
var testGetSessions = function (callback) {

    tests = _.map(charts, function (chart) {
        return function (callback) {
            
            db.getSessions(function (result) {
            
                expected = sessions;
                
                var ok = sameArray(result, expected);
                
                assert(ok, 'unable to get the session sets');            
                callback();
            });
            
        };
    });

    async.parallel(tests, function (err, result) {
        console.log('getSessions ' + 'pass'.green)       
        callback();
    });
    
};





// removeSession
var testRemoveSession = function (callback) {

    tests = _.map(charts, function (chart) {
        return function (callback) {
            
            db.removeSession(chart.session, function (result) {
            
                async.parallel([
                    function (callback) {
                        client.sismember('monitor:sessions', chart.session, function (err, data) {                
                            if (err) throw err;
                            
                            var ok = data === 0;
                            
                            assert(ok, 'session ID not removed from sessions set');  
                            callback();
                        })
                    },
                    function (callback) {
                
                        client.exists('monitor:sessions:' + chart.session, function (err, data) {                
                            if (err) throw err;                            
                            var ok = data === 0;
                            
                            assert(ok, 'session not removed');  
                            callback();
                        });
                    }                    
                ], function (err, result) {
                    callback();
                });
            
            });
            
        };
    });

    async.parallel(tests, function (err, result) {
        console.log('removeSession ' + 'pass'.green)       
        callback();
    });
    
};


// addStream
var testAddStream = function (callback) {

    tests = _.map(streams, function (stream) {
        return function (callback) {
            
            db.addStream(stream, function (result) {
            
            
                client.lrange('monitor:streams:' + stream.id, 0, -1, function (err, data) {                
                    if (err) throw err;
                    
                    data = _.map(data, JSON.parse);
                    
                    console.log('ha');
                    var ok = _.any(data, function (elem) {
                        return _.isEqual(elem, {
                            value: stream.value,
                            time: stream.time
                        });
                    });
                    
                    assert(ok, 'data not in stream');            
                    callback();
                })                
            });
            
        };
    });

    async.parallel(tests, function (err, result) {
        console.log('addStream ' + 'pass'.green)       
        callback();
    });
    
};




async.series([
    testAddChart,
    testAddStream,
    testGetSession,
    testGetSessions,
    testRemoveSession
], function (err, result) {
    
    client.quit();
    db.quit();
});
