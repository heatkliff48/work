const { Refresh_session } = require('../db/models');

class RefreshSessionRepository {
  static async getRefreshSession(refreshToken) {
    const refresh_token = await Refresh_session.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!refresh_token) return null;
    return refresh_token;
  }

  static async createRefreshSession({ user_id, refresh_token, finger_print }) {
    await Refresh_session.create({ user_id, refresh_token, finger_print });
  }

  static async deleteRefreshSession(refreshToken) {
    const deleteToken = await Refresh_session.destroy({
      where: {
        refresh_token: refreshToken,
      },
    });
  }
}

module.exports = RefreshSessionRepository;
