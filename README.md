
## Back-End du projet Roule ma poule
![Logo](Logo.png)

## API Documentation
# **/route_authentication.js**
**POST /register**
----
  POST Enregistrer un nouvel utilisateur.

* **URL**  
  `/register`

* **Method:**  
  `POST`

*  **URL Params**  
  `login` : Pseudo du nouvel utilisateur  
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


**POST /login**
----
  POST Connecter un utilisateur.

  * **URL**  
    `/login`

  * **Method:**  
    `POST`

  *  **URL Params**  
    `login` : Pseudo de l'utilisateur  
    `password` : Mot de passe de l'utilisateur   


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Login s'est bien passé `


  * **Error Response:**
    * **Code:** 401 <br />
      **Content:** `{ Not Found       : le login de l'utilisateur n'existe pas en base }`
    * **Code:** 500 <br />
      **Content:** `{ Server Error       : Erreur lors de la lecture ou l'écriture dans la base }``


# **/route_traject.js**
**POST /create**
----
POST Créer un trajet.

  * **URL**  
      `/create`

  * **Method:**  
      `POST`

  *  **URL Params**  
    `trajet_longitude_depart`  : Longitude du point de départ  
    `trajet_latitude_depart`   : Latitude du point de départ  
    `trajet_longitude_arrivee` : Longitude du point d'arrivée  
    `trajet_latitude_arrivee`  : Latitude du point d'arrivée  
    `trajet_public`            : Trajet public ou privé  
    `utilisateur_id`           : Identifiant de l'utilisateur  


  * **Success Response:**
    * **Code:** 200 <br />
      **Content:** ` Register s'est bien passé `


  * **Error Response:**    
    * **Code:** 403 <br />
      **Content:** `{ Forbiddien       : Mauvais token ou token expiré }`
    *  **Code:** 500 <br />
      **Content:** `{ Server Error      : Erreur lors de l'enregistrement dans la base }`


# **/route_event.js**
**POST /create**
----
POST Créer un nouvel évènement.

  * **URL**  
      `/create`

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


**GET /create**
----
GET Create new event.

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


# **/route_assist.js**
**POST /create**
----
POST Créer une demande d'assistance.

  * **URL**  
      `/create`

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
