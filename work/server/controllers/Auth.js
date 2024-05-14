const { AuthService } = require('../services/Auth.js');
const { ErrorsUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class AuthController {
  static async signIn(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { username, password, role } = req.bode;
    const { fingerprint } = req;
    try {
      const { access_token, refresh_token, accessTokenExpiration } =
        await AuthService.signUp({ username, password, role, fingerprint });
      res.cookie('refresh_token', refresh_token, COOKIE_SETTINGS.REFRESH_TOKEN);
      return res.sendStatus(200).json({ access_token, accessTokenExpiration });
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorsUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
