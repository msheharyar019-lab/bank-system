const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors()); // Allows Flutter mobile and web apps to access APIs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Main API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Sherry Bank Core API Gateway',
    status: 'ACTIVE',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on Sherry Bank server`,
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
