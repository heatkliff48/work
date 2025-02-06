const StockBalanceService = require('../services/StockBalance.js');
const { ADD_NEW_STOCK_BALANCE_SOCKET } = require('../src/constants/event.js');
const myEmitter = require('../src/ee.js');

class StockBalanceController {
  static async getAllStockBalanceData(req, res) {
    const stockBalance = await StockBalanceService.getAllStockBalanceData();
    return res.status(200).json(stockBalance);
  }

  static async addNewStockBalanceData(req, res) {
    const stock = req.body;
    const newStockBalance = await StockBalanceService.addNewStockBalanceData(stock);

    myEmitter.emit(ADD_NEW_STOCK_BALANCE_SOCKET, newStockBalance);

    return res.status(200).json(newStockBalance);
  }
}

module.exports = StockBalanceController;
