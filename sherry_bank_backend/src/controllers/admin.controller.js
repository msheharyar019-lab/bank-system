const adminService = require('../services/admin.service');

const getReconciliation = (req, res, next) => {
  try {
    const metrics = adminService.getReconciliationMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
};

const getCustomers = (req, res, next) => {
  try {
    const customers = adminService.getCustomers();
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    next(err);
  }
};

const updateCustomerTier = (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newTier, actor } = req.body;
    if (!newTier) {
      return res.status(400).json({ success: false, message: 'newTier is required' });
    }
    const updated = adminService.updateCustomerTier(userId, newTier, actor);
    res.status(200).json({ success: true, message: 'Customer Tier Updated', data: updated });
  } catch (err) {
    next(err);
  }
};

const toggleFreeze = (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason, actor } = req.body;
    const updated = adminService.toggleAccountFreeze(userId, reason, actor);
    res.status(200).json({ success: true, message: `Account status updated to ${updated.status}`, data: updated });
  } catch (err) {
    next(err);
  }
};

const getAmlAlerts = (req, res, next) => {
  try {
    const alerts = adminService.getAmlAlerts();
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    next(err);
  }
};

const resolveAml = (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { resolution, actor } = req.body;
    const updated = adminService.resolveAmlAlert(alertId, resolution, actor);
    res.status(200).json({ success: true, message: 'AML Alert Resolved', data: updated });
  } catch (err) {
    next(err);
  }
};

const getDisputes = (req, res, next) => {
  try {
    const disputes = adminService.getDisputes();
    res.status(200).json({ success: true, count: disputes.length, data: disputes });
  } catch (err) {
    next(err);
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { disputeId } = req.params;
    const { action, actor } = req.body;
    const result = await adminService.resolveDispute(disputeId, action, actor);
    res.status(200).json({ success: true, message: 'Dispute processed', data: result });
  } catch (err) {
    next(err);
  }
};

const getAuditLogs = (req, res, next) => {
  try {
    const logs = adminService.getAuditLogs();
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReconciliation,
  getCustomers,
  updateCustomerTier,
  toggleFreeze,
  getAmlAlerts,
  resolveAml,
  getDisputes,
  resolveDispute,
  getAuditLogs,
};
