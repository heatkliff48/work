const { StockBalances } = require('../db/models');

class StockBalanceRepository {
  static async getAllStockBalanceData() {
    const stockBalances = await StockBalances.findAll();
    return stockBalances;
  }
  static async addNewStockBalanceData(stock) {
    const newStockBalances = await StockBalances.create(stock);
    return newStockBalances;
  }
}

module.exports = StockBalanceRepository;
