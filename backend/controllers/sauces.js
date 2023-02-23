//Fonction pour intéragir avec le serveur pour la lecture et l'écriture

const Sauce = require("../models/Sauce");
const fs = require("fs"); //file system, accès aux fonctions pour de modifier le système de fichiers et supprimer les fichiers

//----------- Pour creer/Enregistrer une sauce-----------
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // Recupere données JSON et convertit en objet
  delete sauceObject._id;
  delete sauceObject._userId;
  //Nouvelle instance de l'objet
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId, //Pour spécifier l'ID de l'utilisateur
    imageUrl: `${req.protocol}://${req.get("host")}/images/${  //Creation de la nouvelle URL de l'image
      req.file.filename
    }`,
  });
  //Sauvegarde de la sauce dans la base de donnée, renvoie une promesse
  sauce 
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


//------------ Pour afficher une sauce----------
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({                   //On cherche l'objet Sauce
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce); //Renvoie sous forme JSON
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//---------------- Pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Recherche une sauce
        .then(sauce =>{
            if (sauce.userId != req.auth.userId){ //Si l'id de l'utilisateur de la sauce et différent de l'id qui a creer la sauce
                res.status(401).json({
                    message: 'Not authorized'
                });
            }else{
                const sauceObject = req.file ? {         
                    ...JSON.parse(req.body.sauce),                   
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Si on modifie l'image 
            
                } : { ...req.body };
            //Mettre a jour la sauce
            //Deux objet en argument : les criteres de la recherche (identifiant de sauce) et les nouvelles valeurs
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ message: error.message }));
}

//------------------- Pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // findOne pour trouver un seul document
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];//divisé l'url en deux et conserver la partie apres images
        fs.unlink(`images/${filename}`, () => {    //Unlink permet de supprimer un fichier a partir de son chemin
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//---------------------- Pour afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find() // find pour trouver plusieurs documents
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//---------------------- Pour liker et disliker une sauce
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  //Si l'utilisateur aime la sauce
  switch (like) {
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;
//Si l'utilisateur retire son like ou sont dislike
    case 0 :
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                // .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;
//Si l'utilisateur n'aime pas
    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}
