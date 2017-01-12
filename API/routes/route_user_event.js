/* Title: route_user_event */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


/*
  Function: Subscribe to event

  Enregistre un nouvel utilisateur en base.
  * POST
  * URL : {{url}}/user_event/create
  * Consumes JSON : { token, utilisateur_id, evenement_id }

  Parameters:

  * token          : Token de connexion fourni par la méthode login
  * utilisateur_id : Identifiant de l'utilisateur
  * evenement_id   : Identifiant de l'évènement

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
          utilisateur_evenement_utilisateur_id: req.body.utilisateur_id,
          utilisateur_evenement_evenement_id:   req.body.evenement_id,
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO utilisateur_evenement SET ?', data, function(error, result) {
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

// Export for public usage
module.exports = router;
