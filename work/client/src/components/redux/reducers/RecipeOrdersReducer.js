import showMessage from '#components/Utils/showMessage.js';
import { RAW_MAT_CONSUMPTION, RECIPE_ORDERS_DATA } from '../types/recipeTypes';
import {
  DELETE_RAW_MAT_CONSUMPTION_SOCKET,
  NEES_DELETE_MATERIAL_PLAN_SOCKET,
  NEW_MATERIAL_PLAN_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_SOCKET,
} from '../types/socketTypes/socket';

export const recipeOrdersReducer = (recipeOrders = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case RECIPE_ORDERS_DATA: {
      return payload;
    }

    case NEW_MATERIAL_PLAN_SOCKET: {
      showMessage('New material plan has been added', 'success');
      return payload ?? recipeOrders;
    }

    case NEES_DELETE_MATERIAL_PLAN_SOCKET: {
      return recipeOrders.filter((el) => el.id !== payload);
    }

    default:
      return recipeOrders;
  }
};

export const rawMatConsumptionReducer = (rawMatConsumption = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case RAW_MAT_CONSUMPTION: {
      return payload;
    }

    case NEW_RAW_MAT_CONSUMPTION_SOCKET: {
      return [...rawMatConsumption, payload];
    }

    case DELETE_RAW_MAT_CONSUMPTION_SOCKET: {
      return rawMatConsumption.filter((el) => el.id !== payload);
    }

    default:
      return rawMatConsumption;
  }
};
