import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false);
  }

  const response = {
    success: false,
    error: {
      message: error.message,
    },
  };

  if (config.nodeEnv === 'development' && error.statusCode === 500) {
    response.error.stack = error.stack;
  }

  if (error.errors) {
    response.error.errors = error.errors;
  }

  res.status(error.statusCode).json(response);
};
