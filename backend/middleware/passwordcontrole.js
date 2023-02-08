const passwordSchema = require('../models/password');

//----Middleware de la verification du MDP
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le MDP doit faire 7 caractères minimum, avec une maj, une min et un chiffre au minimum.' });
    } else {
        next();
    }
};