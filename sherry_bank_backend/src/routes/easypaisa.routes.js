const express = require('express');
const router = express.Router();
const easypaisaController = require('../controllers/easypaisa.controller');

// Initiate Mobile Account (MA)
router.post('/initiate-ma', easypaisaController.initiateMA);

// Initiate Over The Counter (OTC)
router.post('/initiate-otc', easypaisaController.initiateOTC);

// Inquire Transaction Status
router.get('/inquire/:orderId', easypaisaController.inquireStatus);

module.exports = router;
