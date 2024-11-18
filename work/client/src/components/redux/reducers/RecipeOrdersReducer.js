import { RECIPE_ORDERS_DATA } from '../types/recipeTypes';

export const recipeOrdersReducer = (recipeOrders = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case RECIPE_ORDERS_DATA: {
      return payload;
    }

    default:
      return recipeOrders;
  }
};
