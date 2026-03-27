const ProductService = require('../services/Product.js');
const { ErrorUtils } = require('../utils/Errors.js');
const { COOKIE_SETTINGS } = require('../constants.js');
const myEmitter = require('../src/ee.js');
const {
  ADD_NEW_PRODUCT_SOCKET,
  UPDATE_PRODUCT_SOCKET,
  REPAIR_PRODUCT_SOCKET,
  ADD_NEW_PRODUCTION_QUALITY_SOCKET,
  ADD_NEW_DIMENSIONS_QUALITY_SOCKET,
  ADD_NEW_COMPRESSIONS_QUALITY_SOCKET,
  UPDATE_COMPRESSIONS_QUALITY_SOCKET,
  UPDATE_DIMENSIONS_QUALITY_SOCKET,
} = require('../src/constants/event.js');

class ProductController {
  static async getAllProduct(req, res) {
    try {
      const products = await ProductService.getAllProduct();

      return res.status(200).json({ products });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addProduct(req, res) {
    const product = req.body;

    try {
      const products = await ProductService.addNewProduct(product);

      myEmitter.emit(ADD_NEW_PRODUCT_SOCKET, products);
      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateProduct(req, res) {
    // const product = req.body;

    try {
      const products = await ProductService.updateProduct();

      myEmitter.emit(UPDATE_PRODUCT_SOCKET, products);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async repairProductData(req, res) {
    const repProduct = req.body;

    try {
      await ProductService.repairProductData(repProduct);

      myEmitter.emit(REPAIR_PRODUCT_SOCKET, repProduct);

      return res.status(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  //PRODUCTION QUALITY
  static async getAllProductionQuality(req, res) {
    try {
      const products_quantyties =
        await ProductService.getAllProductionQuality();

      return res.status(200).json(products_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewProductionQuality(req, res) {
    const production_quantyties = req.body;
    try {
      const new_production_quantyties =
        await ProductService.addNewProductionQuality(production_quantyties);
      myEmitter.emit(
        ADD_NEW_PRODUCTION_QUALITY_SOCKET,
        new_production_quantyties,
      );
      return res.status(200).json(new_production_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  //DIMENSION QUALITY
  static async getAllDimensionsQuality(req, res) {
    try {
      const products_quantyties =
        await ProductService.getAllDimensionsQuality();

      return res.status(200).json(products_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewDimensionsQuality(req, res) {
    const production_quantyties = req.body;
    try {
      const new_production_quantyties =
        await ProductService.addNewDimensionsQuality(production_quantyties);
      myEmitter.emit(
        ADD_NEW_DIMENSIONS_QUALITY_SOCKET,
        new_production_quantyties,
      );
      return res.status(200).json(new_production_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateDimensionsQuality(req, res) {
    const production_quantyties = req.body;
    try {
      const new_production_quantyties =
        await ProductService.updateDimensionsQuality(production_quantyties);

      myEmitter.emit(
        UPDATE_DIMENSIONS_QUALITY_SOCKET,
        new_production_quantyties,
      );
      return res.status(200).json(new_production_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  //COMPRESSIONS QUALITY
  static async getAllCompressionsQuality(req, res) {
    try {
      const products_quantyties =
        await ProductService.getAllCompressionsQuality();

      return res.status(200).json(products_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async addNewCompressionsQuality(req, res) {
    console.log('req.body Product.js line 126', req.body);
    const production_quantyties = req.body;
    try {
      const new_production_quantyties =
        await ProductService.addNewCompressionsQuality(production_quantyties);

      myEmitter.emit(
        ADD_NEW_COMPRESSIONS_QUALITY_SOCKET,
        new_production_quantyties,
      );
      return res.status(200).json(new_production_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async updateCompressionsQuality(req, res) {
    console.log('req.body Product.js line 126', req.body);
    const production_quantyties = req.body;
    try {
      const upd_production_quantyties =
        await ProductService.updateCompressionsQuality(production_quantyties);

      myEmitter.emit(
        UPDATE_COMPRESSIONS_QUALITY_SOCKET,
        upd_production_quantyties,
      );
      return res.status(200).json(upd_production_quantyties);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = ProductController;
