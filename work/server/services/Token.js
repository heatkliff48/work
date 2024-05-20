const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Forbidden, Unauthorized } = require('../utils/Errors.js');
dotenv.config();

class TokenService {
  static async generateAccessToken(payload) {
    const acccessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });
    return acccessToken;
  }

  static async generateRefreshToken(payload) {
    const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '15d',
    });
    return refreshToken;
  }

  static async checkAccess(req, _, next) {}

  static async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }
  static async verifyRefreshToken(refreshToken) {
    return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }
}

module.exports = TokenService;
