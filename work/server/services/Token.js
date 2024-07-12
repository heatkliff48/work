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

  static async checkAccess(req, _, next) {
    const authHeader = req.headers?.authorization;
    console.log('>>>>>>.CHECK.<<<<<<<<', authHeader);
    const token = authHeader?.split(' ')?.[1];
    console.log('req.path.startsWith', req.path);
    // Проверяем, является ли запрос запросом для пользователя
    const isUserRequest =
      req.path.startsWith('/sign-up') ||
      req.path.startsWith('/sign-in') ||
      req.path.startsWith('/loguut');

    if (!token) {
      // Если токен отсутствует, проверяем, является ли запрос запросом для пользователя
      if (isUserRequest) {
        // Если это запрос для пользователя, разрешаем доступ без токена
        next();
      } else {
        // Если это не запрос для пользователя, отклоняем запрос
        next(new Unauthorized());
      }
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          // Если токен недействителен, отклоняем запрос
          next(new Forbidden(err));
        } else {
          req.user = user;
          console.log('>>>>>>.NEXT.<<<<<<<<', req.user);
          next();
        }
      });
    }
  }

  static async verifyAccessToken(accessToken) {
    return await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  }
  static async verifyRefreshToken(refreshToken) {
    return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  }
}

module.exports = TokenService;
