import {
  CURRENT_PRODUCTS_OF_ORDER,
  UPDATE_PRODUCT_INFO_OF_ORDER,
  PRODUCTS_OF_ORDER,
  DRY_MIXED_PRODUCTS_OF_ORDER,
  TOOL_PRODUCTS_OF_ORDER,
  ANCHOR_PRODUCTS_OF_ORDER,
  REL_MAT_PRODUCTS_OF_ORDER,
  UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER,
  UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER,
  UPDATE_TOOL_PRODUCT_INFO_OF_ORDER,
  UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER,
} from '../types/ordersTypes';
import {
  DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET,
  DELETE_PRODUCT_OF_ORDER_SOCKET,
  DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET,
  DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET,
  NEW_RANDOM_PRODUCTS_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET,
  UPDATE_REL_MAT_PRODUCT_OF_ORDER_REDUCER_SOCKET,
  UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET,
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
      if (Array.isArray(payload)) {
        return [...productsOfOrders, ...payload];
      } else {
        return [...productsOfOrders, payload];
      }
    }

    case NEW_RANDOM_PRODUCTS_OF_ORDER_SOCKET: {
      if (Array.isArray(payload)) {
        return [...productsOfOrders, ...payload];
      } else {
        return [...productsOfOrders, payload];
      }
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

    case UPDATE_PRODUCT_INFO_OF_ORDER_SOCKET: {
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

    case UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER: {
      const result = dryMixedProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case UPDATE_DRY_MIXED_PRODUCT_INFO_OF_ORDER_SOCKET: {
      const result = dryMixedProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_DRY_MIXED_PRODUCT_OF_ORDER_SOCKET: {
      const result = dryMixedProductsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

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
      return payload ?? [];
    }

    case UPDATE_ANCHOR_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...anchorProductsOfOrders, payload];
    }

    case UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER: {
      const result = anchorProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case UPDATE_ANCHOR_PRODUCT_INFO_OF_ORDER_SOCKET: {
      const result = anchorProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_ANCHOR_PRODUCT_OF_ORDER_SOCKET: {
      const result = anchorProductsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return anchorProductsOfOrders;
  }
};

export const toolProductsOfOrdersReducer = (toolProductsOfOrders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case TOOL_PRODUCTS_OF_ORDER: {
      return payload ?? [];
    }

    case UPDATE_TOOL_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...toolProductsOfOrders, payload];
    }

    case UPDATE_TOOL_PRODUCT_INFO_OF_ORDER: {
      const result = toolProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case UPDATE_TOOL_PRODUCT_INFO_OF_ORDER_SOCKET: {
      const result = toolProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_TOOL_PRODUCT_OF_ORDER_SOCKET: {
      const result = toolProductsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return toolProductsOfOrders;
  }
};

export const relMatProductsOfOrdersReducer = (
  relMatProductsOfOrders = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case REL_MAT_PRODUCTS_OF_ORDER: {
      return payload ?? [];
    }

    case UPDATE_REL_MAT_PRODUCT_OF_ORDER_REDUCER_SOCKET: {
      return [...relMatProductsOfOrders, payload];
    }

    case UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER: {
      const result = relMatProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case UPDATE_REL_MAT_PRODUCT_INFO_OF_ORDER_SOCKET: {
      const result = relMatProductsOfOrders.map((el) => {
        if (el?.id === payload?.id) {
          return { ...payload };
        }

        return el;
      });

      return result;
    }

    case DELETE_REL_MAT_PRODUCT_OF_ORDER_SOCKET: {
      const result = relMatProductsOfOrders.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return relMatProductsOfOrders;
  }
};
