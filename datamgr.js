/*

example usage

 var Datamgr = require('../datamgr.js');
 var constring = 'postgres://postgres:suchdoge@localhost/citibike';
 var mgr = new Datamgr(constring);

 mgr.query('select * from test_tbl;')
 .then(function (data) {
 		data.rows.length.should.equal(2);
 		...

 */

var pg = require('pg');
var q = require('q');

module.exports = function (constring) {
	constring = constring || 'postgres://postgres:suchdoge@localhost/citibike';

	var __ = this;

	this.query = function (query, params) {
		var d = q.defer();

		pg.connect(constring, function (err, client, returnToPool) {
			if (err) {
				d.reject(err);
				return;
			} else {
				client.query(query, params, function (err, result) {
					if (err) {
						d.reject(err);
						return;
					}
					d.resolve(result);
					returnToPool();
				});
			}
		});

		return d.promise;
	};

	this.queryJSON = function(query, params) {
		var d = q.defer();
		__.query(query, params)
			.then(function(data) {
				debugger;
				d.resolve(data.rows);
			}).fail(d.reject);

		return d.promise;
	};

	return this;
};
