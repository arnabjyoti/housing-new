const jwt = require('jsonwebtoken');

// 15 days in seconds: 15 * 24 * 60 * 60 = 1,296,000
const FIFTEEN_DAYS_IN_SECONDS = 15 * 24 * 60 * 60;
const JWT_SECRET = process.env.JWT_SECRET || 'udhousing_jwt_secure_secret_key_2024_15d';

/**
 * Generate a JWT token with 15 days expiration
 * @param {Object} payload User details (id, email, role, etc.)
 * @returns {String} Signed JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15d' // 15 days auto-expire
  });
}

/**
 * Express middleware to verify JWT token and handle 15-day expiration
 */
function verifyToken(req, res, next) {
  let token = null;

  // Extract from Authorization header: "Bearer <token>"
  if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    } else {
      token = req.headers.authorization;
    }
  } else if (req.headers['x-access-token']) {
    token = req.headers['x-access-token'];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).send({
      status: false,
      message: 'Access Denied: Authentication token is required.',
      code: 'NO_TOKEN'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
          status: false,
          message: 'Your session has expired after 15 days. Please log in again.',
          code: 'TOKEN_EXPIRED',
          expired: true,
          expiredAt: err.expiredAt
        });
      }
      return res.status(401).send({
        status: false,
        message: 'Invalid authentication token.',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = decoded;
    return next();
  });
}

module.exports = {
  JWT_SECRET,
  FIFTEEN_DAYS_IN_SECONDS,
  generateToken,
  verifyToken
};
