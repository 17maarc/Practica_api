const express = require("express"); //Importa el módulo Express
const router = express.Router(); //Crea un nuevo router de Express
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/commerce"); //Importa los controladores para manejar las operaciones
const { validateGetItem, validateCreateItem, validateUpdateItem, validateDeleteItem } = require('../validators/commerceValidator'); //Importa los validadores
const validateResults = require('../utils/validator'); //Importa el middleware que maneja los resultados de validación

//Rutas
router.get("/", getItems); //Ruta para obtener todos los comercios

router.get("/:cif", validateGetItem, validateResults, getItem); //Ruta para obtener un comercio específico usando el CIF, con validación y manejo de resultados

router.post("/", validateCreateItem, validateResults, createItem); //Ruta para crear un comercio nuevo, con validación y manejo de resultados

router.put("/:cif", validateUpdateItem, validateResults, updateItem); //Ruta para modificar un comercio existente usando su CIF, con validación y manejo de resultados

router.delete("/:cif", validateDeleteItem, validateResults, deleteItem); //Ruta para eliminar un comercio utilizando su CIF, con validación y manejo de resultados

module.exports = router; //Exporta el router configurado