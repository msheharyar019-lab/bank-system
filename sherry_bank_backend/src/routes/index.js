const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const easypaisaRoutes = require('./easypaisa.routes');
const walletRoutes = require('./wallet.routes');
const adminRoutes = require('./admin.routes');

router.use('/health', healthRoutes);
router.use('/easypaisa', easypaisaRoutes);
router.use('/wallet', walletRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
