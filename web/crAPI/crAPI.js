/**
 * Express middleware crAPI, the crappy api!
 */

/**
 * Route cache
 * todo (lol)
 * @type {{}}
 */
var cache = {};

/**
 * postgresql stuff
 * @type {exports}
 */
var Datamgr = require('../../datamgr.js');
var constring = 'postgres://postgres:suchdoge@localhost/citibike';
var mgr = new Datamgr(constring);


module.exports = function(router) {
	router.get('/stations', function(req, res) {
		mgr.queryJSON('select * from station_tbl')
			.then(function(data) {
				res.send(data);
			});
	});

	router.get('/stations/:station', function(req, res) {
		console.log('gettin station ', req.params.station);
		var sql = 'select * from stationInfo_prc($id)'
			.replace('$id', req.params.station);
		mgr.queryJSON(sql)
			.then(function(data) {
				res.send(data);
			});
	});

	router.get('/bikeTotals', function(req, res) {
		mgr.queryJSON('select * from GetBikeTotalsPastThreeDays_prc();')
			.then(function(data) {
				res.send(data);
			});
	});
};
