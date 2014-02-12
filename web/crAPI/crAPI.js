/**
 * Express middleware crAPI, the crappy api!
 */

/**
 * Route hash
 * @type {{}}
 */
var router = {
	'prefix': '',
	'get': function(url, fn) {
		this['GET' + this.prefix + url] = fn;
	},
	'post': function(url, fn) {
		this['POST' + this.prefix + url] = fn;
	},
	'put': function(url, fn) {
		this['PUT' + this.prefix + url] = fn;
	}
};

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

router.get('/stations', function(req, res) {
	mgr.queryJSON('select * from station_tbl')
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

module.exports = function(req, res, next) {
	if (!!router[req.method + req.path]) {
		router[req.method + req.path](req, res, next);
	} else {
		next();
	}
};
