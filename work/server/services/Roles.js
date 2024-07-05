// const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RolesRepository = require('../repositories/Roles.js');

class RolesService {
  static async getAllRoles({ id, username, email, fingerprint }) {
    const roles = await RolesRepository.getAllRolesData();
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      roles,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async updateRoles({ id, username, email, fingerprint, updRole }) {
    const updRoleData = await RolesRepository.updateRolesData(updRole);
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      updRoleData,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async getPagesList({ id, username, email, fingerprint }) {
    const pages = await RolesRepository.getPagesListData();
    const payload = { id, username, email };

    const accessToken = await TokenService.generateAccessToken(payload);
    const refreshToken = await TokenService.generateRefreshToken(payload);

    await RefreshSessionsRepository.createRefreshSession({
      user_id: id,
      refresh_token: refreshToken,
      finger_print: fingerprint,
    });

    return {
      pages,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = RolesService;
