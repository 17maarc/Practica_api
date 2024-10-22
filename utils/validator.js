const { validationResult } = require('express-validator'); //Importa el método para verificar resultados de validación

//Middleware para validar los resultados de las solicitudes
const validateResults = (req, res, next) => {
  try {
    //Intenta obtener los resultados de la validación
    validationResult(req).throw(); //Si hay errores, lanza una excepción con los errores
    return next(); //Si no hay errores, continúa con el siguiente middleware o controlador
  } catch (err) {
    //Si hay errores de validación, devuelve una respuesta 403
    res.status(403);
    res.send({ errors: err.array() }); //Envía los errores como un array en la respuesta
  }
};

module.exports = validateResults; //Exporta el middleware