var express = require('express');
var db = require('./db.js');
var app = express();
app.configure(function() {
	app.use(express.logger('short'));
	app.use(express.bodyParser());
});

app.get('/json', db.findAll);

app.listen(3030);
