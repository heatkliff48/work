const ProductService = require('../services/Product.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class ProductController {
  static async getAllProduct(req, res) {
    const fingerprint = req.fingerprint.hash;

    const { id, username, email } = req.body.user;
    try {
      const { accessToken, refreshToken, accessTokenExpiration, products } =
        await ProductService.getAllProduct({ id, username, email, fingerprint });

      console.log('ProductController>>>>>>>>>>', products);
      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ products, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  // static async addProduct(req, res) {
  //   const { username, password, email } = req.body.user;
  //   const { fingerprint } = req;
  //   try {
  //     const { accessToken, refreshToken, accessTokenExpiration, user } =
  //       await ProductService.signUp({
  //         username,
  //         password,
  //         email,
  //         fingerprint: fingerprint.hash,
  //       });
  //     return res
  //       .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
  //       .status(200)
  //       .json({ user, accessToken, accessTokenExpiration });
  //   } catch (err) {
  //     return ErrorUtils.catchError(res, err);
  //   }
  // }

  // static async delProduct(req, res) {
  //   const { fingerprint } = req;
  //   const refreshToken = req.cookies.refreshToken;
  //   try {
  //     await ProductService.logOut(refreshToken);

  //     return res.clearCookie('refreshToken').sendStatus(200);
  //   } catch (err) {
  //     return ErrorUtils.catchError(res, err);
  //   }
  // }
}

module.exports = ProductController;
