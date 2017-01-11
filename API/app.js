config = require('./config/config.json');
pool = require('./utils/mysql_pool');
loginUtils = require('./utils/login_utils.js');

// Require dependencies
var express = require('express');
var parser = require('body-parser');
var authentication = require('./routes/route_authentication');
var traject = require('./routes/route_traject');
var assist = require('./routes/route_assist');
var event = require('./routes/route_event');

// Application initialization
var app = express();

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
app.use('/traject', traject);
app.use('/assist', assist);
app.use('/event', event);

// Server startup
app.listen(3000, function () {
    console.log('API started on port 3000.');
});
