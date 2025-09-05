const { ValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err);

  let status = err.status || 500;
  let message = err.message || 'Server Error';

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    status = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Handle JWT errors
  if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Invalid token';
  }

  // Send structured error
  res.status(status).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
