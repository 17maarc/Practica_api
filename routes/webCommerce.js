const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un nuevo router de Express
const { validateCreateWebpage, validateUpdateWebpage, validateGetWebpage } = require('../validators/webValidator'); // Importa los validadores
const validateResults = require('../utils/validator'); // Importa el middleware que maneja los resultados de validación
const upload = require('../middleware/multer'); // Importa el middleware para manejar la subida de archivos
const { getWebpages, getWebpage, createWebpage, updateWebpage, archiveWebpage, deleteWebpage, UploadImage, getEmailsByActivity } = require('../controllers/webCommerce');
const { authMiddleware } = require('../middleware/authJWT');

/**
 * @swagger
 * tags:
 *   name: Webpages
 *   description: API para la gestión de páginas web de comercios
 */

/**
 * @swagger
 * path:
 *  /api/webpages:
 *    get:
 *      summary: Obtiene todas las páginas web
 *      tags: [Webpages]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Lista de páginas web obtenida exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    title:
 *                      type: string
 *                    activity:
 *                      type: string
 *        401:
 *          description: No autorizado
 */
router.get('/', getWebpages); // Obtiene todas las páginas web

/**
 * @swagger
 * path:
 *  /api/webpages/{id}:
 *    get:
 *      summary: Obtiene una página web por ID
 *      tags: [Webpages]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID de la página web a obtener
 *          schema:
 *            type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Página web obtenida exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  activity:
 *                    type: string
 *        404:
 *          description: Página web no encontrada
 *        401:
 *          description: No autorizado
 */
router.get('/:id', authMiddleware, getWebpage); // Obtiene una página web por ID

/**
 * @swagger
 * path:
 *  /api/webpages:
 *    post:
 *      summary: Crea una nueva página web
 *      tags: [Webpages]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                activity:
 *                  type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        201:
 *          description: Página web creada exitosamente
 *        400:
 *          description: Error en la validación de datos
 */
router.post('/', validateCreateWebpage, validateResults, authMiddleware, createWebpage); // Crea una nueva página web

/**
 * @swagger
 * path:
 *  /api/webpages/{id}:
 *    put:
 *      summary: Actualiza una página web por ID
 *      tags: [Webpages]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID de la página web a actualizar
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                activity:
 *                  type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Página web actualizada exitosamente
 *        400:
 *          description: Error en la validación de datos
 *        404:
 *          description: Página web no encontrada
 */
router.put('/:id', validateUpdateWebpage, validateResults, authMiddleware, updateWebpage); // Actualiza una página web por ID

/**
 * @swagger
 * path:
 *  /api/webpages/{id}:
 *    delete:
 *      summary: Elimina una página web por ID
 *      tags: [Webpages]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID de la página web a eliminar
 *          schema:
 *            type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Página web eliminada exitosamente
 *        404:
 *          description: Página web no encontrada
 */
router.delete('/:id', validateGetWebpage, validateResults, authMiddleware, deleteWebpage); // Elimina una página web por ID

/**
 * @swagger
 * path:
 *  /api/webpages/{id}/interested:
 *    get:
 *      summary: Obtiene correos electrónicos de usuarios interesados en una actividad
 *      tags: [Webpages]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID de la página web
 *          schema:
 *            type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Correos electrónicos obtenidos exitosamente
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *        404:
 *          description: Página web no encontrada
 */
router.get('/:id/interested', authMiddleware, getEmailsByActivity); // Obtiene correos electrónicos de usuarios interesados en una actividad

/**
 * @swagger
 * path:
 *  /api/webpages/{id}/upload:
 *    patch:
 *      summary: Sube una imagen a una página web
 *      tags: [Webpages]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID de la página web
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                image:
 *                  type: string
 *                  format: binary
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Imagen subida exitosamente
 *        404:
 *          description: Página web no encontrada
 */
router.patch('/:id/upload', upload.single('image'), UploadImage); // Sube una imagen a una página web

module.exports = router; // Exporta las rutas definidas para su uso en otras partes de la aplicación