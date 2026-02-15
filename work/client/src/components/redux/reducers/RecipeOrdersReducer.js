import showMessage from '#components/Utils/showMessage.js';
import {
  DELETE_MAIN_RAW_MAT_CONSUMPTION,
  GET_MAIN_RAW_MAT_CONSUMPTION,
  ADD_NEW_MAIN_RAW_MAT_CONSUMPTION,
  RAW_MAT_CONSUMPTION,
  RECIPE_ORDERS_DATA,
} from '../types/recipeTypes';
import {
  DELETE_RAW_MAT_CONSUMPTION_SOCKET,
  NEES_DELETE_MATERIAL_PLAN_SOCKET,
  NEW_MATERIAL_PLAN_SOCKET,
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
      console.log(payload, 'payload RecipeOrdersReducer.js line 52');
      const result = rawMatConsumption.map((el) => {
        if (el.id === payload[1].id) return payload[1];
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

export const mainRawMatConsumptionReducer = (
  mainRawMatConsumption = [],
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MAIN_RAW_MAT_CONSUMPTION: {
      return payload ?? mainRawMatConsumption;
    }

    case ADD_NEW_MAIN_RAW_MAT_CONSUMPTION: {
      return [...mainRawMatConsumption, payload];
    }

    case DELETE_MAIN_RAW_MAT_CONSUMPTION: {
      return mainRawMatConsumption.filter((el) => el.id !== payload);
    }

    default:
      return mainRawMatConsumption;
  }
};
