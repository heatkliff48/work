const { Users } = require('../db/models');

class UserRepository {
  static async createUser({ username, email, hashedPassword, role }) {
    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  static async getUserData(email) {
    const currentUser = await Users.findOne({ where: { email } });
    return currentUser ?? null;
  }
}

module.exports = UserRepository;
