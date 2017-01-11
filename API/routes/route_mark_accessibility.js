// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/* POST Register new user
 * Consumes JSON : { trajet_note, trajet_id, utilisateur_id }
 *  trajet_note    : Note du trajet
 *  trajet_id      : Identifiant du trajet
 *  utilisateur_id : Identifiant de l'utilisateur
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
          note_accessibilite_note:            req.body.trajet_note,
          trajet_trajet_id:                   req.body.trajet_id,
          utilisateur_utilisateur_id:         req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO note_accessibilite SET ?', data, function(error, result) {
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
