const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

// Profile & Balance
router.get('/profile', walletController.getProfile);

// Transaction History
router.get('/transactions', walletController.getTransactions);

// Send Money
router.post('/transfer', walletController.sendMoney);

// Mock Deposit (Instant balance top-up for testing)
router.post('/mock-deposit', walletController.mockDeposit);

module.exports = router;
