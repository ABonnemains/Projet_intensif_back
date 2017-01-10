var mysql = require('mysql');

var pool = mysql.createPool(config.mysql_config);

module.exports = pool;