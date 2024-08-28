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
    const token = authHeader?.split(' ')?.[1];

    console.log('>>>>>>.CHECK.<<<<<<<<', token);
    // Массив путей, которые не требуют токена
    const noTokenPaths = ['/sign-up', '/sign-in', '/logout', '/refresh'];

    // Проверяем, является ли запрос запросом, который не требует токена
    const isNoTokenRequest = noTokenPaths.some((path) => req.path.includes(path));

    if (!token) {
      // Если токен отсутствует, проверяем, является ли запрос запросом, который не требует токена
      if (isNoTokenRequest) {
        // Если это запрос, который не требует токена, разрешаем доступ без токена
        next();
      } else {
        // Если это не запрос, который не требует токена, отклоняем запрос
        next(new Unauthorized());
      }
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          // Если токен недействителен, отклоняем запрос
          console.error('ERROR', err);
          next(new Forbidden(err));
        } else {
          req.user = user;
          console.log('>>>>>>.REQ USER.<<<<<<<<', req.user);
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
