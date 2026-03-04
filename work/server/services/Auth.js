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

class AuthService {
  static async signIn({ email, password }) {
    const userData = await UserRepository.getUserData(email);

    if (!userData) throw new NotFound('User not found');

    const isPasswordValid = bcrypt.compareSync(password, userData.password);

    if (!isPasswordValid)
      throw new Unauthorized('Invalid username or password');

    return userData;
  }

  static async signUp({ username, email, password, role }) {
    const userData = await UserRepository.getUserData(email);
    if (userData) {
      throw new Conflict('The user with this email already exists.');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const user = await UserRepository.createUser({
      username,
      email,
      hashedPassword,
      role,
    });

    return user;
  }
}

module.exports = AuthService;
