var mongodb = require('mongodb');

var server = new mongodb.Server('61.222.87.71', 27017);

var db = new mongodb.Db('monitor', server);

db.open(function (err, client) {
    if (err) throw err;





    db.collection('charts', function (err, collection) {
    
        collection.find().each(function (err, object) {
            console.log(object);
        });


    });
    










});





module.exports = {
    getCharts: function () {
        return {};
    }
};
