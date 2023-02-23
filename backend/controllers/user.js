const bcrypt = require('bcrypt'); // Importation "bcrypt" pour le hash du mot de passe
const jwt = require('jsonwebtoken'); //Permet d'identifier un utilisateur, preuve d'authentification
const User = require ('../models/User') // Importation du models

  //Pour permettre a l'utilisateur de s'inscrire en tant que nouvel utilisateur avec " signup"
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 7)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

    //Pour permettre a l'utilisateur de se connecter avec un compte déjà existant 
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) //Comparaison du mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(          //fonction sign de JsonWebToken avec 3 arguments
                            { userId: user._id }, // donnée que l'on encode ' objet avec l'userID qui prend l'identifiant de l'utilisateur
                            process.env.TOKEN,    // clef secrete d'encodage /dans le futur utilisé une chaine de caractere longue et aléatoire
                            { expiresIn: '24h' }  // argument de configuration, application d'une expiration du TOKEN
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };