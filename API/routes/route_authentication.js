// Dependencies requirements
var express = require('express');
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var crypto = require('crypto');

var router = express.Router();

// Routes configurations

/* POST Register new user
 * Consumes JSON : { login, password, password_confirmation, user_name, 
 *                   user_surname, user_phone, user_birthdate }
 *  login                 : Pseudo du nouvel utilisateur
 *  password              : Mot de passe du nouvel utilisateur
 *  password_confirmation : Confirmation du mot de passe du nouvel utilisateur
 *  user_name             : Nom de l'utilisateur
 *  user_surname          : Prénom de l'utilisateur
 *  user_phone            : Numéro de téléphone de l'utilisateur
 *  user_birthdate        : Date de naissance de l'utilisateur
 * Returns:
 *  400 Bad Request       : password et password_confirmation différents
 *  500 Server Error      : Erreur lors de l'enregistrement dans la base
 *  200 OK                : Register s'est bien passé
 */
router.post('/register', function(req, res) {
  // Si le mot de passe et la confirmation sont différentes, c'est une 400 Bad Request
  if (req.body.password !== req.body.password_confirmation)
    res.sendStatus(400);
  
  // Chiffrage du mot de passe
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    // Initialisation des valeurs à rentrer dans la BDD
    var data = {
      utilisateur_nom:                     req.body.user_name,
      utilisateur_prenom:                  req.body.user_surname,
      utilisateur_portable:                req.body.user_phone,
      utilisateur_date_naissance:          new Date(req.body.user_birthdate),
      utilisateur_pseudo:                  req.body.login,
      utilisateur_date_creation:           new Date(),
      utilisateur_date_modification:       new Date(),
      utilisateur_date_derniere_connexion: new Date(),
      utilisateur_token:                   '000',
      utilisateur_mot_de_passe:            hash
    };

    // On récupère une connexion du pool et on exécute un INSERT
    pool.query('INSERT INTO utilisateur SET ?', data, function(error, result) {
      if (error) {
        res.sendStatus(500); 
      }

      res.sendStatus(200);
    });

  });
});

router.post('/login', function(req, res) {
  var selectQuery = 'SELECT count(utilisateur_id) as count, utilisateur_mot_de_passe as mdp FROM utilisateur WHERE utilisateur_pseudo = ?';
  var updateQuery = 'UPDATE utilisateur SET utilisateur_token = ? WHERE utilisateur_pseudo = ?';

  pool.query(selectQuery, req.body.login, function(error, rows) {
    if (error) res.sendStatus(500);
    
    if (rows[0].count === 0){ 
      res.sendStatus(404);
    }
    else {
      bcrypt.compare(req.body.password, rows[0].mdp, function(err, rightPass) {
        if (err) res.sendStatus(500);
        console.log(rightPass);

        if (rightPass) {
          var token = crypto.randomBytes(48).toString('base64');

          pool.query(updateQuery, [token, req.body.login], function(err2, result) {
            if (err2) res.sendStatus(500);

            res.status(200).json({token: token});
          });
        }
        else {
          res.sendStatus(401);
        }
      });
    }
  });
  
});

// Export for public usage
module.exports = router;
