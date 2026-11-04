import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // 1. Health check
  async getHealth() {
    try {
      const res = await client.get('/health');
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response ? err.response.data : err.message,
      };
    }
  },

  // 2. Wallet Profile
  async getProfile() {
    try {
      const res = await client.get('/wallet/profile');
      return res.data;
    } catch (err) {
      return {
        success: false,
        data: {
          holderName: 'Sheharyar Khan',
          accountNumber: 'PK88SHRY00192837465',
          balance: 75000,
          tier: 'Enterprise Verified',
        },
      };
    }
  },

  // 3. Transactions List
  async getTransactions() {
    try {
      const res = await client.get('/wallet/transactions');
      return res.data;
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  // 4. Send Money
  async sendMoney({ recipient, amount, note }) {
    const res = await client.post('/wallet/transfer', { recipient, amount, note });
    return res.data;
  },

  // 5. Easypaisa Initiate MA (Mobile Account)
  async initiateEasypaisaMA({ amount, mobileAccountNo, emailAddress }) {
    const res = await client.post('/easypaisa/initiate-ma', {
      amount,
      mobileAccountNo,
      emailAddress,
    });
    return res.data;
  },

  // 6. Easypaisa Initiate OTC (Over the counter token)
  async initiateEasypaisaOTC({ amount, msisdn, emailAddress }) {
    const res = await client.post('/easypaisa/initiate-otc', {
      amount,
      msisdn,
      emailAddress,
    });
    return res.data;
  },

  // 7. Easypaisa Inquire Order Status
  async inquireStatus(orderId) {
    const res = await client.get(`/easypaisa/inquire/${orderId}`);
    return res.data;
  },

  // 8. Instant Test Top-up
  async mockDeposit({ amount, source }) {
    const res = await client.post('/wallet/mock-deposit', {
      amount,
      source: source || 'Web Banking Direct Top-up',
    });
    return res.data;
  },

  // 9. Admin - SBP Float & Escrow Reconciliation
  async getAdminReconciliation() {
    const res = await client.get('/admin/reconciliation');
    return res.data;
  },

  // 10. Admin - Customer KYC Management
  async getAdminCustomers() {
    const res = await client.get('/admin/customers');
    return res.data;
  },

  // 11. Admin - Update KYC Tier
  async updateCustomerTier(userId, newTier) {
    const res = await client.post(`/admin/customers/${userId}/tier`, {
      newTier,
      actor: 'Ops_Lead (Sheharyar)',
    });
    return res.data;
  },

  // 12. Admin - Freeze/Unfreeze Customer Account
  async toggleAccountFreeze(userId, reason) {
    const res = await client.post(`/admin/customers/${userId}/toggle-freeze`, {
      reason,
      actor: 'Risk_Officer (AML)',
    });
    return res.data;
  },

  // 13. Admin - AML Alerts
  async getAmlAlerts() {
    const res = await client.get('/admin/aml-alerts');
    return res.data;
  },

  // 14. Admin - Resolve AML Alert
  async resolveAmlAlert(alertId, resolution) {
    const res = await client.post(`/admin/aml-alerts/${alertId}/resolve`, {
      resolution,
      actor: 'Compliance_Officer',
    });
    return res.data;
  },

  // 15. Admin - Disputes & Easypaisa Reversals
  async getDisputes() {
    const res = await client.get('/admin/disputes');
    return res.data;
  },

  async resolveDispute(disputeId, action) {
    const res = await client.post(`/admin/disputes/${disputeId}/resolve`, {
      action,
      actor: 'Dispute_Agent',
    });
    return res.data;
  },

  // 16. Admin - Maker-Checker Audit Logs
  async getAuditLogs() {
    const res = await client.get('/admin/audit-logs');
    return res.data;
  },
};
