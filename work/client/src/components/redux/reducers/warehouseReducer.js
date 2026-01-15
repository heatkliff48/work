import showMessage from '#components/Utils/showMessage.js';
import {
  NEED_UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET,
  NEW_WAREHOUSE_SOCKET,
  REMAINING_STOCK_SOCKET,
  WAREHOUSE_QUANTITYS_SOCKET,
} from '../types/socketTypes/socket';
import {
  ALL_WAREHOUSE,
  RAW_MATERIALS_WAREHOUSE,
  REMAINING_STOCK,
  WAREHOSE_QUANTITYS,
} from '../types/warehouseTypes';

export const warehouseReducer = (warehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_WAREHOUSE: {
      return payload;
    }

    case NEW_WAREHOUSE_SOCKET: {
      return [...warehouse, payload];
    }

    case WAREHOSE_QUANTITYS:
    case WAREHOUSE_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = warehouse.map((el) => {
        const { id, article, product_article } = payload;
        if (id === warehouse_id) {
          showMessage(
            `Order ${article} · Product ${product_article} · Total: ${total_quantity}, Ordered: ${ordered_quantity} — $`,
            'success'
          );

          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case REMAINING_STOCK:
    case REMAINING_STOCK_SOCKET: {
      const { warehouse_id, free_quantity_remaining, ordered_quantity } = payload;

      const result = warehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, free_quantity_remaining, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    default:
      return warehouse;
  }
};

export const rawMaterialsWarehouseReducer = (rawMaterialsWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case RAW_MATERIALS_WAREHOUSE: {
      return payload;
    }

    case NEED_UPDATE_RAW_MATERIALS_WAREHOUSE_SOCKET: {
      console.log({ rawMaterialsWarehouse }, 'warehouseReducer.js line 70');
      console.log({ payload }, 'warehouseReducer.js line 71');

      // Преобразуем в массив для единообразной обработки
      const itemsToUpdate = Array.isArray(payload) ? payload : [payload];

      let result = [...rawMaterialsWarehouse];

      itemsToUpdate.forEach((item) => {
        // Извлекаем updatedWarehouse если он есть
        const updatedItem = item?.updatedWarehouse || item;

        const index = result.findIndex((el) => el.id === updatedItem.id);
        if (index !== -1) {
          result[index] = updatedItem;
        } else {
          result.push(updatedItem);
        }
      });

      return result;
    }

    default:
      return rawMaterialsWarehouse;
  }
};
