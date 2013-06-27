var request = require('request');
var mongo = require('mongodb');
mongo.MongoClient.connect("mongodb://localhost:27017/citibike", function(err, db) {
	db.createCollection('stations', function(err, collection) {
		request('http://www.citibikenyc.com/stations/json', function(err, res, body) {
    if (!err && res.statusCode == 200) {
 			data = JSON.parse(body);
 			data.stationBeanList.forEach(function(s) {
 				s.history = [{"time":data.executionTime, "availableDocks": s.availableDocks, "availableBikes": s.availableBikes }];
 				collection.insert(s, function(err, result) { } );
 			});
 		}
		});
	});
});
