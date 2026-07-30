import { ORDERS_LIST } from '../types/ordersTypes';
import {
  CHILD_ORDER_SOCKET,
  DATASHIP_ORDER_SOCKET,
  DELETE_ORDER_SOCKET,
  DESCRIPTIOM_ORDER_SOCKET,
  NEW_DELIVERY_PRICE_SOCKET,
  NEW_ORDER_SOCKET,
  PAYMENT_METHOD_SOCKET,
  PERSON_IN_CHARGE_OF_ORDER_SOCKET,
  REMOVE_SECONDARY_CONTACT_ORDER_SOCKET,
  SECONDARY_CONTACT_ORDER_SOCKET,
  STATUS_OF_ORDER_SOCKET,
  UPDATE_ADRESS_OF_ORDER_SOCKET,
  UPDATE_CONTACT_OF_ORDER_SOCKET,
} from '../types/socketTypes/socket';

export const ordersReducer = (orders = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LIST: {
      return payload;
    }

    case NEW_ORDER_SOCKET: {
      // if (orders.find((order) => order.id === payload.id)) return orders;

      return [...orders, payload];
    }

    case CHILD_ORDER_SOCKET: {
      return [...orders, payload];
    }

    case NEW_DELIVERY_PRICE_SOCKET: {
      const { order_id, delivery, delivery_m2 } = payload;

      const result = orders.map((order) => {
        if (order.id === order_id) {
          if (delivery) {
            return { ...order, delivery };
          } else {
            return { ...order, delivery_m2 };
          }
        }
        return order;
      });

      console.log('result orderReducer.js line 42', result);
      return result;
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

    case DESCRIPTIOM_ORDER_SOCKET: {
      const { order_id, description } = payload;

      const result = orders.map((order) => {
        if (order.id === order_id) {
          return { ...order, description };
        }
        return order;
      });

      return result;
    }

    case SECONDARY_CONTACT_ORDER_SOCKET: {
      const { order_id, secondary_contact } = payload;

      const result = orders.map((order) => {
        if (order.id === order_id) {
          return { ...order, secondary_contact };
        }
        return order;
      });

      return result;
    }

    case REMOVE_SECONDARY_CONTACT_ORDER_SOCKET: {
      const order_id = payload;

      const result = orders.map((order) => {
        if (order.id === order_id) {
          return { ...order, secondary_contact: null };
        }
        return order;
      });

      return result;
    }

    case DELETE_ORDER_SOCKET: {
      const result = orders.filter((el) => el.id !== payload);
      return result;
    }

    case UPDATE_CONTACT_OF_ORDER_SOCKET: {
      const { contact_id, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, contact_id };
        return order;
      });
    }

    case UPDATE_ADRESS_OF_ORDER_SOCKET: {
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

    case PERSON_IN_CHARGE_OF_ORDER_SOCKET: {
      const { person_in_charge, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, person_in_charge };
        return order;
      });
    }

    case PAYMENT_METHOD_SOCKET: {
      const { payment_method, order_id } = payload;
      return orders.map((order) => {
        if (order.id === order_id) return { ...order, payment_method };
        return order;
      });
    }

    default:
      return orders;
  }
};
