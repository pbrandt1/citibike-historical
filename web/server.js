/**
 * Production-only node server
 * @type {exports}
 */

var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.use(express.compress());
app.set('port', process.env.PORT || 9090);

// API
require('./crAPI/crAPI')(app);

//  Static files (move to nginx)
app.use(static({ directory: 'dist' }));
app.use(static({ file: 'dist/index.html', ignoredFileExtensions: /\.\w{1,5}$/ })); // Gotta catch 'em all

function static(options) {
	return function(req, res, next) { // Gotta catch 'em all (and serve index.html)
		debugger;
		var filePath = "";
		if (options.directory) {
			var regex = new RegExp('^' + (options.urlRoot || ''));
			// URL must begin with urlRoot's value
			if (!req.path.match(regex)) { next(); return; }
			filePath = options.directory + req.path.replace(regex, '');
		} else if (options.file) {
			filePath = options.file;
		} else { throw new Error('static() isn\'t properly configured!'); }

		fs.stat(filePath, function(err, stats) {
			if (err) { next(); return; } // Not a file, not a folder => can't handle it

			if (options.ignoredFileExtensions) {
				if (options.ignoredFileExtensions.test(req.path)) {
					res.send(404, {error: 'Resource not found'});
					return; // Do not serve index.html
				}
			}

			// Is it a directory? If so, search for an index.html in it.
			if (stats.isDirectory()) { filePath = path.join(filePath, 'index.html'); }

			// Serve the file
			res.sendfile(filePath, function(err) {
				if (err) { next(); return; }
				console.log('Served: ' + filePath);
			});
		});
	};
}

app.listen(app.get('port'), function(){
	console.log('listening on port', app.get('port'));
});
