const { Users } = require('../db/models');

class UserRepository {
  static async createUser({ userName, email, hashedPassword, role }) {
    const user = await Users.create({
      userName,
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
