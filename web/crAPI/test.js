var express = require('express');

var app = express();

app.use(require('./crAPI'));

app.get('/', function(req, res) {
	res.send('sup, bro');
});

app.listen(7070);