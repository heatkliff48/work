const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const {
  NotFound,
  Forbidden,
  Conflict,
  Unauthorized,
} = require('../utils/Errors.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const UserRepository = require('../repositories/User.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');

class AuthService {
  static async signIn({ email, password, fingerprint }) {
    const userData = await UserRepository.getUserData(email);

    if (!userData) throw new NotFound('Пользователь не найден');

    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    if (!isPasswordValid) throw new Unauthorized('Неверный логин или пароль');

    const payload = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };
    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: userData.id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });
    return {
      user: userData,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async signUp({ username, email, password, fingerprint, role }) {
    const userData = await UserRepository.getUserData(email);
    if (userData) {
      throw new Conflict('Пользователь с такой почтой уже существует.');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await UserRepository.createUser({
      username,
      email,
      hashedPassword,
      role,
    });

    const payload = { id: user.id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: user.id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });
    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async logOut(refreshToken) {
    await RefreshSessionsRepository.deleteRefreshSession(refreshToken);
  }

  static async refresh({ currentRefreshToken, fingerprint }) {
    if (!currentRefreshToken) {
      throw new Unauthorized();
    }
    const refreshSession = await RefreshSessionsRepository.getRefreshSession(
      currentRefreshToken
    );

    if (!refreshSession) throw new Unauthorized();

    if (refreshSession.finger_print !== fingerprint.hash) throw new Forbidden();

    await RefreshSessionsRepository.deleteRefreshSession(currentRefreshToken);
  }
}

module.exports = AuthService;
