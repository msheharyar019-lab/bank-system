const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// 1. Float & SBP Escrow Reconciliation
router.get('/reconciliation', adminController.getReconciliation);

// 2. Customers & KYC Management
router.get('/customers', adminController.getCustomers);
router.post('/customers/:userId/tier', adminController.updateCustomerTier);
router.post('/customers/:userId/toggle-freeze', adminController.toggleFreeze);

// 3. AML / Suspicious Transaction Reports (STRs)
router.get('/aml-alerts', adminController.getAmlAlerts);
router.post('/aml-alerts/:alertId/resolve', adminController.resolveAml);

// 4. Disputes & Chargeback Resolution (Easypaisa Reconciliation)
router.get('/disputes', adminController.getDisputes);
router.post('/disputes/:disputeId/resolve', adminController.resolveDispute);

// 5. Maker-Checker Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
