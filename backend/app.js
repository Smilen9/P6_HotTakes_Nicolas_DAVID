const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require ('./routes/sauces')
const path = require('path');
const dotenv = require('dotenv').config();


//--------------- Connexion à Moogoose 
mongoose.connect(process.env.PASSWORD,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//---intercepte toutes les requêtes qui contiennent du JSON pour le mettre à disposition sur l'objet requête dans req.body
// remplace body parser
const app = express();
app.use(express.json());

 //CORS = sécurité, permet d'éviter les attaques "Cross-Site Request Forgery" (CSRF)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// routes qui seront utilisées par l'application
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // On rend le fichier app disponible