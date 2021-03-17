const express = require('express');

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const pdfRoutes = require('./pdf.route');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/user', userRoutes);
router.use('/api/v1/pdf', pdfRoutes);

module.exports = router;
