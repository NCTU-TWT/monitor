var stream      = require('monitor-stream').createStream(),
    streamDB    = require('monitor-stream').createDBConnection();
    
    
module.exports = {
    stream: stream,
    streamDB: streamDB
};
