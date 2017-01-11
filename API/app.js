config = require('./config/config.json');
pool = require('./utils/mysql_pool');
loginUtils = require('./utils/login_utils.js');

// Require dependencies
var express = require('express');
var parser = require('body-parser');
var authentication = require('./routes/route_authentication');
var traject = require('./routes/route_traject');
var assist = require('./routes/route_assist');
var evenmt = require('./routes/route_event');
var mark_accessibility = require('./routes/route_mark_accessibility');

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
app.use('/traject', traject);
app.use('/assist', assist);
app.use('/event', evenmt);
app.use('/mark_accessibility', mark_accessibility);

// Server startup
app.listen(app.get('port'), function () {
    console.log('API started on port 3000.');
});
