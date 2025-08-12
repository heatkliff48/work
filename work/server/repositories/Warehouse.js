const {
  AutoclaveCalendares,
  Warehouses,
  DryMixesWarehouses,
  RelatedMaterialsWarehouses,
  AnchorsWarehouses,
  ToolsWarehouses,
  ReservedProducts,
  ReservedDryMixes,
  ReservedAnchors,
  ReservedTools,
  ReservedRelatedMaterials,
  ListOfOrderedProductions,
  ListOfOrderedProductionOEMs,
  OrdersProducts,
  OrderDryMixedProducts,
  OrderAnchorProducts,
  OrderToolProducts,
  OrderRelMatProducts,
  sequelize,
} = require('../db/models');

class WarehouseRepository {
  static async getAllWarehouse() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getAllWarehouse');

    try {
      const warehouse = await Warehouses.findAll();
      return warehouse ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getAutoclaveCalendar() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getAutoclaveCalendar');

    try {
      const autoclaveCalendares = await AutoclaveCalendares.findAll();
      return autoclaveCalendares ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewAutoclaveCalendarData(map) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>AddNewAutoclaveCalendarData');
    const t = await sequelize.transaction();
    try {
      const autoclaveCalendares = await AutoclaveCalendares.findAll({
        raw: true,
        transaction: t,
      });
      const calendarMap = new Map(autoclaveCalendares.map((r) => [r.date, r]));

      for (const item of map) {
        const date = String(item.date).slice(0, 10);
        const quantity = Number(item.quantity) || 0;
        const quantity_of_complited = Number(item.quantity_of_complited ?? 0) || 0;

        if (calendarMap.has(date)) {
          const data = calendarMap.get(date);
          await AutoclaveCalendares.update(
            { quantity, quantity_of_complited },
            { where: { id: data.id }, transaction: t }
          );
        } else {
          await AutoclaveCalendares.create(
            { date, quantity, quantity_of_complited },
            { transaction: t }
          );
        }
      }

      await t.commit();

      const updAutoclaveCalendares = await AutoclaveCalendares.findAll({
        raw: true,
      });

      return updAutoclaveCalendares ?? [];
    } catch (error) {
      await t.rollback();
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      throw error;
    }
  }

  static async getListOfOrderedProduction() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfOrderedProduction');

    try {
      const orderedProduction = await ListOfOrderedProductions.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'quantity_in_warehouse',
        ],
      });
      return orderedProduction ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async getListOfReservedProductsOEM() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProductsOEM');

    try {
      const orderedProductionOEM = await ListOfOrderedProductionOEMs.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'status',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return orderedProductionOEM ?? [];
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewWarehouse(warehouse) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewWarehouse');
    try {
      const new_warehouse = await Warehouses.create(warehouse);
      return new_warehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewListOfOrderedProduction(ordered_production) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewListOfOrderedProduction');
    try {
      await ListOfOrderedProductions.create(ordered_production);

      const new_ordered_production = await ListOfOrderedProductions.findAll({
        attributes: [
          'id',
          'product_article',
          'order_article',
          'quantity',
          'shipping_date',
          'quantity_in_warehouse',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return new_ordered_production;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateListOfOrderedProduction(ordered_production) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateListOfOrderedProduction----------------------------------',
      ordered_production
    );

    try {
      const { id, quantity_in_warehouse } = ordered_production;
      await ListOfOrderedProductions.update(
        { quantity_in_warehouse },
        { where: { id } }
      );
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewListOfOrderedProductionOEM(ordered_production_oem) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewListOfOrderedProductionOEM');

    try {
      await ListOfOrderedProductionOEMs.create(ordered_production_oem);

      const new_ordered_production_oem = await ListOfOrderedProductionOEMs.findAll({
        attributes: [
          'id',
          'shipping_date',
          'product_article',
          'order_article',
          'quantity',
          'status',
        ],
        order: [['shipping_date', 'ASC']],
      });
      return new_ordered_production_oem;
    } catch (err) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>err', err);
      return err;
    }
  }

  static async updateListOfOrderedProductionOEM(upd_ordered_production_oem) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateListOfOrderedProductionOEM');

    try {
      const { id, status } = upd_ordered_production_oem;
      await ListOfOrderedProductionOEMs.update({ status }, { where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateRemainingStock(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateRemainingStock');

    try {
      const { warehouse_id, free_quantity_remaining, ordered_quantity } =
        upd_rem_srock;
      await Warehouses.update(
        { free_quantity_remaining, ordered_quantity },
        { where: { id: warehouse_id } }
      );
      const updWarehouse = await Warehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');

    try {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);
      const { warehouse_id, total_quantity, ordered_quantity } = upd_rem_srock;
      await Warehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );
      const updWarehouse = await Warehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateDryMixedWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');

    try {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

      const { warehouse_id, total_quantity, ordered_quantity } = upd_rem_srock;

      await DryMixesWarehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );

      const updWarehouse = await DryMixesWarehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateAnchorWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

    try {
      const { warehouse_id, total_quantity, ordered_quantity } = upd_rem_srock;

      await AnchorsWarehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );

      const updWarehouse = await AnchorsWarehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateToolWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

    try {
      const { warehouse_id, total_quantity, ordered_quantity } = upd_rem_srock;

      await ToolsWarehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );

      const updWarehouse = await ToolsWarehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateRelMatWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

    try {
      const { warehouse_id, total_quantity, ordered_quantity } = upd_rem_srock;

      await RelatedMaterialsWarehouses.update(
        { total_quantity, ordered_quantity },
        { where: { id: warehouse_id } }
      );

      const updWarehouse = await RelatedMaterialsWarehouses.findAll();
      return updWarehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProducts');

    try {
      const listOfReservedProducts = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedProducts.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });
      await OrdersProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedProducts.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedProducts.findAll({
        attributes: ['id', 'warehouse_id', 'orders_products_id', 'quantity'],
      });

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedProducts.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedDryMixedProducts() {
    try {
      const listOfReservedProducts = await ReservedDryMixes.findAll();
      console.log(
        '>>>>>>>>>>>>>>>>listOfReservedProducts<<<<<<<<<<<<',
        listOfReservedProducts
      );
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedDryMixedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedDryMixes.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedDryMixes.findAll();
      await OrderDryMixedProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedDryMixedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedDryMixes.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedDryMixes.findAll();

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedDryMixedProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedDryMixes.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedAnchorProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProducts');

    try {
      const listOfReservedProducts = await ReservedAnchors.findAll();
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedAnchorProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedAnchors.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedAnchors.findAll();
      await OrderAnchorProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedAnchorProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedAnchors.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedAnchors.findAll();

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedAnchorProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedAnchors.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedToolProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProducts');

    try {
      const listOfReservedProducts = await ReservedTools.findAll();
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedToolProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedTools.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedTools.findAll();
      await OrderToolProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedToolProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedTools.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedTools.findAll();

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedToolProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedTools.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedRelatedMaterialsProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedProducts');

    try {
      const listOfReservedProducts = await ReservedRelatedMaterials.findAll();
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedRelMatProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedProducts');

    try {
      for (let i = 0; i < reserved_product.length; i++) {
        await ReservedRelatedMaterials.create(reserved_product[i]);
      }
      const new_reserved_product = await ReservedRelatedMaterials.findAll();
      await OrderRelMatProducts.update(
        {
          warehouse_id: reserved_product.warehouse_id,
        },
        { where: { id: reserved_product.orders_products_id } }
      );

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedRelMatProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedRelatedMaterials.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } }
      );
      const new_reserved_product = await ReservedRelatedMaterials.findAll();

      return new_reserved_product;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedRelMatProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedProducts');

    try {
      await ReservedRelatedMaterials.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }
}

module.exports = WarehouseRepository;
