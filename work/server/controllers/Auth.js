const AuthService = require('../services/Auth.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class AuthController {
  static async signIn(req, res) {
    const { password, email } = req.body.user;
    const { fingerprint } = req;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, user } =
        await AuthService.signIn({
          password,
          email,
          fingerprint: fingerprint.hash,
        });

      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ user, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { username, password, email, role } = req.body.user;
    const { fingerprint } = req;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, user } =
        await AuthService.signUp({
          username,
          password,
          email,
          role,
          fingerprint: fingerprint.hash,
        });
      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ user, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const { fingerprint } = req;
    const refreshToken = req.cookies.refreshToken;
    try {
      await AuthService.logOut(refreshToken);

      return res.clearCookie('refreshToken').sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    const currentRefreshToken = req.cookies.refreshToken;

    try {
      await AuthService.refresh({
        currentRefreshToken,
        fingerprint,
      });
      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
