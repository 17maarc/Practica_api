const express = require("express");
const router = express.Router();
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/commerce");

router.get("/", getItems); // Ruta para obtener todos los comercios
router.get("/:cif", getItem); // Ruta para obtener un comercio específico usando el CIF
router.post("/", createItem); // Ruta para crear un comercio nuevo
router.put("/:cif", updateItem); // Ruta para modificar un comercio existente usando su CIF
router.delete("/:cif", deleteItem); // Ruta para eliminar un comercio utilizando su CIF

module.exports = router;