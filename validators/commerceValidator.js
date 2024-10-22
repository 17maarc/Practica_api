const { check, param } = require('express-validator'); // Importa funciones para validar parámetros y datos de solicitud

//Validador para la solicitud GET de un comercio por CIF
const validateGetItem = [
  param('cif').isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres')
];

// Validador para la solicitud POST al crear un nuevo comercio
const validateCreateItem = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'), 
  check('cif').isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres'), 
  check('email').isEmail().withMessage('El correo electrónico debe ser válido'), 
  check('phone').isLength({ min: 9, max: 15 }).withMessage('El número de teléfono es obligatorio'),
];

//Validador para la solicitud PUT al actualizar un comercio
const validateUpdateItem = [
  check('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'), //Si se incluye, el nombre no puede estar vacío
  check('email').optional().isEmail().withMessage('El correo electrónico debe ser válido'), //Si se incluye, el email debe ser válido
  check('phone').optional().isLength({ min: 9, max: 15 }).withMessage('El número de teléfono debe ser válido') //Si se incluye, el teléfono debe tener entre 9 y 15 caracteres
];

//Validador para la solicitud DELETE de un comercio por CIF
const validateDeleteItem = [
  param('cif').isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres') 
];

module.exports = { validateGetItem, validateCreateItem, validateUpdateItem, validateDeleteItem }; //Exporta los validadores