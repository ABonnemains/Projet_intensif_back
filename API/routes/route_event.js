// Dependencies requirements
var express = require('express');

var router = express.Router();

router.post('/create', function(req, res) {
    loginUtils.checkConnection(req.body.token).then(function(logged) {
        if (logged) {
            var data = {
                evenement_nom: req.body.event_name,
                evenement_longitude: req.body.event_longitude,
                evenement_latitude: req.body.event_latitude,
                evenement_dateheure: new Date(req.body.event_timestamp),
                evenement_description: req.body.event_description
            };

            // On récupère une connexion du pool et on exécute un INSERT
            pool.query('INSERT INTO evenement SET ?', data, function(error, result) {
                if (error) {
                    res.sendStatus(500); 
                }

                res.sendStatus(200);
            });
        }
        else {
            res.sendStatus(403);
        }
    })
});

// Export for public usage
module.exports = router;