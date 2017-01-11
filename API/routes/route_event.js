// Dependencies requirements
var express = require('express');

var router = express.Router();

/* POST Create new event
 * Consumes JSON : { token, event_name, event_longitude, event_latitude, 
 *                   event_timestamp, event_description }
 *  token             : Token de connexion fourni par la méthode login
 *  event_name        : Nom du nouvel évènement
 *  event_longitude   : Longitude de l'évènement
 *  event_latitude    : Latitude de l'évènement
 *  event_timestamp   : Date et heure de l'évènement
 *  event_description : Description de l'évènement
 * Returns:
 *  403 Forbidden     : Mauvais token ou token expiré
 *  500 Server Error  : Erreur lors de l'enregistrement dans la base
 *  200 OK            : Create s'est bien passé
 */
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