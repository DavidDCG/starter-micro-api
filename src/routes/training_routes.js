const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth_middleware');
const trainingMiddleware = require('../middleware/training_middleware');
const trainingController = require('../controllers/training_controller');
// Ruta para insertar una nueva área
router.post('/task', authMiddleware.verifyToken,trainingMiddleware.validate_task, (req, res) => {
    trainingController.insert_task(req, res);
});

// Ruta para insertar una nueva área
router.get('/task', authMiddleware.verifyToken, (req, res) => {
    trainingController.getTasks(req, res);
});

// Ruta para insertar una nueva área
router.get('/task/:id', authMiddleware.verifyToken, (req, res) => {
    trainingController.getTasks(req, res);
});

// Ruta para insertar una nueva área
router.get('/onbording_users', authMiddleware.verifyToken, (req, res) => {
    trainingController.onbording_users(req, res);
});

// Ruta para insertar una nueva área
router.get('/onbording_users/:id', authMiddleware.verifyToken, (req, res) => {
    trainingController.onbording_users(req, res);
});

// Ruta para insertar una nueva área
router.get('/categories_onbording/', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_onbording(req, res);
});

// Ruta para insertar una nueva área
router.get('/categories_onbording/:id', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_onbording(req, res);
});

// Ruta para insertar una nueva área
router.get('/categories_task/', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_task(req, res);
});




module.exports = router;