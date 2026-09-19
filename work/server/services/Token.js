const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Unauthorized } = require('../utils/Errors.js');
const RefreshSessionRepository = require('../repositories/RefreshSession.js');

dotenv.config();

const PUBLIC_PATHS = new Set([
  '/auth/sign-up',
  '/auth/sign-in',
  '/auth/logout',
  '/auth/refresh',
]);

class TokenService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }

  static async checkAccess(req, res, next) {
    const requestPath = req.path.replace(/\/+$/, '') || '/';

    if (req.method === 'OPTIONS' || PUBLIC_PATHS.has(requestPath)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    const tokenMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
    const accessToken = tokenMatch?.[1];

    if (!accessToken) {
      return next(new Unauthorized('Access token is missing'));
    }

    try {
      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      req.user = user;

      // Сессия остаётся нужна для авторизации WebSocket.
      req.session.user = user;

      return next();
    } catch (err) {
      console.error('Access token verification error:', err.message);

      return next(new Unauthorized('Access token is invalid or expired'));
    }
  }

  static verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }

  static verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }

  static async getTokens(payload, fingerprint) {
    const tokenPayload = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    await RefreshSessionRepository.createRefreshSession({
      user_id: tokenPayload.id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = TokenService;
