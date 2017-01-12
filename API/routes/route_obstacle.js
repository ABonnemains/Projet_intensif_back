/* Title: route_obstacle */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


/*
  Function: Create obstacle

  Crée un nouvel obstacle/alerte.
  * POST
  * URL : {{url}}/obstacle/create
  * Consumes JSON : { token, description, type, longitude, latitude, utilisateur_id }

  Parameters:

  * token:           Token de connexion fourni par la méthode login
  * description:     Description de l'obstacle
  * type:            Type d'obstacle
  * longitude:       Position longitudinale de l'obstacle
  * latitude:        Position latitudinale de l'obstacle
  * utilisateur_id:  Identifiant de l'utilisateur

  Returns:

  * 403 Forbidden    : Mauvais token ou token expiré
  * 500 Server Error : Erreur lors de l'enregistrement dans la base
  * 200 OK           : Create s'est bien passé

*/
router.post('/create', function(req, res) {
    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged)
      {
        // Initialisation des valeurs à rentrer dans la BDD
        var data = {
          obstacle_description:       req.body.description,
          obstacle_type:              req.body.type,
          obstacle_longitude:         req.body.longitude,
          obstacle_latitude:          req.body.latitude,
          utilisateur_utilisateur_id: req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO obstacle SET ?', data, function(error, result) {
          if (error) {
            return res.sendStatus(500);
          }

          return res.sendStatus(200);
        });
      }
      else {
        return res.sendStatus(403);
      }
  });
});

/*
  Function: List objects

  Liste des positions des objets à proximité de l'utilisateur.
  * GET
  * URL : {{url}}/list/:token/:latitude/:longitude
  * Consumes URL Parameters : { token, longitude, latitude }

  Parameters:

  *  token     : Token de connexion fourni par la méthode login
  *  latitude  : Position latitudinale de l'utilisateur
  *  longitude : Position longitudinale de l'utilisateur

  Returns:

  *  403 Forbidden     : Mauvais token ou token expiré
  *  500 Server Error  : Erreur lors de l'enregistrement dans la base
  *  200 OK            : Get s'est bien passé
  *  JSON Array [Objects]:
      object_id                 - Identifiant de l'obstacle
      object_description        - Description de l'obstacle
      object_type               - Type d'obstacle
      object_longitude          - Position longitudinale de l'obstacle
      object_latitude           - Position latitudinale de l'obstacle
      user_id                   - Identifiant de l'utilisateur
*/
router.get('/list/:token/:latitude/:longitude', function(req, res) {
    loginUtils.checkConnection(req.params.token).then(function(logged) {
        if (logged) {
            var minLat = parseFloat(req.params.latitude) - 0.05;
            var maxLat = parseFloat(req.params.latitude) + 0.05;
            var minLg  = parseFloat(req.params.longitude) - 0.05;
            var maxLg  = parseFloat(req.params.longitude) + 0.05;

            var selectQuery = "SELECT * FROM obstacle WHERE (obstacle_longitude BETWEEN ? AND ?) AND (obstacle_latitude BETWEEN ? AND ?)";
            var events = [];

            pool.query(selectQuery, [minLg, maxLg, minLat, maxLat], function(err, rows) {
                if (err) return res.sendStatus(500);

                for (var i = 0; i < rows.length; i++) {
                    var data = {
                        object_id: rows[i].obstacle_id,
                        object_description: rows[i].obstacle_description,
                        object_type: rows[i].obstacle_type,
                        object_longitude: rows[i].obstacle_longitude,
                        object_latitude: rows[i].obstacle_latitude,
                        user_id: rows[i].utilisateur_utilisateur_id
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
