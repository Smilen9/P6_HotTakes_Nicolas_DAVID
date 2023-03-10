//****************Création d'un serveur Node ****************/

const http = require('http'); // Importation du package HTTP natif de Node
const app = require('./app'); // Importation de notre propre fichier "app.js", REQUIRE permet d'omettre le .JS

//fonction pour normaliser une valeur en un numéro de port valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//--------------  Renvoie d'un port valide
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); //Définir le port sur lequel l'application doit être écouté

//--------------  Recherche les erreurs systeme(syscall) liées au réseau
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
// Si la condition est remplie, la fonction détermine si l'adresse du serveur est une chaîne de caractères ou un nombre
// On affecte la valeur de la variable "bind" en conséquence
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': //Si l'adresse est deja en cour d'utilisation
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error; // Si aucune erreur trouvée.
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//-------- Ecouteur d'événement du port
server.listen(port);
