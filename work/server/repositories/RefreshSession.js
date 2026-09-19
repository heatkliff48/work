const { Refresh_session } = require('../db/models');

class RefreshSessionRepository {
  static async getRefreshSession(refreshToken) {
    if (!refreshToken) {
      return null;
    }

    return Refresh_session.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
  }

  static async createRefreshSession({
    user_id,
    refresh_token,
    finger_print,
  }) {
    return Refresh_session.create({
      user_id,
      refresh_token,
      finger_print,
    });
  }

  static async deleteRefreshSession(refreshToken) {
    if (!refreshToken) {
      return 0;
    }

    return Refresh_session.destroy({
      where: {
        refresh_token: refreshToken,
      },
    });
  }

  static async deleteUserRefreshSessions(userId) {
    return Refresh_session.destroy({
      where: {
        user_id: userId,
      },
    });
  }
}

module.exports = RefreshSessionRepository;
