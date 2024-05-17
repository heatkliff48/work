const AuthService = require('../services/Auth.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class AuthController {
  static async signIn(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { username, password, email } = req.body.user;
    const { fingerprint } = req;
    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await AuthService.signUp({
          username,
          password,
          email,
          fingerprint: fingerprint.hash,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    try {
      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
