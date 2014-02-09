var pg = require('pg');
var q = require('q');

module.exports = function (constring) {
	constring = constring || 'postgres://postgres:suchdoge@localhost/citibike';

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
	}

	return this;
};
