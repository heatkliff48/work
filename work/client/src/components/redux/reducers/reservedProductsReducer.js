import {
  DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET,
  UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET,
} from '../types/socketTypes/socket';
import {
  LIST_OF_ANCHOR_RESERVED_PRODUCTS,
  LIST_OF_DRY_MIXED_RESERVED_PRODUCTS,
  LIST_OF_REL_MAT_PRODUCTS,
  LIST_OF_RESERVED_PRODUCTS,
  LIST_OF_TOOL_RESERVED_PRODUCTS,
  NEW_ANCHOR_RESERVED_PRODUCT,
  NEW_DRY_MIXED_RESERVED_PRODUCT,
  NEW_REL_MAT_RESERVED_PRODUCT,
  NEW_TOOL_RESERVED_PRODUCT,
  UPD_ANCHOR_RESERVED_PRODUCT,
  UPD_DRY_MIXED_RESERVED_PRODUCT,
  UPD_REL_MAT_PRODUCT,
  UPD_TOOL_RESERVED_PRODUCT,
} from '../types/warehouseTypes';

export const reservedProductsReducer = (reservedProducts = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_RESERVED_PRODUCTS: {
      return payload;
    }

    case UPDATE_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const { orders_products_id, warehouse_id, quantity } = payload;
      const result = reservedProducts.map((el) => {
        if (
          el.warehouse_id == warehouse_id &&
          el.orders_products_id == orders_products_id
        ) {
          return { ...el, quantity: quantity };
        }
        return el;
      });
      return result;
    }

    case NEW_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      if (Array.isArray(payload)) {
        return [...reservedProducts, ...payload];
      }
      return [...reservedProducts, payload];
    }

    case DELETE_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedProducts;
  }
};

export const reservedDryMixedProductsReducer = (
  reservedDryMixedProducts = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_DRY_MIXED_RESERVED_PRODUCTS: {
      return payload;
    }

    case NEW_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      if (Array.isArray(payload)) {
        return [...reservedDryMixedProducts, ...payload];
      }
      return [...reservedDryMixedProducts, payload];
    }

    case UPDATE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const { orders_products_id, warehouse_id, quantity } = payload;
      const result = reservedDryMixedProducts.map((el) => {
        if (
          el.warehouse_id == warehouse_id &&
          el.orders_products_id == orders_products_id
        ) {
          return { ...el, quantity: quantity };
        }
        return el;
      });
      return result;
    }

    case DELETE_DRY_MIXED_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedDryMixedProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedDryMixedProducts;
  }
};

export const reservedAnchorProductsReducer = (
  reservedAnchorProducts = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_ANCHOR_RESERVED_PRODUCTS: {
      return payload;
    }

    case NEW_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      if (Array.isArray(payload)) {
        return [...reservedAnchorProducts, ...payload];
      }
      return [...reservedAnchorProducts, payload];
    }

    case UPDATE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const { orders_products_id, warehouse_id, quantity } = payload;
      const result = reservedAnchorProducts.map((el) => {
        if (
          el.warehouse_id == warehouse_id &&
          el.orders_products_id == orders_products_id
        ) {
          return { ...el, quantity: quantity };
        }
        return el;
      });
      return result;
    }

    case DELETE_ANCHOR_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedAnchorProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedAnchorProducts;
  }
};

export const reservedToolProductsReducer = (reservedToolProducts = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_TOOL_RESERVED_PRODUCTS: {
      return payload;
    }

    case NEW_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      if (Array.isArray(payload)) {
        return [...reservedToolProducts, ...payload];
      }
      return [...reservedToolProducts, payload];
    }

    case UPDATE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const { orders_products_id, warehouse_id, quantity } = payload;
      const result = reservedToolProducts.map((el) => {
        if (
          el.warehouse_id == warehouse_id &&
          el.orders_products_id == orders_products_id
        ) {
          return { ...el, quantity: quantity };
        }
        return el;
      });
      return result;
    }

    case DELETE_TOOL_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedToolProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedToolProducts;
  }
};

export const reservedRelMatProductsReducer = (
  reservedRelMatProducts = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case LIST_OF_REL_MAT_PRODUCTS: {
      return payload;
    }

    case NEW_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      if (Array.isArray(payload)) {
        return [...reservedRelMatProducts, ...payload];
      }
      return [...reservedRelMatProducts, payload];
    }

    case UPDATE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const { orders_products_id, warehouse_id, quantity } = payload;
      const result = reservedRelMatProducts.map((el) => {
        if (
          el.warehouse_id == warehouse_id &&
          el.orders_products_id == orders_products_id
        ) {
          return { ...el, quantity: quantity };
        }
        return el;
      });
      return result;
    }

    case DELETE_REL_MAT_PRODUCT_FROM_RESERVED_LIST_SOCKET: {
      const newReservedProducts = reservedRelMatProducts.filter(
        (el) => el.id !== payload.id
      );

      return newReservedProducts;
    }

    default:
      return reservedRelMatProducts;
  }
};
