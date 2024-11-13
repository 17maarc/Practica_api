const { body, validationResult } = require("express-validator"); // Importa las funciones necesarias de express-validator
const { check } = require("express-validator"); // Importa el método check para validaciones adicionales
const validateResults = require("../utils/validator"); // Importa la función de validación personalizada


const validateRegister = [
  body("name").notEmpty().withMessage("El nombre es requerido"), // Verifica que el nombre no esté vacío
  body("email").isEmail().withMessage("El correo es inválido"), // Verifica que el correo sea un email válido
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"), // Verifica que la contraseña tenga al menos 6 caracteres
  body("age").isNumeric().withMessage("La edad debe ser un número"),
  body("city").notEmpty().withMessage("La ciudad es requerida"), // Verifica que la ciudad no esté vacía
  body("interests").isArray().withMessage("Los intereses deben ser un array de strings"), // Verifica que los intereses sean un array
  body("interests.*").isString().withMessage("Cada interés debe ser un texto"), // Verifica cada elemento del array de intereses
  body("offers").optional().isBoolean().withMessage("La oferta debe ser un valor booleano"), // Verifica que la oferta sea booleano si está presente
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

// Validaciones para el inicio de sesión
const validatorLogin = [
  body("email").notEmpty().isEmail().withMessage("El correo es inválido"), // Verifica que el correo no esté vacío y sea válido
  body("password").notEmpty(), // Verifica que la contraseña no esté vacía
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

// Validaciones para la actualización de usuario
const validateUpdate = [
  body("name").optional().notEmpty().withMessage("El nombre es requerido"), // Permite actualizar el nombre, debe ser no vacío si se proporciona
  body("email").optional().isEmail().withMessage("El correo es inválido"), // Permite actualizar el correo, debe ser válido si se proporciona
  body("age").optional().isNumeric().withMessage("La edad debe ser un número"), // Permite actualizar la edad, debe ser numérica si se proporciona
  body("city").optional().notEmpty().withMessage("La ciudad es requerida"), // Permite actualizar la ciudad, debe ser no vacío si se proporciona
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

// Validaciones para la eliminación de usuario
const validateDelete = [
  // Comprobar si existe el token en el encabezado de autorización
  check("authorization")
    .exists()
    .withMessage("TOKEN REQUERIDO") // Mensaje si no existe el token
    .bail() // Detiene la validación si hay un error
    .custom((value, { req }) => {
      // Validar que el token esté presente y bien formateado
      const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del encabezado
      if (!token) throw new Error("TOKEN NO VÁLIDO O NO PROPORCIONADO"); // Mensaje de error si el token es inválido
      return true; // Devuelve true si el token es válido
    }),
  (req, res, next) => {
    validateResults(req, res, next); // Llama a la función de validación personalizada
  },
];

module.exports = {
  validatorLogin,
  validateRegister,
  validateUpdate,
  validateDelete,
}; // Exporta los validadores