/* Title: route_authentication */
// Dependencies requirements
var express = require('express');
var bcrypt = require('bcrypt');
var mysql = require('mysql');
var crypto = require('crypto');

// Routes configurations
var router = express.Router();


/*
  Function: Register new user

  Creation d'une demande d'assistance.
  * POST
  * URL : {{url}}/authentication/register
  * Consumes JSON : { login, password, password_confirmation, user_name,
                      user_surname, user_phone, user_birthdate }

  Parameters:

  *  login                 : Pseudo du nouvel utilisateur
  *  password              : Mot de passe du nouvel utilisateur
  *  password_confirmation : Confirmation du mot de passe du nouvel utilisateur
  *  user_name             : Nom de l'utilisateur
  *  user_surname          : Prénom de l'utilisateur
  *  user_phone            : Numéro de téléphone de l'utilisateur
  *  user_birthdate        : Date de naissance de l'utilisateur

  Returns:

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

/*
  Function: Login user

  Connexion de l'utilisateur.
  * POST
  * URL : {{url}}/authentication/login
  * Consumes JSON : { login, password }

  Parameters:

  *  login                 : Pseudo du nouvel utilisateur
  *  password              : Mot de passe du nouvel utilisateur

  Returns:

  *  404 Not Found         : le login de l'utilisateur n'existe pas en base
  *  500 Server Error      : Erreur lors de l'enregistrement dans la base
  *  200 OK                : Login s'est bien passé

*/
router.post('/login', function(req, res) {
  // requêtes SQL
  var selectQuery = 'SELECT count(utilisateur_id) as count, utilisateur_mot_de_passe as mdp FROM utilisateur WHERE utilisateur_pseudo = ?';
  var updateQuery = 'UPDATE utilisateur SET utilisateur_token = ?, utilisateur_date_derniere_connexion = ? WHERE utilisateur_pseudo = ?';

  // Vérification de la présence du login en base
  pool.query(selectQuery, req.body.login, function(error, rows) {
    if (error) res.sendStatus(500);

    if (rows[0].count === 0){
      res.sendStatus(404);
    }
    else {
      // Vérification du mot de passe
      bcrypt.compare(req.body.password, rows[0].mdp, function(err, rightPass) {
        if (err) res.sendStatus(500);
        console.log(rightPass);

        if (rightPass) {
          // Création d'un token de connexion
          var token = crypto.randomBytes(30).toString('hex');

          // Enregistrement du token en base
          pool.query(updateQuery, [token, new Date(), req.body.login], function(err2, result) {
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

/*
  Function: Update user

  Mise à jour de l'utilisateur.
  * POST
  * URL : {{url}}/authentication/update
  * Consumes JSON : { token, password, password_confirmation, user_name,
                      user_surname, user_birthdate }

  Parameters:

  *  token                 : Token de connexion fourni par la méthode login
  *  password              : Mot de passe du nouvel utilisateur
  *  password_confirmation : Confirmation du mot de passe du nouvel utilisateur
  *  user_name             : Nom de l'utilisateur
  *  user_surname          : Prénom de l'utilisateur
  *  user_birthdate        : Date de naissance de l'utilisateur

  Returns:

  *  400 Bad Request       : password et password_confirmation différents
  *  500 Server Error      : Erreur lors de l'enregistrement dans la base
  *  200 OK                : Update s'est bien passé

*/
router.post('/update', function(req, res) {
  loginUtils.checkConnection(req.body.token).then(function(logged) {
    if (logged) {
      // Si changement de mot de passe, les deux mots de passe doivent correspondre
      if (req.body.password && req.body.password !== password_confirmation) {
        res.sendStatus(400);
      }

      // requête SQL
      var updateQuery = "UPDATE utilisateur SET ? WHERE utilisateur_token = ?";

      bcrypt.hash(req.body.password, 10, function(err, hash) {
        // Initialisation des valeurs à rentrer dans la BDD
        var data = {
          utilisateur_nom:                     req.body.user_name,
          utilisateur_prenom:                  req.body.user_surname,
          utilisateur_date_naissance:          new Date(req.body.user_birthdate),
          utilisateur_date_modification:       new Date(),
          utilisateur_date_derniere_connexion: new Date()
        };

        if (req.body.password && req.body.password !== "")
          data.utilisateur_mot_de_passe = hash;

        // On récupère une connexion du pool et on exécute un INSERT
        pool.query(updateQuery, [data, req.body.token], function(error, result) {
          if (error) {
            res.sendStatus(500);
          }

          res.sendStatus(200);
        });

      });
    }
    else {
      res.sendStatus(403);
    }
  });
});

/*
  Function: Get user profile

  Récupérer le profil de l'utilisateur.
  * GET
  * URL : {{url}}/profile/:token/:login
  * Consumes URL Parameters : { token, login }

  Parameters:

  *  token : Token de connexion fourni par la méthode login
  *  login : Pseudo de l'utilisateur à chercher'

  Returns:

  *  404 Not Found         : le profil demandé n'a pas été trouvé
  *  403 Forbidden         : le token fourni n'est pas valide
  *  500 Server Error      : Erreur lors de la lecture dans la base
  *  200 OK                : Get s'est bien passé
  *  JSON Object :
      user_name      - Nom de l'utilisateur
      user_surname   - Prénom de l'utilisateur
      user_phone     - Numéro de téléphone de l'utilisateur
      user_birthdate - Date de naissance de l'utilisateur

*/
router.get('/profile/:token/:login', function(req, res) {
  loginUtils.checkConnection(req.params.token).then(function(logged) {
    if (logged) {
      // requête SQL
      var selectQuery = "SELECT * FROM utilisateur WHERE utilisateur_pseudo = ?";

      pool.query(selectQuery, req.params.login, function(err, rows) {
        if (err) res.sendStatus(500);

        if (rows.length > 0) {
          var data = {
            user_name     : rows[0].utilisateur_nom,
            user_surname  : rows[0].utilisateur_prenom,
            user_phone    : rows[0].utilisateur_portable,
            user_birthdate: new Date(rows[0].utilisateur_date_naissance).getTime()
          }

          res.status(200).json(data);
        }
        else {
          res.sendStatus(404);
        }
      });
    }
    else {
      res.sendStatus(403);
    }
  });
});

/*
  Function: Top users

  Verification du classement de l'utilisateur.
  * GET
  * URL : {{url}}/top/:token
  * Consumes URL Parameter : { token }

  Parameters:

  *  token                 : Token de connexion fourni par la méthode login

  Returns:

  *  403 Forbidden    : le token fourni n'est pas valide
  *  500 Server Error : Erreur lors de la lecture dans la base
  *  200 OK           : Get s'est bien passé
  *  JSON Array [Utilisateur]:
      utilisateur_id             - Identifiant de l'utilisateur
      utilisateur_nom            - Nom de l'utilisateur
      utilisateur_prenom         - Prénom de l'utilisateur
      utilisateur_portable       - Numéro de téléphone de l'utilisateur
      utilisateur_date_naissance - Date de naissance de l'utilisateur
      utilisateur_score          - Score de l'utilisateur

*/
router.get('/top/:token', function(req, res) {
  loginUtils.checkConnection(req.params.token).then(function(logged) {
    if (logged) {
      // requête SQL
      var selectQuery = "SELECT * FROM utilisateur ORDER BY utilisateur_score DESC LIMIT 100";

      pool.query(selectQuery, function(err, rows) {
        if (err) res.sendStatus(500);

        var users = [];
        for (var i = 0; i < rows.length; i++) {
          var data = {
            user_id       : rows[i].utilisateur_id,
            user_name     : rows[i].utilisateur_nom,
            user_surname  : rows[i].utilisateur_prenom,
            user_phone    : rows[i].utilisateur_portable,
            user_birthdate: new Date(rows[i].utilisateur_date_naissance).getTime(),
            user_score    : rows[i].utilisateur_score
          }

          users.push(data);
        }

        if (users.length > 0) res.status(200).json(users);
        else res.sendStatus(404);
      });
    }
    else {
      res.sendStatus(403);
    }
  });
});

/*
  Function: Search user

  Recherche des utilisateurs.
  * GET
  * URL : {{url}}/search/:token/:sstring
  * Consumes URL Parameter : { token, string }

  Parameters:

  *  token                 : Token de connexion fourni par la méthode login
  *  string                : Texte contenu dans le champ de recherche

  Returns:

  *  404 Not Found         : aucun profil n'a été trouvé
  *  403 Forbidden    : le token fourni n'est pas valide
  *  500 Server Error : Erreur lors de la lecture dans la base
  *  200 OK           : Get s'est bien passé
  *  JSON Array [Utilisateur]:
      utilisateur_id             - Identifiant de l'utilisateur
      utilisateur_pseudo         - Pseudo de l'utilisateur

*/
router.get('/search/:token/:sstring', function(req, res) {
  loginUtils.checkConnection(req.params.token).then(function(logged) {
    if (logged) {
      // requête SQL
      var selectQuery = "SELECT * FROM utilisateur WHERE utilisateur_pseudo LIKE ";

      pool.query(selectQuery + "'%" + req.params.sstring + "%'" , function(err, rows) {
        if (err) res.sendStatus(500);

        var users = [];
        for (var i = 0; i < rows.length; i++) {
          var data = {
            user_id    : rows[i].utilisateur_id,
            user_login : rows[i].utilisateur_pseudo
          }

          users.push(data);
        }

        if (users.length > 0) res.status(200).json(users);
        else res.sendStatus(404);
      });
    }
    else {
      res.sendStatus(403);
    }
  });
});

// Export for public usage
module.exports = router;
