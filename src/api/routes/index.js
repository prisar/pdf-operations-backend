const express = require('express');

const routesV1 = require('./v1');

const router = express.Router();

/**
 * GET /status
 */
router.get('/api/status', (req, res) => res.send('OK'));

/**
 * API Routes
 */
router.use(routesV1);

module.exports = router;
