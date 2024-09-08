require('dotenv').config();
const bcrypt = require('bcryptjs');
const TokenService = require('./Token.js');
const {
  NotFound,
  Forbidden,
  Conflict,
  Unauthorized,
} = require('../utils/Errors.js');
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
      role: userData.role,
    };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

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

    const payload = { id: user.id, username, email, role };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async logOut() {
    // static async logOut(refreshToken) {
    // await RefreshSessionsRepository.deleteRefreshSession(refreshToken);
    
  }
}

module.exports = AuthService;
