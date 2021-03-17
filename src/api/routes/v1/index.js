const express = require('express');

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/user', userRoutes);

module.exports = router;
