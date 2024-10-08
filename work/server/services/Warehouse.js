const TokenService = require('./Token.js');
const { ACCESS_TOKEN_EXPIRATION } = require('../constants.js');
const WarehouseRepository = require('../repositories/Warehouse.js');

class WarehouseService {
  static async getAllWarehouse({ id, username, email, fingerprint }) {
    const warehouse = await WarehouseRepository.getAllWarehouse();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      warehouse,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async getListOfOrderedProduction({ id, username, email, fingerprint }) {
    const orderedProduction = await WarehouseRepository.getListOfOrderedProduction();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      orderedProduction,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async getListOfReservedProductsOEM({ id, username, email, fingerprint }) {
    const orderedProductionOEM =
      await WarehouseRepository.getListOfReservedProductsOEM();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      orderedProductionOEM,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async getListOfReservedProducts({ id, username, email, fingerprint }) {
    const listOfReservedProducts =
      await WarehouseRepository.getListOfReservedProducts();
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      listOfReservedProducts,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewWarehouse({ id, username, email, fingerprint, warehouse }) {
    const new_warehouse = await WarehouseRepository.addNewWarehouse(warehouse);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      new_warehouse,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewListOfOrderedProduction({
    id,
    username,
    email,
    fingerprint,
    orderedProduction,
  }) {
    const new_ordered_production =
      await WarehouseRepository.addNewListOfOrderedProduction(orderedProduction);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      new_ordered_production,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewListOfOrderedProductionOEM({
    id,
    username,
    email,
    fingerprint,
    orderedProductionOEM,
  }) {
    const new_ordered_production_OEM =
      await WarehouseRepository.addNewListOfOrderedProductionOEM(
        orderedProductionOEM
      );
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      new_ordered_production_OEM,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async updateRemainingStock({
    id,
    username,
    email,
    fingerprint,
    upd_rem_srock,
  }) {
    await WarehouseRepository.updateRemainingStock(upd_rem_srock);
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async addNewReservedProducts({
    id,
    username,
    email,
    fingerprint,
    reserved_product,
  }) {
    const new_reserved_product = await WarehouseRepository.addNewReservedProducts(
      reserved_product
    );
    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      new_reserved_product,
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }

  static async deleteReservedProducts({
    id,
    username,
    email,
    fingerprint,
    reserved_products_id,
  }) {
    await WarehouseRepository.deleteReservedProducts(reserved_products_id);

    const payload = { id, username, email };

    const { accessToken, refreshToken } = await TokenService.getTokens(
      payload,
      fingerprint
    );

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: ACCESS_TOKEN_EXPIRATION,
    };
  }
}

module.exports = WarehouseService;
