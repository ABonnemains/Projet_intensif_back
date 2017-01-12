/* Title: route_mark_accessibility */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();

/*
  Function: Create accessibility note

  Création d'une note d'accessibilité du trajet.
  * POST
  * URL : {{url}}/mark_accessibility/create
  * Consumes JSON : { trajet_note, trajet_id, utilisateur_id }

  Parameters:

  *  token          : Token de connexion fourni par la méthode login
  *  trajet_note    : Note du trajet
  *  trajet_id      : Identifiant du trajet
  *  utilisateur_id : Identifiant de l'utilisateur

  Returns:

  *  403 Forbidden         : Mauvais token ou token expiré
  *  500 Server Error      : Erreur lors de l'enregistrement dans la base
  *  200 OK                : Create s'est bien passé

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
            return res.sendStatus(500);
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
