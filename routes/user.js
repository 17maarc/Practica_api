const express = require("express");
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser } = require("../controllers/user");
const { validateRegister, validatorLogin, validateUpdate, validateDelete } = require("../validators/userValidator");
const { authMiddleware } = require("../middleware/authJWT");

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerUser'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la validación de datos
 *       409:
 *         description: El usuario ya está registrado
 */
router.post("/register", validateRegister, registerUser);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginUser'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", validatorLogin, loginUser);

/**
 * @openapi
 * /api/user/update:
 *   put:
 *     summary: Actualiza un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateUser'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/update", validateUpdate, authMiddleware, updateUser);

/**
 * @openapi
 * /api/user:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/", validateDelete, authMiddleware, deleteUser);

module.exports = router;