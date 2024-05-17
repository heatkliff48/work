const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const { NotFound, Forbidden, Conflict } = require('../utils/Errors.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const UserRepository = require('../repositories/User.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');

class AuthService {
  static async signIn({ username, password, fingerprint }) {}

  static async signUp({ username, email, password, fingerprint, role }) {
    const userData = await UserRepository.getUserData(email);
    if (userData) throw new Conflict('Пользователь с такой почтой уже существует.');

    const hashedPassword = bcrypt.hashSync(password, 8);

    const { id } = await UserRepository.createUser({
      username,
      email,
      hashedPassword,
      role,
    });

    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);


    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async logOut(refreshToken) {}

  static async refresh({ fingerprint, currentRefreshToken }) {}
}

module.exports = AuthService;
