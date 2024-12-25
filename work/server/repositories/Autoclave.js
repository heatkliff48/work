const { Autoclaves } = require('../db/models');

class AutoclavesRepository {
  static async getAutoclave() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getAutoclave');
    try {
      const autoclave = await Autoclaves.findAll({
        order: [['id', 'ASC']],
      });
      return autoclave;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async saveAutoclave(autoclave) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>saveAutoclave');
    try {
      let count = 1;

      const flatAutoclave = autoclave.flat();
      const allAutoclavesInDB = await Autoclaves.findAll();

      const newAutoclaveIds = flatAutoclave.map((item) => item.id).filter(Boolean);

      const idsToReset = allAutoclavesInDB
        .filter(
          (dbRecord) =>
            !newAutoclaveIds.includes(dbRecord.id_list_of_ordered_product)
        )
        .map((dbRecord) => dbRecord.id);

      if (idsToReset.length > 0) {
        await Autoclaves.update(
          {
            id_list_of_ordered_product: null,
            density: '',
            width: '',
          },
          {
            where: {
              id: idsToReset,
            },
          }
        );
      }

      const countInAutoclave = {};
      const countInDB = {};

      flatAutoclave.forEach((item) => {
        if (item.id) {
          countInAutoclave[item.id] = (countInAutoclave[item.id] || 0) + 1;
        }
      });

      allAutoclavesInDB.forEach((dbRecord) => {
        const productId = dbRecord.id_list_of_ordered_product;
        if (productId) {
          countInDB[productId] = (countInDB[productId] || 0) + 1;
        }
      });

      for (const id in countInDB) {
        if (countInAutoclave[id] && countInAutoclave[id] < countInDB[id]) {
          const excess = countInDB[id] - countInAutoclave[id];

          const excessRecords = await Autoclaves.findAll({
            where: {
              id_list_of_ordered_product: id,
            },
            limit: excess,
          });

          for (const record of excessRecords) {
            await Autoclaves.update(
              {
                id_list_of_ordered_product: null,
                density: '',
                width: '',
              },
              {
                where: {
                  id: record.id,
                },
              }
            );
          }
        }
      }

      const nonNullItems = flatAutoclave.filter((item) => item.id !== null);
      const nullItems = flatAutoclave.filter((item) => item.id === null);
      const finalAutoclaveArray = [...nonNullItems, ...nullItems];

      for (let i = 0; i < finalAutoclaveArray.length; i++) {
        const currentCell = finalAutoclaveArray[i];

        await Autoclaves.update(
          {
            id_list_of_ordered_product: currentCell.id || null, // Если id == null, сохраняем null
            status_batch: currentCell.id ? 0 : null, // Сбрасываем статус, если id == null
            quality_check: currentCell.id ? 0 : null, // Сбрасываем проверку качества, если id == null
          },
          {
            where: {
              id: count, // обновляем по порядковому id
            },
          }
        );
        count++;
      }
      const newAutoclave = await Autoclaves.findAll({
        order: [['id', 'ASC']],
      });

      return newAutoclave;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateAutoclave(list_of_order_id) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateAutoclave');
    try {
      const autoclave = await Autoclaves.findAll();

      const nonNullItems = autoclave.filter(
        (el) => el.id_list_of_ordered_product !== list_of_order_id
      );
      const targetItems = autoclave.filter(
        (el) => el.id_list_of_ordered_product === list_of_order_id
      );

      const nullifiedItems = targetItems.map(() => ({
        id_list_of_ordered_product: null,
        density: '',
        width: '',
      }));

      const finalAutoclaveArray = [...nonNullItems, ...nullifiedItems];

      for (let i = 0; i < finalAutoclaveArray.length; i++) {
        const currentElement = finalAutoclaveArray[i];

        await Autoclaves.update(
          {
            id_list_of_ordered_product: currentElement.id_list_of_ordered_product,
            density: currentElement.density,
            width: currentElement.width,
          },
          {
            where: {
              id: autoclave[i].id,
            },
          }
        );
      }

      const newAutoclave = await Autoclaves.findAll({
        order: [['id', 'ASC']],
      });

      return newAutoclave;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }
}

module.exports = AutoclavesRepository;
