const { ClientsPriceInfos } = require('../db/models');

class ClientsRepository {
  static async getClientsPriceInfo() {
    const clientsPriceInfos = await ClientsPriceInfos.findAll();
    return clientsPriceInfos;
  }

  static async updClientsPriceInfo(updClient) {
    if (!Array.isArray(updClient) || updClient.length === 0) {
      throw new Error('No update data has been sent');
    }

    for (const item of updClient) {
      try {
        const { client_type, discont, title } = item;

        const existingRecord = await ClientsPriceInfos.findOne({
          where: {
            client_type,
            title,
          },
        });

        if (existingRecord) {
          await existingRecord.update({
            discont: parseFloat(discont) || 0,
            updatedAt: new Date(),
          });
        } else {
          await ClientsPriceInfos.create(item);
        }
      } catch (error) {
        console.log('=========ERROR=========', error);
      }
    }
    return;
  }
}

module.exports = ClientsRepository;
