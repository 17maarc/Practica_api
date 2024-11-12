const express = require('express');
const router = express.Router();
const { validateCreateWebpage, validateUpdateWebpage, validateGetWebpage } = require('../validators/webValidator');
const validateResults = require('../utils/validator');
const upload = require('../middleware/multer');
const { getWebpages, getWebpage, createWebpage, updateWebpage, deleteWebpage, UploadImage, getEmailsByActivity } = require('../controllers/webCommerce');
const { authMiddleware } = require('../middleware/authJWT');

/**
 * @openapi
 * /api/webpages:
 *   get:
 *     summary: Obtiene todas las páginas web de los comercios
 *     tags: [Webpages]
 *     responses:
 *       200:
 *         description: Lista de todas las páginas web
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/webpage'
 */
router.get('/', getWebpages);

/**
 * @openapi
 * /api/webpages/{id}:
 *   get:
 *     summary: Obtiene una página web por ID
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la página web
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la página web
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/webpage'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Página web no encontrada
 */
router.get('/:id', authMiddleware, getWebpage);

/**
 * @openapi
 * /api/webpages:
 *   post:
 *     summary: Crea una nueva página web para un comercio
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createWebpage'
 *     responses:
 *       201:
 *         description: Página web creada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 */
router.post('/', validateCreateWebpage, validateResults, authMiddleware, createWebpage);

/**
 * @openapi
 * /api/webpages/{id}:
 *   put:
 *     summary: Actualiza una página web existente
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la página web a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateWebpage'
 *     responses:
 *       200:
 *         description: Página web actualizada exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Página web no encontrada
 */
router.put('/:id', validateUpdateWebpage, validateResults, authMiddleware, updateWebpage);

/**
 * @openapi
 * /api/webpages/{id}:
 *   delete:
 *     summary: Elimina una página web de un comercio
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la página web a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Página web eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Página web no encontrada
 */
router.delete('/:id', validateGetWebpage, validateResults, authMiddleware, deleteWebpage);

/**
 * @openapi
 * /api/webpages/{id}/interested:
 *   get:
 *     summary: Obtiene los correos electrónicos de usuarios interesados en la actividad del comercio
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la página web del comercio
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de correos electrónicos de usuarios interesados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Página web no encontrada
 */
router.get('/:id/interested', authMiddleware, getEmailsByActivity);

/**
 * @openapi
 * /api/webpages/{id}/upload:
 *   patch:
 *     summary: Sube una imagen para una página web del comercio
 *     tags: [Webpages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la página web a actualizar con la imagen
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   example: "https://example.com/images/yourimage.jpg"
 */
router.patch('/:id/upload', upload.single('image'), UploadImage);

module.exports = router;