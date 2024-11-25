const { body, param, validationResult } = require("express-validator"); // Importa las funciones necesarias de express-validator
const validateResults = require("../utils/validator");

// Validación para crear una nueva página web
const validateCreateWebpage = [
  body("city").notEmpty().withMessage("La ciudad es obligatoria"),
  body("activity").notEmpty().withMessage("La actividad es obligatoria"),
  body("title").notEmpty().withMessage("El título es obligatorio"),
  body("summary").notEmpty().withMessage("El resumen es obligatorio"),
  body("texts").isArray().withMessage("Los textos deben ser un array de cadenas"),
  body("reviews.scoring").optional().isFloat({ min: 0, max: 5 }).withMessage("La puntuación debe estar entre 0 y 5"),
  body("reviews.totalRatings").optional().isInt().withMessage("El número total de puntuaciones debe ser un número válido"),
  body("reviews.reviewTexts").optional().isArray().withMessage("Las reseñas deben ser un array de cadenas"),
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

// Validación para obtener una página web por ID
const validateGetWebpage = [
  param("id").isMongoId().withMessage("El ID de la página web no es válido"),
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

// Validación para actualizar una página web
const validateUpdateWebpage = [
  body("city").optional().notEmpty().withMessage("La ciudad no puede estar vacía"),
  body("activity").optional().notEmpty().withMessage("La actividad no puede estar vacía"),
  body("title").optional().notEmpty().withMessage("El título no puede estar vacío"),
  body("summary").optional().notEmpty().withMessage("El resumen no puede estar vacío"),
  body("texts").optional().isArray().withMessage("Los textos deben ser un array de cadenas")
    .custom(value => value && !value.every(item => typeof item === "string") ? new Error("Cada texto debe ser una cadena") : true),
  body("images").optional().isArray().withMessage("Las imágenes deben ser un array de URLs")
    .custom(value => value && !value.every(item => typeof item === "string" && /^https?:\/\/[^\s]+$/.test(item)) ? new Error("Cada imagen debe ser una URL válida") : true),
  (req, res, next) => {
    const errors = validationResult(req); // Obtiene los errores de validación
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() }); // Devuelve errores si los hay
    next(); // Continúa al siguiente middleware si no hay errores
  },
];

module.exports = {
  validateCreateWebpage,
  validateGetWebpage,
  validateUpdateWebpage,
};