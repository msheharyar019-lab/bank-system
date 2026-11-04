/**
 * Sherry Bank Core Wallet & Ledger Service
 * Simulates enterprise double-entry ledger bookkeeping.
 */
class WalletService {
  constructor() {
    // Default demo customer account for development & testing
    this.accounts = new Map([
      [
        'user_sherry_001',
        {
          userId: 'user_sherry_001',
          accountNumber: 'PK88SHRY00192837465',
          holderName: 'Sheharyar Khan',
          phoneNumber: '03001234567',
          balance: 75000.0,
          currency: 'PKR',
          tier: 'Enterprise Verified',
        },
      ],
    ]);

    // Transaction history ledger
    this.transactions = [
      {
        id: 'TXN-982103',
        userId: 'user_sherry_001',
        type: 'CREDIT',
        title: 'Salary Deposit',
        source: 'Standard Chartered Direct',
        amount: 50000.0,
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        reference: 'SCB-PK-98127391',
      },
      {
        id: 'TXN-982104',
        userId: 'user_sherry_001',
        type: 'DEBIT',
        title: 'Electricity Bill',
        source: 'IESCO Bill Payment',
        amount: 8500.0,
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        reference: 'IESCO-09182309',
      },
    ];
  }

  getAccount(userId = 'user_sherry_001') {
    return this.accounts.get(userId) || null;
  }

  getBalance(userId = 'user_sherry_001') {
    const account = this.getAccount(userId);
    return account ? account.balance : 0;
  }

  getTransactions(userId = 'user_sherry_001') {
    return this.transactions.filter((tx) => tx.userId === userId);
  }

  /**
   * Deposit money into Sherry Bank (e.g. from Easypaisa MA / OTC)
   */
  deposit({ userId = 'user_sherry_001', amount, source = 'Easypaisa Deposit', referenceId }) {
    const account = this.getAccount(userId);
    if (!account) throw new Error('Account not found');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid deposit amount');
    }

    account.balance += numericAmount;

    const transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      userId,
      type: 'CREDIT',
      title: 'Easypaisa Top-up',
      source,
      amount: numericAmount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      reference: referenceId || `EP-${Date.now()}`,
    };

    this.transactions.unshift(transaction);

    return {
      success: true,
      newBalance: account.balance,
      transaction,
    };
  }

  /**
   * Send money to another bank or phone number
   */
  transfer({ userId = 'user_sherry_001', recipient, amount, note = '' }) {
    const account = this.getAccount(userId);
    if (!account) throw new Error('Account not found');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid transfer amount');
    }

    if (account.balance < numericAmount) {
      throw new Error('Insufficient balance');
    }

    account.balance -= numericAmount;

    const transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      userId,
      type: 'DEBIT',
      title: `Transfer to ${recipient}`,
      source: 'Sherry Bank Instant Transfer',
      amount: numericAmount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
      reference: `TRF-${Date.now()}`,
      note,
    };

    this.transactions.unshift(transaction);

    return {
      success: true,
      newBalance: account.balance,
      transaction,
    };
  }
}

module.exports = new WalletService();
