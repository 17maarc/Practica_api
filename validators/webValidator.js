const { check, param } = require('express-validator'); //Importa métodos para validar parámetros y cuerpos de solicitud

//Validador para la solicitud GET de una página web a traves del id
const validateGetWebpage = [
  param('id').isMongoId().withMessage('El ID de la página web no es válido') 
];

//Validador para la solicitud POST al crear una nueva web
const validateCreateWebpage = [
  check('city').notEmpty().withMessage('La ciudad es obligatoria'), 
  check('activity').notEmpty().withMessage('La actividad es obligatoria'), 
  check('title').notEmpty().withMessage('El título es obligatorio'), 
  check('summary').notEmpty().withMessage('El resumen es obligatorio'), 
  check('texts').isArray().withMessage('Los textos deben ser un array de cadenas'), 
  //Valida la puntuación en reviews, si está presente
  check('reviews.scoring').optional().isFloat({ min: 0, max: 5 }).withMessage('La puntuación debe estar entre 0 y 5'),
  //Valida que el total de puntuaciones sea un numero válido
  check('reviews.totalRatings').optional().isInt().withMessage('El número total de puntuaciones debe ser un numero válido'),
  //Valida que las reseñas sean un array de cadenas
  check('reviews.reviewTexts').optional().isArray().withMessage('Las reseñas deben ser un array de cadenas')
];

// Validador para la solicitud PUT/UPDATE al actualizar una página web
const validateUpdateWebpage = [
  check('city').optional().notEmpty().withMessage('La ciudad no puede estar vacía'), 
  check('activity').optional().notEmpty().withMessage('La actividad no puede estar vacía'), 
  check('title').optional().notEmpty().withMessage('El título no puede estar vacío'), 
  check('summary').optional().notEmpty().withMessage('El resumen no puede estar vacío'), 
  check('texts').optional().isArray().withMessage('Los textos deben ser un array de cadenas'),
  check('images').optional().isArray().withMessage('Las imágenes deben ser un array de URLs')
];

module.exports = { validateGetWebpage, validateCreateWebpage, validateUpdateWebpage }; //Exporta los validadores