// const jwt = require('jsonwebtoken');
const TokenService = require('./Token.js');
const RefreshSessionsRepository = require('../repositories/RefreshSession.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const RolesRepository = require('../repositories/Roles.js');

class RolesService {
  static async getAllRoles({ id, username, email, fingerprint }) {
    const roles = await RolesRepository.getAllRolesData();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

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

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      updRoleData,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async updateActiveRoles({ id, username, email, fingerprint, updActiveRole }) {
    const updActiveRoleData = await RolesRepository.updateActiveRolesData(updActiveRole);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      updActiveRoleData,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async getPagesList({ id, username, email, fingerprint }) {
    const pages = await RolesRepository.getPagesListData();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      pages,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = RolesService;
