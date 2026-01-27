const { where } = require('sequelize');
const {
  AutoclaveCalendares,
  Warehouses,
  DryMixesWarehouse,
  RelatedMaterialsWarehouse,
  AnchorsWarehouse,
  ToolsWarehouse,
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

const MODELS_BY_TYPE = {
  product: Warehouses,
  dryMixed: DryMixesWarehouse,
  relMat: RelatedMaterialsWarehouse,
  tool: ToolsWarehouse,
  anchor: AnchorsWarehouse,
};

// Функция для получения модели по типу
function getModelByType(type) {
  const model = MODELS_BY_TYPE[type];
  if (!model) {
    throw new Error(`Неизвестный тип склада: ${type}`);
  }
  return model;
}
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
        const scheduled_autoclaves = item?.scheduled_autoclaves;
        const produced_autoclave = item?.produced_autoclave;
        const filled_autoclaves = item?.filled_autoclaves;
        const residual_arrays = item?.residual_arrays;
        const total_arrays = item?.total_arrays;

        if (calendarMap.has(date)) {
          const data = calendarMap.get(date);
          await AutoclaveCalendares.update(
            {
              scheduled_autoclaves,
              produced_autoclave,
              total_arrays,
              residual_arrays,
              filled_autoclaves,
            },
            { where: { id: data.id }, transaction: t },
          );
        } else {
          await AutoclaveCalendares.create(
            {
              date,
              scheduled_autoclaves,
              produced_autoclave,
              total_arrays,
              residual_arrays,
              filled_autoclaves,
            },
            { transaction: t },
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
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewWarehouse', new_warehouse);
      return new_warehouse;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewListOfOrderedProduction(ordered_production) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewListOfOrderedProduction');
    try {
      const new_ordered_production = await ListOfOrderedProductions.create(
        ordered_production,
      );

      return new_ordered_production;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async updateListOfOrderedProduction(ordered_production) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateListOfOrderedProduction----------------------------------',
      ordered_production,
    );

    try {
      const { id, quantity_in_warehouse } = ordered_production;
      await ListOfOrderedProductions.update(
        { quantity_in_warehouse },
        { where: { id } },
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
      const new_ordered_production_oem = await ListOfOrderedProductionOEMs.create(
        ordered_production_oem,
      );

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
      console.log(
        '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateRemainingStock upd_rem_srock',
        upd_rem_srock,
      );

      const upd =
        upd_rem_srock.total_quantity > 0
          ? {
              total_quantity: upd_rem_srock.total_quantity,
              free_quantity_remaining,
              ordered_quantity,
            }
          : { free_quantity_remaining, ordered_quantity };

      console.log('upd Warehouse.js line 261', upd);
      const [count, rows] = await Warehouses.update(
        { ...upd },
        { where: { id: warehouse_id }, returning: true },
      );

      const updatedCake = rows[0];

      return updatedCake;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateWarehouseQuantitys(upd_rem_stock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateWarehouseQuantitys');

    try {
      if (!Array.isArray(upd_rem_stock)) {
        const { warehouse_id, total_quantity, ordered_quantity, product_article } =
          upd_rem_stock;

        const updatedProduct = await Warehouses.update(
          {
            total_quantity,
            ordered_quantity,
          },
          { where: { id: warehouse_id } },
        );
        return updatedProduct;
      }

      const transaction = await sequelize.transaction();

      try {
        const groupedByTypeAndArticle = new Map();

        upd_rem_stock.forEach((item) => {
          const { type = 'product', product_article } = item;
          const typeKey = type;
          const articleKey = product_article;

          if (!groupedByTypeAndArticle.has(typeKey)) {
            groupedByTypeAndArticle.set(typeKey, new Map());
          }

          const articlesMap = groupedByTypeAndArticle.get(typeKey);
          if (!articlesMap.has(articleKey)) {
            articlesMap.set(articleKey, []);
          }

          articlesMap.get(articleKey).push(item);
        });

        const allResults = [];
        const updatedModelsData = new Map();

        for (const [typeKey, articlesMap] of groupedByTypeAndArticle) {
          const Model = getModelByType(typeKey);

          for (const [product_article, incomingItems] of articlesMap) {
            const dbRecords = await Model.findAll({
              where: { product_article },
              order: [['ordered_quantity', 'DESC']],
              transaction,
            });

            if (dbRecords.length === 0) continue;

            const recordsMap = new Map();
            dbRecords.forEach((record) => {
              recordsMap.set(record.id, {
                id: record.id,
                current_total: record.total_quantity,
                current_ordered: record.ordered_quantity,
                current_free: record.free_quantity_remaining,
                new_total: record.total_quantity,
                new_ordered: record.ordered_quantity,
                new_free: record.free_quantity_remaining,
                updated: false,
              });
            });

            const itemsToRedistribute = [];

            for (const incomingItem of incomingItems) {
              const {
                warehouse_id,
                total_quantity: deltaTotal,
                ordered_quantity: deltaOrdered,
              } = incomingItem;

              if (!recordsMap.has(warehouse_id)) {
                console.warn(
                  `Entrie with warehouse_id=${warehouse_id} not found for ${product_article}`,
                );
                continue;
              }

              const record = recordsMap.get(warehouse_id);

              if (deltaOrdered < 0) {
                const deficit = Math.abs(deltaOrdered);

                if (record.current_free >= deficit) {
                  record.new_ordered = 0;
                  record.new_free = record.current_free - deficit;
                  record.new_total = record.new_free + record.new_ordered;

                  itemsToRedistribute.push({
                    source_warehouse_id: warehouse_id,
                    deficit: deficit,
                    record: record,
                  });
                } else {
                  const remainingDeficit = deficit - record.current_free;
                  record.new_ordered = 0;
                  record.new_free = 0;
                  record.new_total = 0;

                  itemsToRedistribute.push({
                    source_warehouse_id: warehouse_id,
                    deficit: remainingDeficit,
                    record: record,
                  });
                }
              } else {
                record.new_ordered = deltaOrdered;

                const freeDelta = deltaTotal - deltaOrdered;
                record.new_free = Math.max(0, freeDelta);
                record.new_total = deltaTotal;
              }

              record.updated = true;
            }

            for (const item of itemsToRedistribute) {
              const { source_warehouse_id, deficit, record: sourceRecord } = item;
              let remainingDeficit = deficit;

              const sortedRecords = Array.from(recordsMap.values())
                .filter((r) => r.id !== source_warehouse_id && r.new_ordered > 0)
                .sort((a, b) => b.new_ordered - a.new_ordered);

              for (const targetRecord of sortedRecords) {
                if (remainingDeficit <= 0) break;

                const availableOrdered = targetRecord.new_ordered;
                const transfer = Math.min(availableOrdered, remainingDeficit);

                if (transfer > 0) {
                  targetRecord.new_ordered -= transfer;
                  targetRecord.new_free += transfer;
                  targetRecord.new_total =
                    targetRecord.new_free + targetRecord.new_ordered;
                  targetRecord.updated = true;

                  remainingDeficit -= transfer;
                }
              }

              if (remainingDeficit > 0) {
                const otherRecords = Array.from(recordsMap.values())
                  .filter((r) => r.id !== source_warehouse_id && r.new_free > 0)
                  .sort((a, b) => b.new_free - a.new_free);

                for (const targetRecord of otherRecords) {
                  if (remainingDeficit <= 0) break;

                  const availableFree = targetRecord.new_free;
                  const transfer = Math.min(availableFree, remainingDeficit);

                  if (transfer > 0) {
                    targetRecord.new_free -= transfer;
                    targetRecord.new_total =
                      targetRecord.new_free + targetRecord.new_ordered;
                    targetRecord.updated = true;

                    sourceRecord.new_free += transfer;
                    sourceRecord.new_total =
                      sourceRecord.new_free + sourceRecord.new_ordered;

                    remainingDeficit -= transfer;
                  }
                }
              }

              if (remainingDeficit === 0) {
                sourceRecord.new_total =
                  sourceRecord.new_free + sourceRecord.new_ordered;
              } else {
                console.warn(
                  `Not enough deficit ${deficit} for warehouse_id=${source_warehouse_id}, remaining: ${remainingDeficit}`,
                );
              }
            }

            for (const record of recordsMap.values()) {
              if (record.updated) {
                await Model.update(
                  {
                    total_quantity: record.new_total,
                    ordered_quantity: record.new_ordered,
                    free_quantity_remaining: record.new_free,
                  },
                  {
                    where: { id: record.id },
                    transaction,
                  },
                );

                // allResults.push({
                //   type: typeKey,
                //   product_article,
                //   warehouse_id: record.warehouse_id,
                // });
              }
            }
          }

          const modelData = await Model.findAll({
            transaction,
          });

          updatedModelsData.set(typeKey, {
            model: Model.name,
            data: modelData,
          });
        }

        await transaction.commit();

        const wh_data = {};
        for (const [typeKey, data] of updatedModelsData) {
          wh_data[typeKey] = data.data;
        }

        return {
          isArray: true,
          wh_data,
        };
      } catch (error) {
        await transaction.rollback();
        throw error;
      }

      // const {
      //   warehouse_id,
      //   total_quantity,
      //   ordered_quantity,
      //   product_article,
      // } = upd_rem_srock;
      // console.log(
      //   upd_rem_srock,
      //   "upd_rem_srock ------------------------------- Warehouse.js line 290",
      // );
      // const wh_data_by_id = await Warehouses.findOne({
      //   where: { id: warehouse_id },
      // });
      // const wh_data = await Warehouses.findAll({
      //   where: { product_article: product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });
      // console.log(
      //   wh_data,
      //   "wh_data ------------------------------- Warehouse.js line 304",
      // );
      // if (ordered_quantity < 0) {
      //   console.log(ordered_quantity, "ordered_quantity Warehouse.js line 307");
      //   console.log(
      //     wh_data_by_id.free_quantity_remaining + ordered_quantity,
      //     "free_quantity_remaining ---- Warehouse.js line 308",
      //   );
      //   console.log(
      //     wh_data_by_id.free_quantity_remaining + ordered_quantity,
      //     "total_quantity --------------- Warehouse.js line 309",
      //   );
      //   await Warehouses.update(
      //     {
      //       free_quantity_remaining:
      //         wh_data_by_id.free_quantity_remaining + ordered_quantity,
      //       total_quantity:
      //         wh_data_by_id.free_quantity_remaining + ordered_quantity,
      //       ordered_quantity: 0,
      //     },
      //     { where: { id: warehouse_id } },
      //   );
      //   console.log(
      //     wh_data[0].free_quantity_remaining - ordered_quantity,
      //     "wh_data[0].free_quantity_remaining - ordered_quantity Warehouse.js line 320",
      //   );
      //   console.log(
      //     wh_data[0].ordered_quantity + ordered_quantity,
      //     "wh_data[0].ordered_quantity + ordered_quantity Warehouse.js line 321",
      //   );
      //   await Warehouses.update(
      //     {
      //       free_quantity_remaining:
      //         wh_data[0].free_quantity_remaining - ordered_quantity,
      //       ordered_quantity: wh_data[0].ordered_quantity + ordered_quantity,
      //     },
      //     { where: { id: wh_data[0].id } },
      //   );
      //   const updatedProduct = await Warehouses.findAll();
      //   console.log(
      //     updatedProduct,
      //     "updatedProduct <><><><><><><><><> Warehouse.js line 331",
      //   );
      //   return updatedProduct;
      // } else {
      //   const updatedProduct = await Warehouses.update(
      //     {
      //       total_quantity,
      //       ordered_quantity,
      //     },
      //     { where: { id: warehouse_id } },
      //   );
      //   console.log(
      //     updatedProduct,
      //     "updatedProduct !!!!!!!!!! Warehouse.js line 343",
      //   );
      //   return updatedProduct;
      // }
      // const wh_data_ordered = await Warehouses.findOne({
      //   where: { product_article: wh_data.product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });
      // if (ordered_quantity < 0) {
      //   let plus_ordered_quantity = ordered_quantity * -1;
      //   let shipped = wh_data.ordered_quantity + plus_ordered_quantity;
      //   new_ordered_quantity = 0;
      //   new_total_quantity = wh_data.total_quantity - shipped;
      //   new_free_quantity_remaining =
      //     wh_data.free_quantity_remaining - plus_ordered_quantity;
      //   // await Warehouses.update(
      //   //   {
      //   //     total_quantity:
      //   //       wh_data_ordered.total_quantity - plus_ordered_quantity,
      //   //     ordered_quantity:
      //   //       wh_data_ordered.ordered_quantity - plus_ordered_quantity,
      //   //   },
      //   //   { where: { id: wh_data_ordered.id } },
      //   // );
      // }
      // await Warehouses.update(
      //   {
      //     total_quantity,
      //     ordered_quantity,
      //   },
      //   { where: { id: warehouse_id } },
      // );
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateDryMixedWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateDryMixedWarehouseQuantitys');

    try {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

      const { warehouse_id, total_quantity, ordered_quantity, product_article } =
        upd_rem_srock;

      // await DryMixesWarehouse.update(
      //   { total_quantity, ordered_quantity },
      //   { where: { id: warehouse_id, product_article } },
      // );

      const wh_data_by_id = await DryMixesWarehouse.findOne({
        where: { id: warehouse_id },
      });

      const wh_data = await DryMixesWarehouse.findAll({
        where: { product_article: product_article },
        order: [['ordered_quantity', 'DESC']],
      });

      if (ordered_quantity < 0) {
        await DryMixesWarehouse.update(
          {
            free_quantity_remaining:
              wh_data_by_id.free_quantity_remaining + ordered_quantity,
            total_quantity: wh_data_by_id.free_quantity_remaining + ordered_quantity,
            ordered_quantity: 0,
          },
          { where: { id: warehouse_id } },
        );
        await DryMixesWarehouse.update(
          {
            free_quantity_remaining:
              wh_data[0].free_quantity_remaining - ordered_quantity,
            ordered_quantity: wh_data[0].ordered_quantity + ordered_quantity,
          },
          { where: { id: wh_data[0].id } },
        );
        const updatedDryMixes = await Warehouses.findAll();
        return updatedDryMixes;
      } else {
        const updatedDryMixes = await DryMixesWarehouse.update(
          {
            total_quantity,
            ordered_quantity,
          },
          { where: { id: warehouse_id } },
        );
        return updatedDryMixes;
      }

      // const wh_data = await DryMixesWarehouse.findOne({
      //   where: { id: warehouse_id },
      // });

      // const wh_data_ordered = await DryMixesWarehouse.findOne({
      //   where: { product_article: wh_data.product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });

      // let new_ordered_quantity = 0;
      // let new_total_quantity = 0;
      // let new_free_quantity_remaining = 0;

      // if (ordered_quantity < 0) {
      //   let plus_ordered_quantity = ordered_quantity * -1;
      //   let shipped = wh_data.ordered_quantity + plus_ordered_quantity;
      //   new_ordered_quantity = 0;
      //   new_total_quantity = wh_data.total_quantity - shipped;
      //   new_free_quantity_remaining =
      //     wh_data.free_quantity_remaining - plus_ordered_quantity;

      //   await DryMixesWarehouse.update(
      //     {
      //       total_quantity:
      //         wh_data_ordered.total_quantity - plus_ordered_quantity,
      //       ordered_quantity:
      //         wh_data_ordered.ordered_quantity - plus_ordered_quantity,
      //     },
      //     { where: { id: wh_data_ordered.id } },
      //   );
      // }

      // await DryMixesWarehouse.update(
      //   {
      //     total_quantity: new_total_quantity,
      //     ordered_quantity: new_ordered_quantity,
      //     free_quantity_remaining: new_free_quantity_remaining,
      //   },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateAnchorWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateAnchorWarehouseQuantitys');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

    try {
      const { warehouse_id, total_quantity, ordered_quantity, product_article } =
        upd_rem_srock;

      const wh_data_by_id = await AnchorsWarehouse.findOne({
        where: { id: warehouse_id },
      });

      const wh_data = await AnchorsWarehouse.findAll({
        where: { product_article: product_article },
        order: [['ordered_quantity', 'DESC']],
      });

      if (ordered_quantity < 0) {
        await AnchorsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data_by_id.free_quantity_remaining + ordered_quantity,
            total_quantity: wh_data_by_id.free_quantity_remaining + ordered_quantity,
            ordered_quantity: 0,
          },
          { where: { id: warehouse_id } },
        );
        await AnchorsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data[0].free_quantity_remaining - ordered_quantity,
            ordered_quantity: wh_data[0].ordered_quantity + ordered_quantity,
          },
          { where: { id: wh_data[0].id } },
        );
        const updatedAnchors = await AnchorsWarehouse.findAll();
        return updatedAnchors;
      } else {
        const updatedAnchors = await AnchorsWarehouse.update(
          {
            total_quantity,
            ordered_quantity,
          },
          { where: { id: warehouse_id } },
        );
        return updatedAnchors;
      }

      // await AnchorsWarehouse.update(
      //   { total_quantity, ordered_quantity },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // const wh_data = await AnchorsWarehouse.findOne({
      //   where: { id: warehouse_id },
      // });
      // const wh_data_ordered = await AnchorsWarehouse.findOne({
      //   where: { product_article: wh_data.product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });

      // let new_ordered_quantity = 0;
      // let new_total_quantity = 0;
      // let new_free_quantity_remaining = 0;

      // if (ordered_quantity < 0) {
      //   let plus_ordered_quantity = ordered_quantity * -1;
      //   let shipped = wh_data.ordered_quantity + plus_ordered_quantity;
      //   new_ordered_quantity = 0;
      //   new_total_quantity = wh_data.total_quantity - shipped;
      //   new_free_quantity_remaining =
      //     wh_data.free_quantity_remaining - plus_ordered_quantity;

      //   await AnchorsWarehouse.update(
      //     {
      //       total_quantity:
      //         wh_data_ordered.total_quantity - plus_ordered_quantity,
      //       ordered_quantity:
      //         wh_data_ordered.ordered_quantity - plus_ordered_quantity,
      //     },
      //     { where: { id: wh_data_ordered.id } },
      //   );
      // }

      // await AnchorsWarehouse.update(
      //   {
      //     total_quantity: new_total_quantity,
      //     ordered_quantity: new_ordered_quantity,
      //     free_quantity_remaining: new_free_quantity_remaining,
      //   },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateToolWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateToolWarehouseQuantitys');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>upd_rem_srock', upd_rem_srock);

    try {
      const { warehouse_id, total_quantity, ordered_quantity, product_article } =
        upd_rem_srock;

      const wh_data_by_id = await ToolsWarehouse.findOne({
        where: { id: warehouse_id },
      });

      const wh_data = await ToolsWarehouse.findAll({
        where: { product_article: product_article },
        order: [['ordered_quantity', 'DESC']],
      });

      if (ordered_quantity < 0) {
        await ToolsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data_by_id.free_quantity_remaining + ordered_quantity,
            total_quantity: wh_data_by_id.free_quantity_remaining + ordered_quantity,
            ordered_quantity: 0,
          },
          { where: { id: warehouse_id } },
        );
        await ToolsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data[0].free_quantity_remaining - ordered_quantity,
            ordered_quantity: wh_data[0].ordered_quantity + ordered_quantity,
          },
          { where: { id: wh_data[0].id } },
        );
        const updatedTools = await ToolsWarehouse.findAll();
        return updatedTools;
      } else {
        const updatedTools = await ToolsWarehouse.update(
          {
            total_quantity,
            ordered_quantity,
          },
          { where: { id: warehouse_id } },
        );
        return updatedTools;
      }

      // await ToolsWarehouse.update(
      //   { total_quantity, ordered_quantity },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // const wh_data = await ToolsWarehouse.findOne({
      //   where: { id: warehouse_id },
      // });
      // const wh_data_ordered = await ToolsWarehouse.findOne({
      //   where: { product_article: wh_data.product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });

      // let new_ordered_quantity = 0;
      // let new_total_quantity = 0;
      // let new_free_quantity_remaining = 0;

      // if (ordered_quantity < 0) {
      //   let plus_ordered_quantity = ordered_quantity * -1;
      //   let shipped = wh_data.ordered_quantity + plus_ordered_quantity;
      //   new_ordered_quantity = 0;
      //   new_total_quantity = wh_data.total_quantity - shipped;
      //   new_free_quantity_remaining =
      //     wh_data.free_quantity_remaining - plus_ordered_quantity;

      //   await ToolsWarehouse.update(
      //     {
      //       total_quantity:
      //         wh_data_ordered.total_quantity - plus_ordered_quantity,
      //       ordered_quantity:
      //         wh_data_ordered.ordered_quantity - plus_ordered_quantity,
      //     },
      //     { where: { id: wh_data_ordered.id } },
      //   );
      // }

      // await ToolsWarehouse.update(
      //   {
      //     total_quantity: new_total_quantity,
      //     ordered_quantity: new_ordered_quantity,
      //     free_quantity_remaining: new_free_quantity_remaining,
      //   },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updateRelMatWarehouseQuantitys(upd_rem_srock) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updateRelMatWarehouseQuantitys');

    try {
      const { warehouse_id, total_quantity, ordered_quantity, product_article } =
        upd_rem_srock;

      const wh_data_by_id = await RelatedMaterialsWarehouse.findOne({
        where: { id: warehouse_id },
      });

      const wh_data = await RelatedMaterialsWarehouse.findAll({
        where: { product_article: product_article },
        order: [['ordered_quantity', 'DESC']],
      });

      if (ordered_quantity < 0) {
        await RelatedMaterialsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data_by_id.free_quantity_remaining + ordered_quantity,
            total_quantity: wh_data_by_id.free_quantity_remaining + ordered_quantity,
            ordered_quantity: 0,
          },
          { where: { id: warehouse_id } },
        );
        await RelatedMaterialsWarehouse.update(
          {
            free_quantity_remaining:
              wh_data[0].free_quantity_remaining - ordered_quantity,
            ordered_quantity: wh_data[0].ordered_quantity + ordered_quantity,
          },
          { where: { id: wh_data[0].id } },
        );
        const updatedRelMats = await RelatedMaterialsWarehouse.findAll();
        return updatedRelMats;
      } else {
        const updatedRelMats = await RelatedMaterialsWarehouse.update(
          {
            total_quantity,
            ordered_quantity,
          },
          { where: { id: warehouse_id } },
        );
        return updatedRelMats;
      }

      // await RelatedMaterialsWarehouse.update(
      //   { total_quantity, ordered_quantity },
      //   { where: { id: warehouse_id, product_article } },
      // );

      // const wh_data = await RelatedMaterialsWarehouse.findOne({
      //   where: { id: warehouse_id },
      // });
      // const wh_data_ordered = await RelatedMaterialsWarehouse.findOne({
      //   where: { product_article: wh_data.product_article },
      //   order: [["ordered_quantity", "DESC"]],
      // });

      // let new_ordered_quantity = 0;
      // let new_total_quantity = 0;
      // let new_free_quantity_remaining = 0;

      // if (ordered_quantity < 0) {
      //   let plus_ordered_quantity = ordered_quantity * -1;
      //   let shipped = wh_data.ordered_quantity + plus_ordered_quantity;
      //   new_ordered_quantity = 0;
      //   new_total_quantity = wh_data.total_quantity - shipped;
      //   new_free_quantity_remaining =
      //     wh_data.free_quantity_remaining - plus_ordered_quantity;

      //   await RelatedMaterialsWarehouse.update(
      //     {
      //       total_quantity:
      //         wh_data_ordered.total_quantity - plus_ordered_quantity,
      //       ordered_quantity:
      //         wh_data_ordered.ordered_quantity - plus_ordered_quantity,
      //     },
      //     { where: { id: wh_data_ordered.id } },
      //   );
      // }

      // await RelatedMaterialsWarehouse.update(
      //   {
      //     total_quantity: new_total_quantity,
      //     ordered_quantity: new_ordered_quantity,
      //     free_quantity_remaining: new_free_quantity_remaining,
      //   },
      //   { where: { id: warehouse_id, product_article } },
      // );
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
      // const reservedProducts = await ReservedProducts.bulkCreate(
      //   reserved_product,
      // );
      if (Array.isArray(reserved_product)) {
        for (let i = 0; i < reserved_product.length; i++) {
          await ReservedProducts.create(reserved_product[i]);
          await OrdersProducts.update(
            {
              warehouse_id: reserved_product[i].warehouse_id,
            },
            { where: { id: reserved_product[i].orders_products_id } },
          );
        }
        const reservedProducts = await ReservedProducts.findAll();
        return reservedProducts;
      } else {
        const reservedProducts = await ReservedProducts.create(reserved_product);
        await OrdersProducts.update(
          {
            warehouse_id: reserved_product.warehouse_id,
          },
          { where: { id: reserved_product.orders_products_id } },
        );

        return reservedProducts;
      }
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
        { where: { warehouse_id, orders_products_id } },
      );

      return;
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
        listOfReservedProducts,
      );
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedDryMixedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedDryMixedProducts');

    try {
      // const reservedDryMixes = await ReservedDryMixes.bulkCreate(
      //   reserved_product,
      // );
      if (Array.isArray(reserved_product)) {
        for (let i = 0; i < reserved_product.length; i++) {
          await ReservedDryMixes.create(reserved_product[i]);
          await OrderDryMixedProducts.update(
            {
              warehouse_id: reserved_product[i].warehouse_id,
            },
            { where: { id: reserved_product[i].orders_products_id } },
          );
        }
        const reservedDryMixes = await ReservedDryMixes.findAll();
        return reservedDryMixes;
      } else {
        const reservedDryMixes = await ReservedDryMixes.create(reserved_product);
        await OrderDryMixedProducts.update(
          {
            warehouse_id: reserved_product.warehouse_id,
          },
          { where: { id: reserved_product.orders_products_id } },
        );
        return reservedDryMixes;
      }
      // for (let i = 0; i < reserved_product.length; i++) {
      //   console.log(
      //     reserved_product[i],
      //     "reserved_product[i] addNewReservedDryMixedProducts Warehouse.js line 615",
      //   );
      //   await ReservedDryMixes.create(reserved_product[i]);
      //   await OrderDryMixedProducts.update(
      //     {
      //       warehouse_id: reserved_product[i].warehouse_id,
      //     },
      //     { where: { id: reserved_product[i].orders_products_id } },
      //   );
      // }

      return reservedDryMixes;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedDryMixedProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedDryMixedProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedDryMixes.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } },
      );

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedDryMixedProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedDryMixedProducts');

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
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedAnchorProducts');

    try {
      // const reservedAnchors = await ReservedAnchors.bulkCreate(
      //   reserved_product,
      // );
      if (Array.isArray(reserved_product)) {
        for (let i = 0; i < reserved_product.length; i++) {
          await ReservedAnchors.create(reserved_product[i]);
          await OrderAnchorProducts.update(
            {
              warehouse_id: reserved_product[i].warehouse_id,
            },
            { where: { id: reserved_product[i].orders_products_id } },
          );
        }
        const reservedAnchors = await ReservedAnchors.findAll();
        return reservedAnchors;
      } else {
        const reservedAnchors = await ReservedAnchors.create(reserved_product);
        await OrderAnchorProducts.update(
          {
            warehouse_id: reserved_product.warehouse_id,
          },
          { where: { id: reserved_product.orders_products_id } },
        );
        return reservedAnchors;
      }
      // for (let i = 0; i < reserved_product.length; i++) {
      //   await ReservedAnchors.create(reserved_product[i]);
      // }

      // await OrderAnchorProducts.update(
      //   {
      //     warehouse_id: reserved_product.warehouse_id,
      //   },
      //   { where: { id: reserved_product.orders_products_id } },
      // );

      return reservedAnchors;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedAnchorProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedAnchorProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedAnchors.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } },
      );

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedAnchorProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedAnchorProducts');

    try {
      await ReservedAnchors.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedToolProducts() {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedToolProducts');

    try {
      const listOfReservedProducts = await ReservedTools.findAll();
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedToolProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedToolProducts');

    try {
      // const reservedTools = await ReservedTools.bulkCreate(reserved_product);
      if (Array.isArray(reserved_product)) {
        for (let i = 0; i < reserved_product.length; i++) {
          await ReservedTools.create(reserved_product[i]);
          await OrderToolProducts.update(
            {
              warehouse_id: reserved_product[i].warehouse_id,
            },
            { where: { id: reserved_product[i].orders_products_id } },
          );
        }
        const reservedTools = await ReservedTools.findAll();
        return reservedTools;
      } else {
        const reservedTools = await ReservedTools.create(reserved_product);
        await OrderToolProducts.update(
          {
            warehouse_id: reserved_product.warehouse_id,
          },
          { where: { id: reserved_product.orders_products_id } },
        );
        return reservedTools;
      }
      // for (let i = 0; i < reserved_product.length; i++) {
      //   await ReservedTools.create(reserved_product[i]);
      // }

      // await OrderToolProducts.update(
      //   {
      //     warehouse_id: reserved_product.warehouse_id,
      //   },
      //   { where: { id: reserved_product.orders_products_id } },
      // );

      return reservedTools;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedToolProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedToolProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedTools.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } },
      );

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedToolProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedToolProducts');

    try {
      await ReservedTools.destroy({ where: { id } });
      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async getListOfReservedRelatedMaterialsProducts() {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>getListOfReservedRelatedMaterialsProducts',
    );

    try {
      const listOfReservedProducts = await ReservedRelatedMaterials.findAll();
      return listOfReservedProducts;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.error', error);
      return error;
    }
  }

  static async addNewReservedRelMatProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addNewReservedRelMatProducts');

    try {
      // const reservedRelMats = await ReservedRelatedMaterials.bulkCreate(
      //   reserved_product,
      // );
      if (Array.isArray(reserved_product)) {
        for (let i = 0; i < reserved_product.length; i++) {
          await ReservedRelatedMaterials.create(reserved_product[i]);
          await OrderRelMatProducts.update(
            {
              warehouse_id: reserved_product[i].warehouse_id,
            },
            { where: { id: reserved_product[i].orders_products_id } },
          );
        }
        const reservedRelMats = await ReservedRelatedMaterials.findAll();
        return reservedRelMats;
      } else {
        const reservedRelMats = await ReservedRelatedMaterials.create(
          reserved_product,
        );
        await OrderRelMatProducts.update(
          {
            warehouse_id: reserved_product.warehouse_id,
          },
          { where: { id: reserved_product.orders_products_id } },
        );
        return reservedRelMats;
      }
      // for (let i = 0; i < reserved_product.length; i++) {
      //   console.log(
      //     reserved_product[i],
      //     "reserved_product addNewReservedRelMatProducts Warehouse.js line 803",
      //   );
      //   await ReservedRelatedMaterials.create(reserved_product[i]);
      // }

      // await OrderRelMatProducts.update(
      //   {
      //     warehouse_id: reserved_product.warehouse_id,
      //   },
      //   { where: { id: reserved_product.orders_products_id } },
      // );

      return reservedRelMats;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async updReservedRelMatProducts(reserved_product) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>updReservedRelMatProducts');
    const { warehouse_id, orders_products_id, quantity } = reserved_product;
    try {
      await ReservedRelatedMaterials.update(
        { quantity },
        { where: { warehouse_id, orders_products_id } },
      );

      return;
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error);
      return error;
    }
  }

  static async deleteReservedRelMatProducts({ id }) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>deleteReservedRelMatProducts');

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
