const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const emailcontrole = require('../middleware/emailcontrole');
const passwordcontrole = require('../middleware/passwordcontrole');


router.post('/signup', emailcontrole, passwordcontrole, userCtrl.signup); //Pour s'inscrire //On ajoute les middleware d'email et password
router.post('/login', userCtrl.login); //Pour se connecter

module.exports = router;                            