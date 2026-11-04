const walletService = require('../services/wallet.service');

const getProfile = (req, res) => {
  const account = walletService.getAccount('user_sherry_001');
  if (!account) {
    return res.status(404).json({ success: false, message: 'Account not found' });
  }

  res.status(200).json({
    success: true,
    data: account,
  });
};

const getTransactions = (req, res) => {
  const txns = walletService.getTransactions('user_sherry_001');
  res.status(200).json({
    success: true,
    count: txns.length,
    data: txns,
  });
};

const sendMoney = (req, res, next) => {
  try {
    const { recipient, amount, note } = req.body;
    if (!recipient || !amount) {
      return res.status(400).json({
        success: false,
        message: 'recipient and amount are required.',
      });
    }

    const result = walletService.transfer({
      userId: 'user_sherry_001',
      recipient,
      amount,
      note,
    });

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const mockDeposit = (req, res, next) => {
  try {
    const { amount, source } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'amount is required' });
    }

    const result = walletService.deposit({
      userId: 'user_sherry_001',
      amount,
      source: source || 'Direct Bank Top-up',
    });

    res.status(200).json({
      success: true,
      message: 'Deposit successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  getTransactions,
  sendMoney,
  mockDeposit,
};
