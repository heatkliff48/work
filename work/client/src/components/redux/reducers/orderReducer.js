import {
  DELETE_ORDER,
  NEW_ORDER,
  ORDERS_LIST,
  NEW_CONTACT_OF_ORDER,
  NEW_DELIVERY_OF_ORDER,
  STATUS_OF_ORDER,
  DATA_SHIP_ORDER,
} from '../types/ordersTypes';

export const ordersReducer = (orders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LIST: {
      return payload;
    }

    case NEW_ORDER: {
      return [...orders, payload];
    }

    case DATA_SHIP_ORDER: {
      const { order_id, shipping_date } = payload;
      const result = orders.map((order) => {
        if (order.id === order_id) {
          return { ...order, shipping_date };
        }
        return order;
      });
      return result;
    }

    case DELETE_ORDER: {
      const result = orders.filter((el) => el.id !== payload);
      return result;
    }

    case NEW_CONTACT_OF_ORDER: {
      const { contact_id, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, contact_id };
        return order;
      });
    }

    case NEW_DELIVERY_OF_ORDER: {
      const { address_id, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, del_adr_id: address_id };
        return order;
      });
    }

    case STATUS_OF_ORDER: {
      const { status, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, status };
        return order;
      });
    }

    default:
      return orders;
  }
};
