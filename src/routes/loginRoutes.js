const express = require('express');
const { loginUser } = require('../controllers/loginController');  // Importa el controlador
const router = express.Router();


/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Inicia sesión con las credenciales de un usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "adrian@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example:  "Paassw0rd%"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inicio de sesión exitoso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWFuLnBlcmV6QGV4YW1wbGUuY29tIiwicGFzc3dvcmRDaGFuZ2VkQXQiOiIyMDI1LTA2LTAxVDAyOjM1OjE1Ljc5OFoiLCJpYXQiOjE2Mjg1NzUyOTEsImV4cCI6MTYyODU3ODg5MX0.VsQKkhp_jnbx6tBzvCmP-B2D6W7VA67q8DeLg6QNm1k"
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Credenciales incorrectas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en el servidor"
 */

router.post('/', loginUser);  // Define el endpoint para el inicio de sesión

module.exports = router;
