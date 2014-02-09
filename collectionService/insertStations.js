/**
 * This file clears out station_tbl and inserts new values.
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
// insert the data
gotData
.then(function(body) {
		var promises = [];
		var fields = 'stationId stationName totalDocks latitude longitude stAddress1 stAddress2 city postalCode location altitude testStation landMark'.split(' ');
		var sql = 'insert into Station_tbl ($FieldNames) select $FieldIndexes where not exists (select 1 from Station_tbl where stationId = $stationId)'
			.replace('$FieldNames', fields.join(', '))
			.replace('$FieldIndexes', _.map(fields, function(o, i) {
				return '$' + (i + 1);
			}).join(', '))
			.replace('$stationId', '$' + (fields.length + 1));

		// do some data massaging
		_.forEach(body.stationBeanList, function(o,i) {
			o.stationId = o.id;
			o.altitude = o.altitude || 0;
		});

		for (var i = 0, length = body.stationBeanList.length; i < length; i++) {
			var data = _.map(fields, function(o) {
				return body.stationBeanList[i][o];
			});
			data.push(body.stationBeanList[i].stationId);
			var p = mgr.query(sql, data)
				.fail(function(err) {
					console.log(err);
				});
			promises.push(p);
		}

		return q.all(p);
	})
.then(function() {
		process.exit(0);
	})
.fail(function(err) {
		console.log(err);
		process.exit(1);
	});