/* Title: route_mark_object */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


/*
  Function: Create mark object

  Permet à un utilisateur de noter un obstacle/alerte.
  * POST
  * URL : {{url}}/mark_object/create
  * Consumes JSON : { token, obstacle_note, obstacle_id, utilisateur_id }

  Parameters:

  * token          : Token de connexion fourni par la méthode login
  * obstacle_note  : Notation de l'obstacle
  * obstacle_id    : Identifiant de l'obstacle
  * utilisateur_id : Identifiant de l'utilisateur

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
          note_obstacle_note:         req.body.obstacle_note,
          obstacle_obstacle_id:       req.body.obstacle_id,
          utilisateur_utilisateur_id: req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO note_obstacle SET ?', data, function(error, result) {
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
