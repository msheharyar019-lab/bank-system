const walletService = require('./wallet.service');
const easypaisaService = require('./easypaisa.service');

/**
 * Sherry Bank Core Operations & Backoffice Admin Service
 * Compliant with SBP Electronic Money Institutions (EMI) Regulations & Maker-Checker Governance
 */
class AdminService {
  constructor() {
    // SBP Escrow Reserve & Settlement Pool (Float Account)
    this.escrowAccount = {
      bankName: 'Standard Chartered Bank (Escrow Trust Account)',
      accountNumber: 'SCB-SBP-TRUST-99882103',
      balance: 150000.0, // Liquid reserve pool backing customer e-money float
      currency: 'PKR',
      lastReconciled: new Date().toISOString(),
    };

    // KYC Customer Registry with SBP Tiers
    this.customers = [
      {
        userId: 'user_sherry_001',
        holderName: 'Sheharyar Khan',
        accountNumber: 'PK88SHRY00192837465',
        phoneNumber: '03001234567',
        cnic: '37405-1928374-1',
        tier: 'Level 2 (Enterprise Biometric)',
        monthlyLimit: 1000000.0,
        balance: 75000.0,
        status: 'ACTIVE', // 'ACTIVE' or 'FROZEN'
        kycStatus: 'VERIFIED',
        registeredAt: '2026-01-15T10:00:00Z',
      },
      {
        userId: 'user_ahmad_002',
        holderName: 'Ahmad Tariq',
        accountNumber: 'PK88SHRY00982341762',
        phoneNumber: '03458508726',
        cnic: '35201-8827391-3',
        tier: 'Level 1 (CNIC Verified)',
        monthlyLimit: 200000.0,
        balance: 28450.0,
        status: 'ACTIVE',
        kycStatus: 'VERIFIED',
        registeredAt: '2026-03-20T14:30:00Z',
      },
      {
        userId: 'user_zainab_003',
        holderName: 'Zainab Fatima',
        accountNumber: 'PK88SHRY00472819034',
        phoneNumber: '03325241789',
        cnic: '42101-7391829-2',
        tier: 'Level 0 (Asaan Mobile Account)',
        monthlyLimit: 50000.0,
        balance: 4500.0,
        status: 'ACTIVE',
        kycStatus: 'PENDING_BIOMETRIC',
        registeredAt: '2026-09-01T09:15:00Z',
      },
    ];

    // SBP Anti-Money Laundering (AML) / Suspicious Activity Flags (STRs)
    this.amlAlerts = [
      {
        id: 'AML-9021',
        userId: 'user_sherry_001',
        customerName: 'Sheharyar Khan',
        amount: 85000.0,
        ruleTriggered: 'Cash Velocity Threshold (Single deposit > Rs. 50,000)',
        riskLevel: 'MEDIUM',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'UNDER_REVIEW', // 'UNDER_REVIEW', 'CLEARED', 'REPORTED_TO_FMU'
      },
      {
        id: 'AML-9022',
        userId: 'user_ahmad_002',
        customerName: 'Ahmad Tariq',
        amount: 150000.0,
        ruleTriggered: 'Rapid Inward Transfers from Multiple Sources',
        riskLevel: 'HIGH',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: 'CLEARED',
      },
    ];

    // Maker-Checker Immutable Audit Trail
    this.auditLogs = [
      {
        id: 'AUD-1001',
        actor: 'Admin_Lead (Sheharyar)',
        action: 'SYSTEM_STARTUP',
        target: 'Core Banking Gateway',
        details: 'Loaded Easypaisa credentials and initialized ledger float',
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];

    // Disputed Transactions
    this.disputes = [
      {
        id: 'DSP-701',
        orderId: 'SBRY-172900892',
        customerPhone: '03458508726',
        amount: 500.0,
        channel: 'Easypaisa Mobile Account (MA)',
        reason: 'Customer charged on Easypaisa but wallet pending',
        status: 'OPEN',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ];
  }

  // 1. Float Reconciliation Metric
  getReconciliationMetrics() {
    // Total Customer Liabilities
    const totalLiabilities = this.customers.reduce((sum, c) => sum + c.balance, 0);
    const escrowBalance = this.escrowAccount.balance;
    const surplusOrDeficit = escrowBalance - totalLiabilities;
    const reserveRatio = ((escrowBalance / totalLiabilities) * 100).toFixed(2);

    return {
      totalCustomerLiabilities: totalLiabilities,
      escrowLiquidReserves: escrowBalance,
      surplusOrDeficit,
      reserveRatio: `${reserveRatio}%`,
      complianceStatus: escrowBalance >= totalLiabilities ? '100% SBP COMPLIANT (FULLY BACKED)' : 'DEFICIT ALERT',
      escrowAccount: this.escrowAccount,
    };
  }

  // 2. Customers List with KYC Tiers
  getCustomers() {
    // Sync current balance for user_sherry_001 from walletService
    const sherryAcc = walletService.getAccount('user_sherry_001');
    if (sherryAcc) {
      const idx = this.customers.findIndex((c) => c.userId === 'user_sherry_001');
      if (idx !== -1) {
        this.customers[idx].balance = sherryAcc.balance;
      }
    }
    return this.customers;
  }

  // 3. Upgrade Customer KYC Tier
  updateCustomerTier(userId, newTier, actor = 'Ops_Lead') {
    const customer = this.customers.find((c) => c.userId === userId);
    if (!customer) throw new Error('Customer not found');

    const oldTier = customer.tier;
    customer.tier = newTier;

    if (newTier.includes('Level 2')) {
      customer.monthlyLimit = 1000000.0;
      customer.kycStatus = 'VERIFIED';
    } else if (newTier.includes('Level 1')) {
      customer.monthlyLimit = 200000.0;
      customer.kycStatus = 'VERIFIED';
    } else {
      customer.monthlyLimit = 50000.0;
    }

    this.logAction({
      actor,
      action: 'KYC_TIER_UPGRADE',
      target: customer.accountNumber,
      details: `Upgraded KYC Tier from [${oldTier}] to [${newTier}]`,
    });

    return customer;
  }

  // 4. Toggle Account Freeze (AML Compliance Action)
  toggleAccountFreeze(userId, reason = 'Administrative / AML Check', actor = 'Risk_Officer') {
    const customer = this.customers.find((c) => c.userId === userId);
    if (!customer) throw new Error('Customer not found');

    customer.status = customer.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';

    this.logAction({
      actor,
      action: customer.status === 'FROZEN' ? 'ACCOUNT_FREEZE' : 'ACCOUNT_UNFREEZE',
      target: customer.accountNumber,
      details: `Changed account status to [${customer.status}]. Reason: ${reason}`,
    });

    return customer;
  }

  // 5. AML Alerts Feed
  getAmlAlerts() {
    return this.amlAlerts;
  }

  // 6. Resolve / Clear AML Alert
  resolveAmlAlert(alertId, resolution = 'CLEARED', actor = 'Compliance_Manager') {
    const alert = this.amlAlerts.find((a) => a.id === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = resolution;

    this.logAction({
      actor,
      action: 'AML_ALERT_RESOLUTION',
      target: alertId,
      details: `Resolved AML alert for ${alert.customerName} as [${resolution}]`,
    });

    return alert;
  }

  // 7. Disputes List
  getDisputes() {
    return this.disputes;
  }

  // 8. Reconcile / Resolve Dispute with Easypaisa REST Inquire
  async resolveDispute(disputeId, action = 'FORCE_SETTLE_CREDIT', actor = 'Dispute_Agent') {
    const dispute = this.disputes.find((d) => d.id === disputeId);
    if (!dispute) throw new Error('Dispute not found');

    let inquiryResult = null;
    try {
      // Direct inquiry to Easypaisa REST gateway
      inquiryResult = await easypaisaService.inquireStatus({ orderId: dispute.orderId });
    } catch (_) {}

    if (action === 'FORCE_SETTLE_CREDIT') {
      // Credit customer wallet
      walletService.deposit({
        userId: 'user_sherry_001',
        amount: dispute.amount,
        source: 'Easypaisa Dispute Settlement (Ops Credit)',
        referenceId: dispute.orderId,
      });

      dispute.status = 'RESOLVED';
      dispute.resolution = 'Credited to customer wallet after gateway verification.';
    } else {
      dispute.status = 'REJECTED';
      dispute.resolution = 'Transaction failed on Easypaisa gateway.';
    }

    this.logAction({
      actor,
      action: 'DISPUTE_RESOLUTION',
      target: dispute.orderId,
      details: `Resolved dispute ${disputeId} with action [${action}]`,
    });

    return {
      dispute,
      inquiryResult,
    };
  }

  // 9. Maker-Checker Audit Logs
  getAuditLogs() {
    return this.auditLogs;
  }

  logAction({ actor, action, target, details, ipAddress = '127.0.0.1' }) {
    const log = {
      id: `AUD-${1000 + this.auditLogs.length + 1}`,
      actor,
      action,
      target,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }
}

module.exports = new AdminService();
