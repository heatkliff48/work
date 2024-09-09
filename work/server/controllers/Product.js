const ProductService = require('../services/Product.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
} = require('../src/constants/event.js');

class ProductController {
  static async getAllProduct(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, products } =
        await ProductService.getAllProduct({ id, username, email, fingerprint });

      return res.status(200).json({ products });
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ products, accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addProduct(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const { product } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, products } =
        await ProductService.addNewProduct({
          id,
          username,
          email,
          fingerprint,
          product,
        });

      myEmitter.emit(ADD_NEW_PRODUCT_SOCKET, products);
      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateProduct(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.session.user;
    const { product } = req.body;

    try {
      const { accessToken, refreshToken, accessTokenExpiration, products } =
        await ProductService.updateProduct({
          id,
          username,
          email,
          fingerprint,
          product,
        });

      myEmitter.emit(UPDATE_PRODUCT_SOCKET, products);

      return res.status(200);
      // .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
      // .json({ products, accessToken, accessTokenExpiration })
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  // static async delProduct(req, res) {
  //   const { fingerprint } = req;
  // const refreshToken = req.cookies.refreshToken;
  //   try {
  //     await ProductService.logOut(refreshToken);

  //     return res.clearCookie('refreshToken').sendStatus(200);
  //   } catch (err) {
  //     return ErrorUtils.catchError(res, err);
  //   }
  // }
}

module.exports = ProductController;
