const axios = require('axios');
const easypaisaConfig = require('../config/easypaisa.config');

class EasypaisaService {
  /**
   * Helper to create HTTP client with proper Easypaisa Headers
   */
  static getClient() {
    const credentials = easypaisaConfig.getEasypaisaAuthHeader();
    return axios.create({
      baseURL: easypaisaConfig.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Credentials': credentials,
      },
      timeout: 25000, // 25s timeout
    });
  }

  /**
   * 1. Initiate Mobile Account (MA) Transaction
   * Triggers a push prompt / USSD popup on customer's phone to enter their Easypaisa PIN
   */
  static async initiateMobileAccount({
    orderId,
    amount,
    mobileAccountNo,
    emailAddress = 'support@sherrybank.com',
    optional1 = '',
    optional2 = '',
    optional3 = '',
    optional4 = '',
    optional5 = '',
  }) {
    const payload = {
      orderId: String(orderId),
      storeId: String(easypaisaConfig.storeId),
      transactionAmount: String(amount),
      transactionType: 'MA',
      mobileAccountNo: String(mobileAccountNo),
      emailAddress,
      optional1,
      optional2,
      optional3,
      optional4,
      optional5,
    };

    try {
      const client = this.getClient();
      const response = await client.post(easypaisaConfig.endpoints.initiateMA, payload);
      return {
        success: response.data.responseCode === '0000',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response ? error.response.data : error.message,
      };
    }
  }

  /**
   * 2. Initiate Over The Counter (OTC) Transaction
   * Generates a token that customer can pay at any Easypaisa retailer shop
   */
  static async initiateOTC({
    orderId,
    amount,
    msisdn,
    emailAddress = 'support@sherrybank.com',
    tokenExpiry,
  }) {
    // If tokenExpiry is not provided, default to +24 hours format: yyyymmdd HHmmss
    let expiry = tokenExpiry;
    if (!expiry) {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const pad = (n) => String(n).padStart(2, '0');
      expiry = `${tomorrow.getFullYear()}${pad(tomorrow.getMonth() + 1)}${pad(tomorrow.getDate())} ${pad(tomorrow.getHours())}${pad(tomorrow.getMinutes())}${pad(tomorrow.getSeconds())}`;
    }

    const payload = {
      orderId: String(orderId),
      storeId: String(easypaisaConfig.storeId),
      transactionAmount: String(amount),
      transactionType: 'OTC',
      msisdn: String(msisdn),
      emailAddress,
      tokenExpiry: expiry,
    };

    try {
      const client = this.getClient();
      const response = await client.post(easypaisaConfig.endpoints.initiateOTC, payload);
      return {
        success: response.data.responseCode === '0000',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response ? error.response.data : error.message,
      };
    }
  }

  /**
   * 3. Inquire Transaction Status
   * Verifies if an order has been PAID, PENDING, FAILED, EXPIRED, etc.
   */
  static async inquireStatus({ orderId }) {
    const payload = {
      orderId: String(orderId),
      storeId: String(easypaisaConfig.storeId),
      accountNum: String(easypaisaConfig.accountNum),
    };

    try {
      const client = this.getClient();
      const response = await client.post(easypaisaConfig.endpoints.inquireTransaction, payload);
      return {
        success: response.data.responseCode === '0000',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response ? error.response.data : error.message,
      };
    }
  }
}

module.exports = EasypaisaService;
