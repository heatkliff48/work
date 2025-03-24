import {
  CURRENT_PRODUCTS_OF_ORDER,
  UPDATE_PRODUCT_INFO_OF_ORDER,
  PRODUCTS_OF_ORDER,
  DRY_MIXED_PRODUCTS_OF_ORDER,
  TOOL_PRODUCTS_OF_ORDER,
  ANCHOR_PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';
import {
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET,
} from '../types/socketTypes/socket';

export const productsOfOrdersReducer = (productsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case CURRENT_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...productsOfOrders, payload];
    }

    case UPDATE_PRODUCT_INFO_OF_ORDER: {
      const result = productsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_PRODUCT_OF_ORDER_SOCKET: {
      const result = productsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return productsOfOrders;
  }
};

export const dryMixedProductsOfOrdersReducer = (
  dryMixedProductsOfOrders = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case DRY_MIXED_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...dryMixedProductsOfOrders, payload];
    }

    // case UPDATE_PRODUCT_INFO_OF_ORDER: {
    //   console.log('UPDATE_PRODUCT_INFO_OF_ORDER', payload);
    //   const result = dryMixedProductsOfOrders.map((el) => {
    //     if (el?.id === payload?.id) {
    //       return { ...payload };
    //     }

    //     return el;
    //   });

    //   return result;
    // }

    // case DELETE_PRODUCT_OF_ORDER_SOCKET: {
    //   const result = dryMixedProductsOfOrders.filter((el) => el.id !== payload);
    //   return result;
    // }

    default:
      return dryMixedProductsOfOrders;
  }
};

export const anchorProductsOfOrdersReducer = (
  anchorProductsOfOrders = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case ANCHOR_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      console.log();
      return [...anchorProductsOfOrders, payload];
    }

    // case UPDATE_PRODUCT_INFO_OF_ORDER: {
    //   console.log('UPDATE_PRODUCT_INFO_OF_ORDER', payload);
    //   const result = anchorProductsOfOrders.map((el) => {
    //     if (el?.id === payload?.id) {
    //       return { ...payload };
    //     }

    //     return el;
    //   });

    //   return result;
    // }

    // case DELETE_PRODUCT_OF_ORDER_SOCKET: {
    //   const result = anchorProductsOfOrders.filter((el) => el.id !== payload);
    //   return result;
    // }

    default:
      return anchorProductsOfOrders;
  }
};

export const toolProductsOfOrdersReducer = (toolProductsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case TOOL_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...toolProductsOfOrders, payload];
    }

    // case UPDATE_PRODUCT_INFO_OF_ORDER: {
    //   console.log('UPDATE_PRODUCT_INFO_OF_ORDER', payload);
    //   const result = toolProductsOfOrders.map((el) => {
    //     if (el?.id === payload?.id) {
    //       return { ...payload };
    //     }

    //     return el;
    //   });

    //   return result;
    // }

    // case DELETE_PRODUCT_OF_ORDER_SOCKET: {
    //   const result = toolProductsOfOrders.filter((el) => el.id !== payload);
    //   return result;
    // }

    default:
      return toolProductsOfOrders;
  }
};
