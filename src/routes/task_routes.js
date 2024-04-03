const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks_controller');
const taskMiddleware = require('../middleware/tasks_middleware');
const authMiddleware = require('../middleware/auth_middleware');

// Ruta para consultar
router.get('/areas',authMiddleware.verifyToken, (req, res) => {
    catalogsController.get_areas(req, res);
});