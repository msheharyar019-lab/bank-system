const app = require('./src/app');
const env = require('./src/config/env');

const PORT = env.port;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🏦  SHERRY BANK CORE API GATEWAY STARTED`);
  console.log(`📡  Server listening on: http://localhost:${PORT}`);
  console.log(`🔍  Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡  Easypaisa Environment: ${env.easypaisa.baseUrl}`);
  console.log(`👤  Easypaisa Merchant: ${env.easypaisa.username}`);
  console.log('====================================================');
});
