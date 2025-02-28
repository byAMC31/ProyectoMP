const express = require('express');
const { registerUser, getAllUsers, getUserById, deleteUser,updateUser, updateUserPassword } = require('../controllers/userController');
const { validateToken } = require('../middlewares/authMiddleware');  // Importar el middleware

const router = express.Router();

// Ruta para registrar usuario
router.post('/register', registerUser);

// Ruta para obtener todos los usuarios
router.get('/', validateToken,  getAllUsers);

// Ruta para obtener un usuario por su ID
router.get('/:id',validateToken,  getUserById);

// Ruta para eliminar un usuario por su ID
router.delete('/:id',validateToken,  deleteUser);

// Ruta para actualizar un usuario por su ID
router.put('/:id', validateToken,  updateUser);

// Ruta protegida para cambiar la contraseña
router.put('/:id/password', validateToken, updateUserPassword);


module.exports = router;
