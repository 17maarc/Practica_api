const express = require("express"); //Importa el módulo Express
const fs = require("fs"); //Importa el módulo de sistema de archivos
const router = express.Router(); //Crea un nuevo router de Express

//Función para eliminar la extensión de un nombre de archivo
const removeExtension = (fileName) => {
  return fileName.split(".").shift(); //Separa el nombre del archivo por el punto y devuelve la parte anterior (sin la extensión)
};

//Lee los archivos en el directorio actual
fs.readdirSync(__dirname).filter((file) => {
  const name = removeExtension(file); //Obtiene el nombre del archivo sin extensión

  //Si el archivo no es 'index', importa el router correspondiente
  if (name !== "index") {
    router.use("/" + name, require("./" + name));
  }
});

//Exporta el router configurado
module.exports = router; 