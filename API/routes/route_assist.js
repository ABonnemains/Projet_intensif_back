/* Title: route_assist */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


 /*
  Function: Create assist

  Creation d'une demande d'assistance.
  * POST
  * URL : {{url}}/assist/create
  * Consumes JSON : { utilisateur_id_2, trajet_longitude_arrivee, trajet_latitude_arrivee,
                     trajet_public, utilisateur_id }

  Parameters:

  * token                 : Token
  * utilisateur_id_2      : Identifiant de l'utilsateur portant assistance
  * assistance_longitude  : Longitude du point d'assistance
  * assistance_latitude   : Latitude du point d'assistance
  * utilisateur_id        : Identifiant de l'utilisateur

  Returns:

  *  403 Forbidden         : Token de connexion invalide
  *  500 Server Error      : Erreur lors de l'enregistrement dans la base
  *  200 OK                : Create s'est bien passé

*/
router.post('/create', function(req, res) {
    console.log(req.body);
    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged){
          var data = {
            utilisateur_id_2:           req.body.utilisateur_id_2,
            assistance_longitude:       req.body.assistance_longitude,
            assistance_latitude:        req.body.assistance_latitude,
            utilisateur_utilisateur_id: req.body.utilisateur_id
          };

          // On récupère une connexion du pool et on exécute un INSERT
          pool.query('INSERT INTO assistance SET ?', data, function(error, result) {
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
  Function: List Assists

  Liste des demandes d'assistance à proximité de la position de l'utilisateur.
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
  *  JSON Array (Assists) :
      assist_id    - Identifiant du trajet
      assist_lat   - Latitude de l'assistance
      assist_long  - Longitude de l'assistance

*/
router.get('/list/:token/:latitude/:longitude', function(req, res) {
    loginUtils.checkConnection(req.params.token).then(function(logged) {
        if (logged) {
            var minLat = parseFloat(req.params.latitude) - 0.05;
            var maxLat = parseFloat(req.params.latitude) + 0.05;
            var minLg  = parseFloat(req.params.longitude) - 0.05;
            var maxLg  = parseFloat(req.params.longitude) + 0.05;

            var selectQuery = "SELECT * FROM assistance WHERE (assistance_longitude BETWEEN ? AND ?) AND (assistance_latitude BETWEEN ? AND ?)";
            var assists = [];

            pool.query(selectQuery, [minLg, maxLg, minLat, maxLat], function(err, rows) {
                if (err) return res.sendStatus(500);

                for (var i = 0; i < rows.length; i++) {
                    var data = {
                        assist_id: rows[i].assistance_id,
                        assist_lat: rows[i].assistance_latitude,
                        assist_long: rows[i].assistance_longitude
                    };

                    assists.push(data);
                }

                return res.status(200).json(assists);
            });
        }
        else {
            return res.sendStatus(403);
        }
    });
});

// Export for public usage
module.exports = router;
