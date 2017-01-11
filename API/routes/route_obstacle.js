// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/* POST Register new user
 * Consumes JSON : { description, type, longitude, latitude,
 *                   utilisateur_id }
 * description:     Description de l'obstacle,
 * type:            Type d'obstacle,
 * longitude:       Position longitudinale de l'obstacle,
 * latitude:        Position latitudinale de l'obstacle,
 * utilisateur_id:  Identifiant de l'utilisateur:
 * Returns:
 *  400 Bad Request       : password et password_confirmation différents
 *  500 Server Error      : Erreur lors de l'enregistrement dans la base
 *  200 OK                : Register s'est bien passé
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
