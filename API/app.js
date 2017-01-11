// Require dependencies
var express = require('express');
var parser = require('body-parser');
var authentication = require('./routes/route_authentication');

config = require('./config/config.json');
pool = require('./utils/mysql_pool');

// Application initialization
var app = express();

app.set('port', (process.env.PORT || 3000));

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// Parser config
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(allowCrossDomain);

// Routes configuration
app.use('/authentication', authentication);

// Server startup
app.listen(app.get('port'), function () {
    console.log('API started on port 3000.');
});