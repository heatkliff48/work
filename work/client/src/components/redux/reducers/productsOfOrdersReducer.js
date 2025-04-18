import {
  CURRENT_PRODUCTS_OF_ORDER,
  UPDATE_PRODUCT_INFO_OF_ORDER,
  PRODUCTS_OF_ORDER,
  DRY_MIXED_PRODUCTS_OF_ORDER,
  TOOL_PRODUCTS_OF_ORDER,
  ANCHOR_PRODUCTS_OF_ORDER,
} from '../types/ordersTypes';
import {
  DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
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

export const dryMixedProductsOfOrdersReducer = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case DRY_MIXED_PRODUCTS_OF_ORDER: {
      return payload;
    }

    case UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...state, payload];
    }

    case DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET: {
      const result = state.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return state;
  }
};

export const anchorProductsOfOrdersReducer = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case ANCHOR_PRODUCTS_OF_ORDER: {
      return payload ?? [];
    }

    case UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      console.log();
      return [...state, payload];
    }

    case DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET: {
      const result = state.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return state;
  }
};

export const toolProductsOfOrdersReducer = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case TOOL_PRODUCTS_OF_ORDER: {
      return payload ?? [];
    }

    case UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...state, payload];
    }

    case DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET: {
      const result = state.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return state;
  }
};
