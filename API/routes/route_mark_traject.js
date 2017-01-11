// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/*

   Function: Create mark traject

   Permet à un utilisateur de noter un trajet.
   * POST
   * URL : {{url}}/mark_traject/create
   * Consumes JSON : { token, note_trajet_note, trajet_trajet_id, utilisateur_id }

   Parameters:

      * token            : Token de connexion fourni par la méthode login
      * note_trajet_note : Longitude du point de départ
      * trajet_trajet_id : Latitude du point de départ
      * utilisateur_id   : Identifiant de l'utilisateur

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
          note_trajet_note:           req.body.note_trajet_note,
          trajet_trajet_id:           req.body.trajet_trajet_id,
          utilisateur_utilisateur_id: req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO note_trajet SET ?', data, function(error, result) {
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
