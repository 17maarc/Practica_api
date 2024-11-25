const express = require("express"); // Importa el módulo Express
const router = express.Router(); // Crea un nuevo router de Express
const { getItems, getItem, createItem, updateItem, deleteItem, getInterestedUsers } = require("../controllers/commerce"); // Importa los controladores para manejar las operaciones
const { validateGetItem, validateCreateItem, validateUpdateItem, validateDeleteItem } = require('../validators/commerceValidator'); // Importa los validadores
const validateResults = require('../utils/validator'); // Importa el middleware que maneja los resultados de validación
const { authMiddleware } = require('../middleware/authJWT');
const authRole = require('../middleware/authRole');

/**
 * @openapi
 * tags:
 *   name: Commerce
 *   description: API para la gestión de comercios
 */

/**
 * @openapi
 * /api/commerce:
 *   get:
 *     summary: Obtener todos los comercios
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de comercios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/commerce'
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getItems); // Obtener todos los comercios

/**
 * @openapi
 * /api/commerce/{cif}:
 *   get:
 *     summary: Obtener un comercio específico
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         description: CIF del comercio a obtener
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comercio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/commerce'
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:cif", validateGetItem, validateResults, authMiddleware, getItem); // Obtener un comercio específico

/**
 * @openapi
 * /api/commerce/create:
 *   post:
 *     summary: Crear un nuevo comercio
 *     tags: [Commerce]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createCommerce'
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []  # Asumiendo que se requiere rol de admin
 *     responses:
 *       201:
 *         description: Comercio creado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       409:
 *         description: El comercio ya existe
 */
router.post("/create", validateCreateItem, validateResults, authMiddleware, authRole, createItem); // Crear un nuevo comercio

/**
 * @openapi
 * /api/commerce/{cif}:
 *   put:
 *     summary: Editar un comercio existente
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         description: CIF del comercio a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateCommerce'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       404:
 *         description: Comercio no encontrado
 */
router.put("/:cif", validateUpdateItem, validateResults, authMiddleware, updateItem); // Editar un comercio existente usando su CIF

/**
 * @openapi
 * /api/commerce/{cif}:
 *   delete:
 *     summary: Eliminar un comercio
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         description: CIF del comercio a eliminar
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *       404:
 *         description: Comercio no encontrado
 */
router.delete("/:cif", validateDeleteItem, validateResults, authMiddleware, deleteItem); // Eliminar un comercio usando su CIF

/**
 * @openapi
 * /api/commerce/{cif}/interested-users:
 *   get:
 *     summary: Obtener los usuarios interesados en las actividades de un comercio
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: cif
 *         required: true
 *         description: CIF del comercio para obtener los usuarios interesados
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios interesados obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correos:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Comercio no encontrado o no hay usuarios interesados
 *       401:
 *         description: No autorizado
 */
router.get("/:cif/interested-users", authMiddleware, getInterestedUsers); // Obtener usuarios interesados en un comercio

module.exports = router;