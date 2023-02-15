//-------------- Authentification --------------

const jwt = require('jsonwebtoken');
 
// code qui exporte une fonction qui vérifie si l'utilisateur est authentifié
module.exports = (req, res, next) => {
//Début de l'instruction
//instructions à éxécuter
   try {
       const token = req.headers.authorization.split(' ')[1]; // extrait le Token a partir de l'en tete authorization
       const decodedToken = jwt.verify(token, process.env.TOKEN); // decoder le token JWT
       const userId = decodedToken.userId; //Si le token est valide, la méthode renvoie l'objet décodé contenant les informations sur l'utilisateur
       req.auth = {
           userId: userId // Ajout d'un objet "auth" à l'objet "req" contenant l'ID de l'utilisateur
       };                  // Pour une utilisation ulterieur dans les routes nécessitant une authentification
	next();
   } 
//Instruction si dans le bloc try il y a une exception
   catch(error) {
       res.status(401).json({ error });
   }
};