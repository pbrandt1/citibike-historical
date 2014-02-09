var Datamgr = require('../datamgr.js');

var constring = 'postgres://postgres:suchdoge@localhost/citibike';

var mgr = new Datamgr(constring);
describe('.query without params', function() {
	describe('select * from test_tbl', function () {
		it('shuold return two rows', function (done) {
			mgr.query('select * from test_tbl;')
				.then(function (data) {
					data.rows.length.should.equal(2);
					done();
				}).fail(function (err) {
					console.log(err);
					throw err;
				});
		});
	});
	describe('select * from asfsdflsdf', function () {
		it('should reject the promise', function (done) {
			mgr.query('select * from sdfldsfkl')
				.then(function (data) {
					console.log('should not return this data', data);
					throw new Error('BAD BAD ERROR.  BAD ERR. BAD.');
				}).fail(function (err) {
					err.should.be.ok;
					done();
				});
		});
	});
});
describe('.query with params', function() {
	describe('select name from test_tbl where id = $1, with 1', function() {
		it('should return peter', function(done) {
			mgr.query('select name from test_tbl where id = $1', [1])
				.then(function(data) {
					data.rows[0].name.should.equal('peter');
					done();
				});
		});
	});
});
