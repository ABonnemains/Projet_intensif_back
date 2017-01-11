// Dependencies requirements
var mysql = require('mysql');

var LoginUtils = {
    checkConnection: function(token) {
        return new Promise((resolve, reject) => {
            // requêtes SQL
            var selectQuery = 'SELECT count(*) as found FROM utilisateur WHERE utilisateur_token = ?';

            // Query and return value
            pool.query(selectQuery, token, function(error, rows) {
                if (error) reject(error);
                
                if (rows[0].found === 0) resolve(false);
                else resolve(true);
            });
        });
    }
}

module.exports = LoginUtils;