// mise en place de password validator
var passwordValidator = require('password-validator');

// Création du schéma
var schemaPassword = new passwordValidator();

// shéma pour mot de passe
schemaPassword
.is().min(7)                                     // nombre de caractere minimum
.is().max(25)                                    // nombre de caractere maximum
.has().uppercase()                               // majuscules obligatoire
.has().lowercase()                               // minuscules obligatoire
.has().digits()                                  // minimum 1 chiffres
.has().not().spaces()                            // espaces interdits
.is().not().oneOf(['Passw0rd', 'Password123']);  // Blacklist de mot de passe

module.exports = (req, res, next) => {
    if(schemaPassword.validate(req.body.password)){
        return next();
    }else{
        return res.status(400).json({error: `mot de passe invalide ${schemaPassword.validate('req.body.password', { list: true })}` })
    }
}