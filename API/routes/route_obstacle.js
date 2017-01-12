/* Title: route_obstacle */
// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

// Routes configurations
var router = express.Router();


/*
  Function: Create obstacle

  Crée un nouvel obstacle/alerte.
  * POST
  * URL : {{url}}/obstacle/create
  * Consumes JSON : { token, description, type, longitude, latitude, utilisateur_id }

  Parameters:

  * token:           Token de connexion fourni par la méthode login
  * description:     Description de l'obstacle
  * type:            Type d'obstacle
  * longitude:       Position longitudinale de l'obstacle
  * latitude:        Position latitudinale de l'obstacle
  * utilisateur_id:  Identifiant de l'utilisateur

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
          obstacle_description:       req.body.description,
          obstacle_type:              req.body.type,
          obstacle_longitude:         req.body.longitude,
          obstacle_latitude:          req.body.latitude,
          utilisateur_utilisateur_id: req.body.utilisateur_id
        };

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('INSERT INTO obstacle SET ?', data, function(error, result) {
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
