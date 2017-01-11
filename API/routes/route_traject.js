// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/* POST Register new user
 * Consumes JSON : { trajet_longitude_depart, trajet_latitude_depart, trajet_longitude_arrivee, trajet_latitude_arrivee,
 *                   trajet_public, utilisateur_id }
 *  trajet_longitude_depart  : Longitude du point de départ
 *  trajet_latitude_depart   : Latitude du point de départ
 *  trajet_longitude_arrivee : Longitude du point d'arrivée
 *  trajet_latitude_arrivee  : Latitude du point d'arrivée
 *  trajet_public            : Trajet public ou privé
 *  utilisateur_id           : Identifiant de l'utilisateur
 * Returns:
 *  400 Bad Request       : password et password_confirmation différents
 *  500 Server Error      : Erreur lors de l'enregistrement dans la base
 *  200 OK                : Register s'est bien passé
 */
router.post('/create', function(req, res) {
    loginUtils.checkConnection(req.body.token).then(fonction(logged)){
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
            res.sendStatus(500);
          }

          res.sendStatus(200);
        });
      }
      else {
        res.sendStatus(403);
      }
  });
});

// Export for public usage
module.exports = router;
