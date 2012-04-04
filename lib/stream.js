var stream      = require('../../monitor-stream').createStream(),
    streamDB    = require('monitor-stream').createDBConnection(6379, '127.0.0.1');
    

module.exports = {
    stream: stream,
    streamDB: streamDB
};
