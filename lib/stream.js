var stream      = require('../../stream').createStream(),
    streamDB    = require('stream').createDBConnection(6379, '127.0.0.1');
    

module.exports = {
    stream: stream,
    streamDB: streamDB
};
