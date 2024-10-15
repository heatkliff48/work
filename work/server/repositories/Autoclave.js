const { Autoclaves } = require('../db/models');

class AutoclavesRepository {
  static async getAutoclave() {
    const autoclave = await Autoclaves.findAll();
    return autoclave;
  }

  static async saveAutoclave(autoclave) {
    let count = 1;
    for (let i = 0; i < autoclave.length; i++) {
      for (let j = 0; j < autoclave[i].length; j++) {
        if (!autoclave[i][j].id) continue;
        await Autoclaves.update(
          {
            id_list_of_ordered_product: autoclave[i][j].id,
            status_batch: 0,
            quality_check: 0,
          },
          {
            where: {
              id: count,
            },
          }
        );
        count++;
      }
    }

    return;
  }
}

module.exports = AutoclavesRepository;
