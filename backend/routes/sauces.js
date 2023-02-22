
const express = require('express');
const router = express.Router(); // Pour créer des routeurs séparés pour chaque route principale 
const auth = require('../middleware/user');
const multer = require('../middleware/multer-config');//chemin du fichier image
const sauceCtrl = require('../controllers/sauces');

//permet de récuperer des données à partir du serveur
//On cible les fonction du fichier sauceCtrl
router.get('/', auth, sauceCtrl.getAllSauce); //Pour afficher les sauces.
router.get('/:id', auth, sauceCtrl.getOneSauce); //Pour afficher une sauce
// permet de mettre à jour des données existante au serveur
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Pour modifier une sauce, mettre à jour
//permet de supprimer une ressource existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Pour supprimer une sauce
//permet d'envoyer les données au serveur
router.post('/', auth, multer, sauceCtrl.createSauce); //Pour créer les sauces 
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); //Pour liker/disliker une sauce

// Les routes sont gérées par le contrôleur (sauceCtrl) qui contient les fonctions correspondantes pour réaliser les actions.
// L'authentification (auth) est requise pour toutes les routes
module.exports = router;