const StockBalanceRepository = require("../repositories/StockBalance");

class StockBalanceService {
  static async getAllStockBalanceData() {
    const stockBalances = await StockBalanceRepository.getAllStockBalanceData();
    return stockBalances;
  }
  static async addNewStockBalanceData(stock) {
    const newStockBalances = await StockBalanceRepository.addNewStockBalanceData(stock);
    return newStockBalances;
  }
}

module.exports = StockBalanceService;
