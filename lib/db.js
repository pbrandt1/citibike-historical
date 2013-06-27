var mongo = require('mongodb');
var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongo.Db('citibike', server);

db.open(function(err, db) {
	if (!err) {
		db.collection('stations', {strict:true}, function(err, collection) {
			if (err) {
				//setupDB();
			}
		});
	}
});

exports.findAll = function(req, res) {
	db.collection('stations', function(err, collection) {
		collection.find().toArray(function(err, stations) {
			res.send(stations);
		});
	});
}
/*
var setup = function() 

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
*/
