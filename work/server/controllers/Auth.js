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

      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({ user });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ user, accessToken, accessTokenExpiration });
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

      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({ user });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ user, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    // const refreshToken = req.cookies.refreshToken;
    try {
      // await AuthService.logOut(refreshToken);
      req.session.destroy();
      res.clearCookie('sesid');

      return res.sendStatus(200);
      // .clearCookie('refreshToken')
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
