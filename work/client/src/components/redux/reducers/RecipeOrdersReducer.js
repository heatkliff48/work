import { RECIPE_ORDERS_DATA } from '../types/recipeTypes';
import {
  NEES_DELETE_MATERIAL_PLAN_SOCKET,
  NEW_MATERIAL_PLAN_SOCKET,
} from '../types/socketTypes/socket';

export const recipeOrdersReducer = (recipeOrders = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case RECIPE_ORDERS_DATA: {
      return payload;
    }

    case NEW_MATERIAL_PLAN_SOCKET: {
      return payload ?? recipeOrders;
    }

    case NEES_DELETE_MATERIAL_PLAN_SOCKET: {
      return recipeOrders.filter((el) => el.id !== payload);
    }

    default:
      return recipeOrders;
  }
};
