import {
  DELETE_ORDER,
  ORDERS_LIST,
  NEW_CONTACT_OF_ORDER,
  NEW_DELIVERY_OF_ORDER,
  STATUS_OF_ORDER,
  NEW_ORDER,
} from '../types/ordersTypes';
import {
  DATASHIP_ORDER_SOCKET,
  NEW_ORDER_SOCKET,
  PERSON_IN_CHARGE_OF_ORDER_SOCKET,
  STATUS_OF_ORDER_SOCKET,
} from '../types/socketTypes/socket';

export const ordersReducer = (orders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LIST: {
      return payload;
    }

    case NEW_ORDER_SOCKET: {
      return [...orders, payload];
    }
    case NEW_ORDER: {
      if (orders.find((order) => order.id === payload.id)) return orders;

      return [...orders, payload];
    }

    case DATASHIP_ORDER_SOCKET: {
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

    case STATUS_OF_ORDER_SOCKET: {
      const { status, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, status };
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

    case PERSON_IN_CHARGE_OF_ORDER_SOCKET: {
      const { person_in_charge, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, person_in_charge };
        return order;
      });
    }

    default:
      return orders;
  }
};
