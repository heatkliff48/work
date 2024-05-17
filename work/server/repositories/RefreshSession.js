const { Refresh_session } = require('../db/models');

class RefreshSessionRepository {
  static async getRefreshSession(refreshToken) {}

  static async createRefreshSession({ user_id, refresh_token, finger_print }) {

    await Refresh_session.create({ user_id, refresh_token, finger_print });
  }

  static async deleteRefreshSession(refreshToken) {}
}

module.exports = RefreshSessionRepository;
