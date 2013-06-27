var request = require('request');
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/citibike", function(err, db) {
	setInterval(function() {
	request('http://www.citibikenyc.com/stations/json', function(err, res, body) {
		if (!err && res.statusCode == 200) {
			collection = db.collection('stations');
			data = JSON.parse(body);
			data.stationBeanList.forEach(function(s) {
				if (collection.find({id:s.id})) {
					collection.update({id:s.id}, {$push:{
						"history":
						{
							"time": data.executionTime,
							"availableBikes": s.availableBikes,
							"availableDocks": s.availableDocks
						}}}, function(err, result) {});
					collection.update({id:s.id}, {$set:{
						"availableBikes": s.availableBikes,
						"availableDocks": s.availableDocks
					}}, function(err, result) {});
				}
				else {
					collection.insert(s, function(err, result) {});
				}

			});
//			console.log(data);
			console.log(data.executionTime);
		}
	});
	}, 300000);
});
