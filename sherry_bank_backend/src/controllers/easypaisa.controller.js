const easypaisaService = require('../services/easypaisa.service');
const walletService = require('../services/wallet.service');

/**
 * 1. Initiate Easypaisa Mobile Account (MA) Transaction
 */
const initiateMA = async (req, res, next) => {
  try {
    const { amount, mobileAccountNo, emailAddress } = req.body;

    if (!amount || !mobileAccountNo) {
      return res.status(400).json({
        success: false,
        message: 'amount and mobileAccountNo are required.',
      });
    }

    // Generate unique order ID for Sherry Bank
    const orderId = `SBRY-${Date.now()}`;

    const result = await easypaisaService.initiateMobileAccount({
      orderId,
      amount,
      mobileAccountNo,
      emailAddress: emailAddress || 'customer@sherrybank.com',
    });

    return res.status(200).json({
      success: result.success,
      orderId,
      result: result.data || result.error,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Initiate Easypaisa Over The Counter (OTC) Transaction
 */
const initiateOTC = async (req, res, next) => {
  try {
    const { amount, msisdn, emailAddress, tokenExpiry } = req.body;

    if (!amount || !msisdn) {
      return res.status(400).json({
        success: false,
        message: 'amount and msisdn are required.',
      });
    }

    const orderId = `SBRY-${Date.now()}`;

    const result = await easypaisaService.initiateOTC({
      orderId,
      amount,
      msisdn,
      emailAddress: emailAddress || 'customer@sherrybank.com',
      tokenExpiry,
    });

    return res.status(200).json({
      success: result.success,
      orderId,
      result: result.data || result.error,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Inquire Transaction Status & reconcile wallet balance if PAID
 */
const inquireStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'orderId parameter is required.',
      });
    }

    const result = await easypaisaService.inquireStatus({ orderId });

    // If status is PAID, reconcile with wallet ledger
    if (result.success && result.data && result.data.transactionStatus === 'PAID') {
      const amount = parseFloat(result.data.transactionAmount);
      walletService.deposit({
        userId: 'user_sherry_001',
        amount,
        source: `Easypaisa ${result.data.paymentMode || 'MA'}`,
        referenceId: orderId,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initiateMA,
  initiateOTC,
  inquireStatus,
};
