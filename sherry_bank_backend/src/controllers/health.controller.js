const env = require('../config/env');

const checkHealth = (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'Sherry Bank Core API Gateway',
    version: '1.0.0',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    services: {
      coreLedger: 'UP',
      easypaisaGateway: 'CONFIGURED',
      easypaisaEnvironment: env.easypaisa.baseUrl.includes('easypaystg') ? 'STAGING' : 'PRODUCTION',
    },
  });
};

module.exports = {
  checkHealth,
};
