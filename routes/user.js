const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un nuevo router de Express

// Importa los controladores y validadores necesarios
const { registerUser, loginUser, updateUser, deleteUser } = require('../controllers/user');
const { validateRegister, validatorLogin, validateUpdate, validateDelete } = require('../validators/userValidator');
const { authMiddleware } = require('../middleware/authJWT'); // Middleware para autenticar usuarios

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * path:
 *  /api/users/register:
 *    post:
 *      summary: Registrar un nuevo usuario
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                city:
 *                  type: string
 *                interests:
 *                  type: array
 *                  items:
 *                    type: string
 *      responses:
 *        201:
 *          description: Usuario registrado exitosamente
 *        400:
 *          description: Error en la validación de datos
 *        409:
 *          description: El usuario ya está registrado
 */
router.post('/register', validateRegister, registerUser);

/**
 * @swagger
 * path:
 *  /api/users/login:
 *    post:
 *      summary: Iniciar sesión de un usuario
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Inicio de sesión exitoso
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                  user:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                      email:
 *                        type: string
 *                        format: email
 *                      city:
 *                        type: string
 *                      interests:
 *                        type: array
 *                        items:
 *                          type: string
 *        401:
 *          description: Credenciales incorrectas
 *        404:
 *          description: Usuario no encontrado
 */
router.post('/login', validatorLogin, loginUser);

/**
 * @swagger
 * path:
 *  /api/users/update:
 *    put:
 *      summary: Actualizar información del usuario
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                city:
 *                  type: string
 *                interests:
 *                  type: array
 *                  items:
 *                    type: string
 *      responses:
 *        200:
 *          description: Usuario actualizado exitosamente
 *        401:
 *          description: No autorizado
 *        404:
 *          description: Usuario no encontrado
 */
router.put('/update', validateUpdate, authMiddleware, updateUser);

/**
 * @swagger
 * path:
 *  /api/users:
 *    delete:
 *      summary: Eliminar un usuario
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Usuario eliminado exitosamente
 *        401:
 *          description: No autorizado
 *        404:
 *          description: Usuario no encontrado
 */
router.delete('/', validateDelete, authMiddleware, deleteUser);

// Exporta las rutas definidas para su uso en otras partes de la aplicación
module.exports = router;