const env = require('./env');

/**
 * Returns the Base64 encoded credentials header required by Easypaisa REST APIs:
 * Format: "Credentials: Base64Encoded(username:password)"
 */
const getEasypaisaAuthHeader = () => {
  const { username, password } = env.easypaisa;
  const rawCreds = `${username}:${password}`;
  const base64Encoded = Buffer.from(rawCreds).toString('base64');
  return base64Encoded;
};

module.exports = {
  baseUrl: env.easypaisa.baseUrl,
  storeId: env.easypaisa.storeId,
  accountNum: env.easypaisa.accountNum,
  getEasypaisaAuthHeader,
  endpoints: {
    initiateOTC: '/initiate-otc-transaction',
    initiateMA: '/initiate-ma-transaction',
    inquireTransaction: '/inquire-transaction',
  },
};
