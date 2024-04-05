const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth_middleware');
const trainingMiddleware = require('../middleware/training_middleware');
const trainingController = require('../controllers/training_controller');
// Ruta para insertar una nueva área
router.post('/task', authMiddleware.verifyToken,trainingMiddleware.validate_task, (req, res) => {
    trainingController.insert_task(req, res);
});

module.exports = router;