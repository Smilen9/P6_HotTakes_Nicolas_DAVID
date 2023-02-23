// mise en place de password validator
let passwordValidator = require('password-validator'); // permet de définir des regles pour le mot de pass
const alert = require('alert');
                                                       
// Création du schéma
let schemaPassword = new passwordValidator();

// regle du schéma pour mot de passe grace au plugin "password-validator"
schemaPassword
.is().min(7)                                     // nombre de caractere minimum
.is().max(25)                                    // nombre de caractere maximum
.has().uppercase()                               //AU MOINS majuscules obligatoire
.has().lowercase()                               //AU MOINS minuscules obligatoire
.has().digits()                                  //AU MOINS 1 chiffres
.has().not().spaces()                            // espaces interdits
.is().not().oneOf(['Passw0rd', 'Password123']);  // Blacklist de mot de passe

module.exports = (req, res, next) => {
    if(schemaPassword.validate(req.body.password)){
        return next();
    }else{
        alert("Votre mot de passe doit comporter au moins 1 maj, 1min, 7caracteres minimum et 1 chiffre"); // Affichage d'un popup si le mot de passe n'est pas correct
        return res.status(400).json({message: `mot de passe invalide ${schemaPassword.validate('req.body.password', { list: true })}` });
    }
}