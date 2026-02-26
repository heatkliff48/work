import showMessage from '#components/Utils/showMessage.js';
import {
  NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  RAW_MAT_CONSUMPTION,
  RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  RECIPE_ORDERS_DATA,
} from '../types/recipeTypes';
import {
  DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  DELETE_RAW_MAT_CONSUMPTION_SOCKET,
  NEES_DELETE_MATERIAL_PLAN_SOCKET,
  NEW_MATERIAL_PLAN_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET,
  NEW_RAW_MAT_CONSUMPTION_SOCKET,
  UPDT_RAW_MAT_CONSUMPTION_SOCKET,
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

    case UPDT_RAW_MAT_CONSUMPTION_SOCKET: {
      const result = rawMatConsumption.map((el) => {
        if (el.id === payload.id) return payload;
        return el;
      });
      return result;
    }

    case DELETE_RAW_MAT_CONSUMPTION_SOCKET: {
      return rawMatConsumption.filter((el) => el.id !== payload);
    }

    default:
      return rawMatConsumption;
  }
};

export const rawMatConsumptionCurrentMoldsReducer = (
  rawMatConsumptionCurrentMolds = [],
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case RAW_MAT_CONSUMPTION_CURRENT_MOLDS: {
      return payload ?? rawMatConsumptionCurrentMolds;
    }

    case NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET: {
      return [...rawMatConsumptionCurrentMolds, payload];
    }

    case DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS_SOCKET: {
      return rawMatConsumptionCurrentMolds.filter((el) => el.batch_id !== payload);
    }

    default:
      return rawMatConsumptionCurrentMolds;
  }
};
