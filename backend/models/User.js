const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Evite d'avoir 2 utilisateurs avec la meme adresse email
                                                            // Permet d'avoir un champ unique dans la base de donnée MongoDB

// Modèle pour l'inscription ou la connection
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique pour ne pas avoir 2 utilisateurs avec la même adresse email
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //Permet d'avoir un seul et unique utilisateur avec la meme adresse email + password
                                    //On l'inject dans notre schema d'utilisateur

//Exportation du schema
module.exports = mongoose.model('User', userSchema);