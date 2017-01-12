
## Back-End du projet Roule ma poule
![Logo](Logo.png)

## API Documentation
**POST /authentication/register**
----
Enregistrer un nouvel utilisateur.

* **URL**  
  `/authentication/register`

* **Method:**  
  `POST`

*  **URL Params**  
  `login`    : Pseudo du nouvel utilisateur  
  `password` : Mot de passe du nouvel utilisateur   
  `password_confirmation` : Confirmation du mot de passe du nouvel utilisateur  
  `user_name`     : Nom de l'utilisateur  
  `user_surname`  : Prénom de l'utilisateur  
  `user_phone`    : Numéro de téléphone de l'utilisateur  
  `user_birthdate`: Date de naissance de l'utilisateur


* **Success Response:**
  * **Code:** 200 <br />
    **Content:** ` Register s'est bien passé `


* **Error Response:**
  * **Code:** 400 <br />
    **Content:** `{ Bad Request       : password et password_confirmation différents }`
  * **Code:** 500 <br />
    **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`


**POST /authentication/login**
----
Connecter un utilisateur.

  * **URL**  
    `/authentication/login`

  * **Method:**  
    `POST`

  *  **URL Params**  
    `login`    : Pseudo de l'utilisateur  
    `password` : Mot de passe de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `


  * **Error Response:**
    * **Code:** 404 <br />
      **Content:** `{ Not Found       : le login de l'utilisateur n'existe pas en base }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }`


**POST /authentication/Update**
----
Mise à jour de l'utilisateur.

  * **URL**  
    `/authentication/Update`

  * **Method:**  
    `POST`

  *  **URL Params**  
  `token`                 : Token de connexion fourni par la méthode login  
  `password`              : Mot de passe du nouvel utilisateur  
  `password_confirmation` : Confirmation du mot de passe du nouvel utilisateur  
  `user_name`             : Nom de l'utilisateur  
  `user_surname`          : Prénom de l'utilisateur  
  `user_birthdate`        : Date de naissance de l'utilisateur  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `


  * **Error Response:**
    * **Code:** 400 <br />
      **Content:** `{ Bad Request       : password et password_confirmation différents }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }`


**GET /profile/:token/:login**
----
Récupérer le profil de l'utilisateur.      
  * **URL**  
    `/profilr/:token/:login`

  * **Method:**  
    `GET`

  *  **URL Params**  
  `token` : Token de connexion fourni par la méthode login  
  `login` : Pseudo de l'utilisateur à chercher    

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `
    * **JSON Object:**  
      **Content:**  
      `user_name`      - Nom de l'utilisateur  
      `user_surname`   - Prénom de l'utilisateur  
      `user_phone`     - Numéro de téléphone de l'utilisateur  
      `user_birthdate` - Date de naissance de l'utilisateur  


  * **Error Response:**
    * **Code:** 404 <br />
      **Content:** `{ Not Found         : le profil demandé n'a pas été trouvé }`
    * **Code:** 403 <br />
      **Content:** `{ Forbidden         : le token fourni n'est pas valide }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }`


**GET /top/:token**
----
Vérification du classement de l'utilisateur.

  * **URL**  
    `/top/:token`

  * **Method:**  
    `GET`

  *  **URL Params**  
    `token` : Token de connexion fourni par la méthode login  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `
    * **JSON Array[Utilisateur]:**  
      **Content:**  
      `utilisateur_id`             - Identifiant de l'utilisateur
      `utilisateur_nom`            - Nom de l'utilisateur  
      `utilisateur_prenom`         - Prénom de l'utilisateur  
      `utilisateur_portable`       - Numéro de téléphone de l'utilisateur  
      `utilisateur_date_naissance` - Date de naissance de l'utilisateur  
      `utilisateur_score`          - Score de l'utilisateur  


  * **Error Response:**
    * **Code:** 403 <br />
      **Content:** `{ Forbidden         : le token fourni n'est pas valide }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }`



**GET /search/:token/:string**
----
Recherche d'utilisateur.

  * **URL**  
    `/search/:token/:string`

  * **Method:**  
    `GET`

  *  **URL Params**  
    `token`: Token de connexion fourni par la méthode login  
    `string`                : Texte contenu dans le champ de recherche


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `
    * **JSON Array[Utilisateur]:**  
      **Content:**  
      `utilisateur_id`             - Identifiant de l'utilisateur  
      `utilisateur_pseudo`         - Pseudo de l'utilisateur  


  * **Error Response:**
    * **Code:** 404 <br />
      **Content:** `{ Not Found         : aucun profil n'a été trouvé }`
    * **Code:** 403 <br />
      **Content:** `{ Forbidden         : le token fourni n'est pas valide }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }`


------------------------------------------------------------

**POST /traject/create**
----
Creer un nouveau trajet
  * **URL**  
      `/traject/create`

  * **Method:**  
      `POST`

  *  **URL Params**
    `token`                    : Token de connexion fourni par la méthode login  
    `trajet_longitude_depart`  : Longitude du point de départ  
    `trajet_latitude_depart`   : Latitude du point de départ  
    `trajet_longitude_arrivee` : Longitude du point d'arrivée  
    `trajet_latitude_arrivee`  : Latitude du point d'arrivée  
    `trajet_public`            : Trajet public ou privé  
    `utilisateur_id`           : Identifiant de l'utilisateur  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    *  **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /event/create**
----
Créer un nouvel évènement.

  * **URL**  
      `/event/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
  `token`             : Token de connexion fourni par la méthode login  
  `event_name`        : Nom du nouvel évènement  
  `event_longitude`   : Longitude de l'évènement  
  `event_latitude`    : Latitude de l'évènement  
  `event_timestamp`   : Date et heure de l'évènement  
  `event_description` : Description de l'évènement  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `  

  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`


**GET /list/:token/:latitude/:longitude**
----
Liste des évènement à proximité de l'utilisateur.

  * **Method:**  
      `GET`

  *  **URL Params**  
      `token`     : Token de connexion fourni par la méthode login  
      `latitude`  : Nom du nouvel évènement  
      `longitude` : Longitude de l'évènement  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Get s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /assist/create**
----
Créer une demande d'assistance.

  * **URL**  
      `/assist/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
      `token`             : Token de connexion fourni par la méthode login  
      `utilisateur_id_2`           : Identifiant de l'utilsateur portant assistance  
      `assistance_longitude`       : Longitude du point d'assistance  
      `assistance_latitude`        : Latitude du point d'assistance  
      `utilisateur_id`             : Identifiant de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /mark_accessibility/create**
----
Créer une note d'accessibilité pour le trajet.

  * **URL**  
      `/mark_accessibility/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
      `token`          : Token de connexion fourni par la méthode login  
      `trajet_note`    : Note du trajet  
      `trajet_id`      : Identifiant du trajet  
      `utilisateur_id` : Identifiant de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /mark_object/create**
----
Créer une note d'accessibilité pour le trajet.

  * **URL**  
      `/mark_object/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
      `token`            : Token de connexion fourni par la méthode login  
      `obstacle_note`    : Note de l'obstacle  
      `obstacle_id`      : Identifiant de l'obstacle  
      `utilisateur_id`   : Identifiant de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /mark_traject/create**
----
Créer une note pour le trajet.

  * **URL**  
      `/mark_traject/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
      `token`             : Token de connexion fourni par la méthode login  
      `note_trajet_note`    : Note du trajet  
      `trajet_trajet_id`      : Identifiant du trajet  
      `utilisateur_id`   : Identifiant de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`



**POST /user_event/create**
----
Enregistre un nouvel évènement en base.

  * **URL**  
      `/user_event/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
      `token`             : Token de connexion fourni par la méthode login  
      `utilisateur_id`   : Identifiant de l'utilisateur   
      `evenement_id`     : Identifiant de l'évènement  

  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Create s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`
