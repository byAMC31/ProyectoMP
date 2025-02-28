const express = require('express');
const { registerUser, getAllUsers, getUserById, deleteUser,updateUser, updateUserPassword } = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');  // Importar el middleware

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Adrian"
 *               apellido: 
 *                 type: string
 *                 example: "Mtz"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "adr.mtz@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Paa$$w0rd"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 185
 *                 email:
 *                   type: string
 *                   example: "Adrian.Martinez@example.com"
 *                 nombre:
 *                   type: string
 *                   example: "Adrian"
 *                 apellido:
 *                   type: string
 *                   example: "Martinez"
 *                 
 *       400:
 *         description: Error en la solicitud, como correo duplicado o contraseña inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El correo electrónico ya está registrado."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al registrar el usuario"
 */
router.post('/register', registerUser);


/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtiene la lista de todos los usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Juan"
 *                   apellido:
 *                     type: string
 *                     example: "Perez"
 *                   email:
 *                     type: string
 *                     example: "juan.perez@example.com"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido o expirado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener los usuarios"
 */
// Ruta para obtener todos los usuarios
router.get('/', validateToken,  getAllUsers);



/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []  # Requiere autenticación con token Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea obtener
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan"
 *                 apellido:
 *                   type: string
 *                   example: "Perez"
 *                 email:
 *                   type: string
 *                   example: "juan.perez@example.com"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido o expirado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener el usuario"
 */
// Ruta para obtener un usuario por su ID
router.get('/:id',validateToken,  getUserById);


/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []  # Requiere autenticación con token Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al eliminar el usuario"
 */

// Ruta para eliminar un usuario por su ID
router.delete('/:id',validateToken,  deleteUser);




/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []  # Requiere autenticación con token Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario que se desea actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Adrian"
 *               apellido:
 *                 type: string
 *                 example: "Mtz"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "adrian.mtz@example.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado correctamente"
 *       400:
 *         description: Error en la solicitud, como usuario no encontrado o datos duplicados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ya existe un usuario con ese nombre y apellido"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar el usuario"
 */

// Ruta para actualizar un usuario por su ID
router.put('/:id', validateToken,  updateUser);



/**
 * @swagger
 * /api/v1/users/{id}/password:
 *   put:
 *     summary: Actualiza la contraseña de un usuario por su ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - BearerAuth: []  # Requiere autenticación con token Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario cuya contraseña se desea actualizar
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldP@ssw0rd"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewP@ssw0rd"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada correctamente"
 *       400:
 *         description: Error en la solicitud, como contraseña actual incorrecta o nueva contraseña inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "La contraseña actual es incorrecta"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token inválido o expirado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar la contraseña"
 */

// Ruta protegida para cambiar la contraseña
router.put('/:id/password', validateToken, updateUserPassword);



module.exports = router;
