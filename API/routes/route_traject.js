/* Title: route_traject */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


/*
  Function: Create traject

  Crée un nouveau trajet.
  * POST
  * URL : {{url}}/traject/create
  * Consumes JSON : { token, trajet_longitude_depart, trajet_latitude_depart, trajet_longitude_arrivee,
                      trajet_latitude_arrivee, trajet_public, utilisateur_id }

  Parameters:

    * token                    : Token de connexion fourni par la méthode login
    * trajet_longitude_depart  : Longitude du point de départ
    * trajet_latitude_depart   : Latitude du point de départ
    * trajet_longitude_arrivee : Longitude du point d'arrivée
    * trajet_latitude_arrivee  : Latitude du point d'arrivée
    * trajet_public            : Trajet public ou privé
    * utilisateur_id           : Identifiant de l'utilisateur

  Returns:

  * 403 Forbidden    : Mauvais token ou token expiré
  * 500 Server Error : Erreur lors de l'enregistrement dans la base
  * 200 OK           : Create s'est bien passé

*/
router.post('/create', function(req, res) {
    console.log(req.body);

    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged)
      {
        // Initialisation des valeurs à rentrer dans la BDD
        var data = {
          trajet_longitude_depart:            req.body.trajet_longitude_depart,
          trajet_latitude_depart:             req.body.trajet_latitude_depart,
          trajet_longitude_arrivee:           req.body.trajet_longitude_arrivee,
          trajet_latitude_arrivee:            req.body.trajet_latitude_arrivee,
          trajet_public:                      req.body.trajet_public,
          utilisateur_utilisateur_id:         req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO trajet SET ?', data, function(error, result) {
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
  Function: Update traject

  Permet de mettre à jour le statut publique d'un trajet.
  * POST
  * URL : {{url}}/traject/update
  * Consumes JSON : { trajet_id, trajet_public, utilisateur_id }

  Parameters:

  * token         : Token de connexion fourni par la méthode login
  * trajet_id     : Identifiant du trajet
  * trajet_public : Trajet public ou privé

  Returns:

  * 403 Forbidden    : Mauvais token ou token expiré
  * 500 Server Error : Erreur lors de l'enregistrement dans la base
  * 200 OK           : Create s'est bien passé

*/
router.post('/update', function(req, res) {
    console.log(req.body);
    
    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged)
      {
        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('UPDATE trajet SET trajet_public=? WHERE trajet_id=?', [req.body.trajet_public, req.body.trajet_id], function(error, result) {
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
  Function: List trajects

  Liste des trajets à proximité de la position de l'utilisateur.
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
  *  JSON Array (Trajects) :
      traject_id          - Identifiant du trajet
      traject_start_lat   - Latitude du point de départ
      traject_start_long  - Longitude du point de départ
      traject_finish_lat  - Latitude du point d'arrivée
      traject_finish_long - Longitude du point d'arrivée

*/
router.get('/list/:token/:latitude/:longitude', function(req, res) {
    loginUtils.checkConnection(req.params.token).then(function(logged) {
        if (logged) {
            var minLat = parseFloat(req.params.latitude) - 0.05;
            var maxLat = parseFloat(req.params.latitude) + 0.05;
            var minLg  = parseFloat(req.params.longitude) - 0.05;
            var maxLg  = parseFloat(req.params.longitude) + 0.05;

            var intricateQuery = "SELECT utilisateur_id FROM utilisateur WHERE utilisateur_token = '" + req.params.token + "'";
            var selectQuery = "SELECT * FROM trajet WHERE (trajet_longitude_depart BETWEEN ? AND ?) AND (trajet_latitude_depart BETWEEN ? AND ?) AND (utilisateur_utilisateur_id IN (" + intricateQuery + ") OR trajet_public=1)";
            var trajects = [];

            pool.query(selectQuery, [minLg, maxLg, minLat, maxLat], function(err, rows) {
                if (err) return res.sendStatus(500);

                for (var i = 0; i < rows.length; i++) {
                    var data = {
                        traject_id: rows[i].trajet_id,
                        traject_start_lat: rows[i].trajet_latitude_depart,
                        traject_start_long: rows[i].trajet_longitude_depart,
                        traject_finish_lat: rows[i].trajet_latitude_arrivee,
                        traject_finish_long: rows[i].trajet_longitude_arrivee
                    };

                    trajects.push(data);
                }

                return res.status(200).json(trajects);
            });
        }
        else {
            return res.sendStatus(403);
        }
    });
});

// Export for public usage
module.exports = router;
