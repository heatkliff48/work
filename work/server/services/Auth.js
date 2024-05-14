const dotenv = require ('dotenv');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const TokenService = require ('./Token.js');
const { NotFound, Forbidden, Conflict } = require ('../utils/Errors.js');
const RefreshSessionsRepository = require ('../repositories/RefreshSession.js');
const UserRepository = require ('../repositories/User.js');
const { ACCESS_TOKEN_EXPIRATION } = require ('../constants.js');

class AuthService {
  static async signIn({ userName, password, fingerprint }) {}

  static async signUp({ userName, email, password, fingerprint, role }) {
    const userData = await UserRepository.getUserData(email);

    if (userData) throw new Conflict('Пользователь с такой почтой уже существует.');

    const hashedPassword = bcrypt.hashSync(password, process.env.SALT);
    const { id } = await UserRepository.createUser({
      userName,
      email,
      hashedPassword,
      role,
    });
    const payload = { id, email, role };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);
    await RefreshSessionsRepository.createRefreshSession(
      id,
      refreshToken,
      fingerprint
    );
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
