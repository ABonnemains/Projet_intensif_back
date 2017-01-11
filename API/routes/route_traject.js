// Dependencies requirements
var express = require('express');
var mysql = require('mysql');

var router = express.Router();

// Routes configurations

/*
   Function: Create traject

   Crée un nouveau trajet.
   * POST
   * Consumes JSON : { token, trajet_longitude_depart, trajet_latitude_depart, trajet_longitude_arrivee, 
                       trajet_latitude_arrivee, trajet_public, utilisateur_id }

   Parameters:

      * token                    : Token de connexion fourni par la méthode login
      * trajet_longitude_depart  : Longitude du point de départ
      * trajet_latitude_depart   : Latitude du point de départ
      * trajet_longitude_arrivee : Longitude du point d'arrivée
      * trajet_latitude_arrivee  : Latitude du point d'arrivée
      * trajet_public            : Trajet public ou privé
      * utilisateur_id           : Identifiant de l'utilisateur

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

/*
   Function: Update traject

   Permet de mettre à jour le statut publique d'un trajet.
   * POST
   * Consumes JSON : { trajet_id, trajet_public, utilisateur_id }

   Parameters:

      * token         : Token de connexion fourni par la méthode login
      * trajet_id     : Identifiant du trajet
      * trajet_public : Trajet public ou privé

   Returns:

      * 403 Forbidden    : Mauvais token ou token expiré
      * 500 Server Error : Erreur lors de l'enregistrement dans la base
      * 200 OK           : Create s'est bien passé

*/
router.post('/update', function(req, res) {
    loginUtils.checkConnection(req.body.token).then(function(logged){
      if(logged)
      {
        // On récupère une connexion du pool et on exécute un INSERT
        pool.query('UPDATE trajet SET trajet_public=? WHERE trajet_id=?', [req.body.trajet_public, req.body.trajet_id], function(error, result) {
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
