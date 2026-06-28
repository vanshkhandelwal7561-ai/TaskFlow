class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const createError = (statusCode, message) => new ApiError(statusCode, message);

module.exports = { ApiError, createError };
