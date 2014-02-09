/**
 * This file inserts all the bike data at this timestamp
 * @type {*}
 */
var mgr = new require('../datamgr')();
var http = require('http');
var q = require('q');
var _ = require('lodash');

var gotData = (function(){
	var d = q.defer();

	http.get('http://www.citibikenyc.com/stations/json', function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});

		res.on('end', function() {
			d.resolve(JSON.parse(body));
		});
	}).on('error', function(err) {
			console.error('very bad error.', err);
			d.reject(err);
		});

	return d.promise;
})();

gotData
	.then(function(body) {
		var sql = 'insert into Timestamp_tbl (executionTime) values (\'$t\') returning executionTimeId'
			.replace('$t', body.executionTime);
		return mgr.query(sql)
			.then(function(executionTimeIdResponse) {
				var executionTimeId = executionTimeIdResponse.rows[0].executiontimeid;
				var promises = [];
				var sql = 'insert into Bike_tbl (stationId, executionTimeId, availableDocks, availableBikes) values ($1, $2, $3, $4)';
				_.forEach(body.stationBeanList, function(o) {
					promises.push(mgr.query(sql, [o.id, executionTimeId, o.availableDocks, o.availableBikes]))
				});
				return q.all(promises);
			});
	})
	.then(function(res) {
		console.log('stored ' + res.length + ' entries');
		process.exit(0);
	})
	.fail(function(err) {
		console.log(err);
		process.exit(1);
	});
