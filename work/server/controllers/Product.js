const ProductService = require('../services/Product.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');

class ProductController {
  static async getAllProduct(req, res) {
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;
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

  static async addProduct(req, res) {
    console.log('ReQ.BODY', req.body);
    const {
      version,
      density,
      form,
      certificate,
      width,
      lengths,
      height,
      tradingMark,
      m3,
      m2,
      m,
      widthInArray,
      m3InArray,
      densityInDryMax,
      dinsityInDryDef,
      humidity,
      densityHumidityMax,
      densityHuminityDef,
      weightMax,
      weightDef,
      normOfBrack,
      coefficientOfFree,
    } = req.body.products;
    const fingerprint = req.fingerprint.hash;
    const { id, username, email } = req.user;

    try {

      const { accessToken, refreshToken, accessTokenExpiration, products } =
        await ProductService.addNewProduct({
          id,
          username,
          email,
          fingerprint: fingerprint.hash,
        });
      return res
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN)
        .status(200)
        .json({ products, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

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
