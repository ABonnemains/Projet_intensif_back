/* Title: route_event */
// Dependencies requirements
var express = require('express');

// Routes configurations
var router = express.Router();

/*
  Function: Create event

  Creation d'un évènement.
  * POST
  * URL : {{url}}/event/create
  * Consumes JSON : { token, event_name, event_longitude, event_latitude,
                      event_timestamp, event_description }

  Parameters:

  *  token             : Token de connexion fourni par la méthode login
  *  event_name        : Nom du nouvel évènement
  *  event_longitude   : Longitude de l'évènement
  *  event_latitude    : Latitude de l'évènement
  *  event_timestamp   : Date et heure de l'évènement
  *  event_description : Description de l'évènement

  Returns:

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
                    return res.sendStatus(500);
                }

                return res.sendStatus(200);
            });
        }
        else {
            return res.sendStatus(403);
        }
    })
});

/*
  Function: List events

  Liste des évènements à proximité de la position de l'utilisateur.
  * GET
  * URL : {{url}}/list/:token/:latitude/:longitude
  * Consumes URL Parameters : { token, longitude, latitude }

  Parameters:

  *  token     : Token de connexion fourni par la méthode login
  *  latitude  : Latitude de la position de l'utilisateur
  *  longitude : Longitude de la position de l'utilisateur

  Returns:

  *  403 Forbidden     : Mauvais token ou token expiré
  *  500 Server Error  : Erreur lors de l'enregistrement dans la base
  *  200 OK            : Get s'est bien passé

*/
router.get('/list/:token/:latitude/:longitude', function(req, res) {
    loginUtils.checkConnection(req.params.token).then(function(logged) {
        if (logged) {
            var minLat = parseFloat(req.params.latitude) - 0.05;
            var maxLat = parseFloat(req.params.latitude) + 0.05;
            var minLg  = parseFloat(req.params.longitude) - 0.05;
            var maxLg  = parseFloat(req.params.longitude) + 0.05;

            var selectQuery = "SELECT * FROM evenement WHERE (evenement_longitude BETWEEN ? AND ?) AND (evenement_latitude BETWEEN ? AND ?)";
            var events = [];

            pool.query(selectQuery, [minLg, maxLg, minLat, maxLat], function(err, rows) {
                if (err) return res.sendStatus(500);

                for (var i = 0; i < rows.length; i++) {
                    var data = {
                        event_name: rows[i].evenement_nom,
                        event_longitude: rows[i].evenement_longitude,
                        event_latitude: rows[i].evenement_latitude,
                        event_timestamp: new Date(rows[i].evenement_dateheure).getTime(),
                        event_description: rows[i].evenement_description
                    };

                    events.push(data);
                }

                return res.status(200).json(events);
            });
        }
        else {
            return res.sendStatus(403);
        }
    });
});

// Export for public usage
module.exports = router;
