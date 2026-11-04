require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'sherry_bank_secret',
  easypaisa: {
    baseUrl: process.env.EASYPAISA_BASE_URL || 'https://easypaystg.easypaisa.com.pk/easypay-service/rest/v4',
    username: process.env.EASYPAISA_USERNAME || '',
    password: process.env.EASYPAISA_PASSWORD || '',
    storeId: process.env.EASYPAISA_STORE_ID || '43',
    accountNum: process.env.EASYPAISA_ACCOUNT_NUM || '654123987',
  },
};

module.exports = env;
