const AuthService = require('../services/Auth.js');
const { ErrorUtils } = require('../utils/Errors.js');

class AuthController {
  static async signIn(req, res) {
    const { password, email } = req.body.user;
    try {
      const user = await AuthService.signIn({
        password,
        email,
      });

      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({ user });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { username, password, email, role } = req.body.user;
    try {
      const user = await AuthService.signUp({
        username,
        password,
        email,
        role,
      });

      req.session.user = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({ user });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    try {
      req.session.destroy();
      res.clearCookie('sesid');

      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
