// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/* POST Register new user
 * Consumes JSON : { utilisateur_id, evenement_id }
 *  utilisateur_id           : Identifiant de l'utilisateur
 *  evenement_id             : Identifiant de l'évènement
 * Returns:
 *  400 Bad Request       : password et password_confirmation différents
 *  500 Server Error      : Erreur lors de l'enregistrement dans la base
 *  200 OK                : Create s'est bien passé
 */
router.post('/create', function(req, res) {
    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged)
      {
        // Initialisation des valeurs à rentrer dans la BDD
        var data = {
          utilisateur_evenement_utilisateur_id: req.body.utilisateur_id,
          utilisateur_evenement_evenement_id:   req.body.evenement_id,
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO utilisateur_evenement SET ?', data, function(error, result) {
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