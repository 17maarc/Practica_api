const models = {
    commerceModel: require("./nosql/commerce"),//Importo el modelo desde la carpeta de nosql y lo asigno a commerceModel
    webModel: require("./nosql/webCommerce"),
    userModel: require('./nosql/user')
  };
  
  module.exports = models;//Exporto models para que otros archivos puedan acceder a commerceModel