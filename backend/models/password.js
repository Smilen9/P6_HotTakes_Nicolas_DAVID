const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

//---modele de mot de passe attendu pour un utilisateur
passwordSchema
.is().min(7)                                    
.is().max(25)                                  
.has().uppercase()                              
.has().lowercase()                             
.has().digits()                                
.has().not().spaces()                    

module.exports = passwordSchema;