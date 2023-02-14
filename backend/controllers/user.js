const bcrypt = require('bcrypt'); // Importation "bcrypt" pour le hash du mot de passe
const jwt = require('jsonwebtoken');
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
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };