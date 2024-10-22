const express = require('express'); //Importa el módulo Express
const router = express.Router(); //Crea un nuevo router de Express
const { getWebpages, getWebpage, createWebpage, updateWebpage, archiveWebpage, deleteWebpage, UploadImage } = require('../controllers/webCommerce'); //Importa los controladores
const { validateCreateWebpage, validateUpdateWebpage, validateGetWebpage } = require('../validators/webValidator'); //Importa los validadores
const validateResults = require('../utils/validator'); //Importa el middleware que maneja los resultados de validación
const upload = require('../middleware/multer'); //Importa el middleware para manejar la subida de archivos

//Rutas
router.get('/', validateResults, getWebpages);

//Ruta para visitar una página web por su ID
router.get('/:id', validateGetWebpage, validateResults, getWebpage); //Aplica validación y verifica resultados antes de llamar al controlador

//Ruta para crear una nueva página web
router.post('/', validateCreateWebpage, validateResults, createWebpage); //Aplica validación y verifica resultados antes de llamar al controlador

//Ruta para actualizar una página web
router.put('/:id', validateUpdateWebpage, validateResults, updateWebpage); //Aplica validación y verifica resultados antes de llamar al controlador

//Ruta para archivar (borrado lógico) una página web
router.patch('/:id/archive', archiveWebpage); //Llama al controlador para archivar

//Ruta para eliminar (borrado físico) una página web
router.delete('/:id', deleteWebpage); //Llama al controlador para eliminar

//Ruta para subir una imagen
router.patch('/:id/upload', upload.single('image'), UploadImage); //Usa el middleware de subida de archivos y llama al controlador

module.exports = router; //Exporta las rutas definidas