const AuthService = require('../services/Auth.js');
const TokenService = require('../services/Token.js');
const RefreshSessionRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION, COOKIE_SETTINGS } = require('../constants.js');
const { ErrorUtils, Unauthorized } = require('../utils/Errors.js');

const getSafeUser = (user) => {
  const plainUser =
    typeof user?.get === 'function' ? user.get({ plain: true }) : user;

  return {
    id: plainUser.id,
    username: plainUser.username,
    email: plainUser.email,
    role: plainUser.role,
  };
};

const saveSession = (req) =>
  new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

const destroySession = (req) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

class AuthController {
  static async signIn(req, res) {
    const { password, email } = req.body.user;

    try {
      const userData = await AuthService.signIn({
        password,
        email,
      });

      const user = getSafeUser(userData);
      const fingerprint = req.fingerprint.hash;

      const { accessToken, refreshToken } = await TokenService.getTokens(
        user,
        fingerprint,
      );

      req.session.user = user;
      await saveSession(req);

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .json({
          user,
          accessToken,
          accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
        });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { username, password, email, role } = req.body.user;

    try {
      const userData = await AuthService.signUp({
        username,
        password,
        email,
        role,
      });

      const user = getSafeUser(userData);
      const fingerprint = req.fingerprint.hash;

      const { accessToken, refreshToken } = await TokenService.getTokens(
        user,
        fingerprint,
      );

      req.session.user = user;
      await saveSession(req);

      return res
        .status(201)
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .json({
          user,
          accessToken,
          accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
        });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async checkUser(req, res) {
    try {
      if (!req.session?.user) {
        throw new Unauthorized('User is not authorized');
      }

      return res.status(200).json({
        user: req.session.user,
      });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const oldRefreshToken = req.cookies?.refreshToken;

    try {
      if (!oldRefreshToken) {
        throw new Unauthorized('Refresh token is missing');
      }

      const storedSession = await RefreshSessionRepository.getRefreshSession(
        oldRefreshToken,
      );

      if (!storedSession) {
        throw new Unauthorized('Refresh session not found');
      }

      let decodedToken;

      try {
        decodedToken = await TokenService.verifyRefreshToken(oldRefreshToken);
      } catch {
        await RefreshSessionRepository.deleteRefreshSession(oldRefreshToken);
        throw new Unauthorized('Refresh token is invalid or expired');
      }

      const fingerprint = req.fingerprint.hash;

      if (
        storedSession.user_id !== decodedToken.id ||
        storedSession.finger_print !== fingerprint
      ) {
        throw new Unauthorized('Refresh session does not match');
      }

      const user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      const { accessToken, refreshToken } = await TokenService.getTokens(
        user,
        fingerprint,
      );

      await RefreshSessionRepository.deleteRefreshSession(oldRefreshToken);

      req.session.user = user;
      await saveSession(req);

      return res
        .status(200)
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .json({
          user,
          accessToken,
          accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
        });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    try {
      if (refreshToken) {
        await RefreshSessionRepository.deleteRefreshSession(refreshToken);
      }

      if (req.session) {
        await destroySession(req);
      }

      const { maxAge, ...refreshCookieSettings } = COOKIE_SETTINGS.REFRESH_TOKEN;

      res.clearCookie('refreshToken', refreshCookieSettings);
      res.clearCookie('sesid');

      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
