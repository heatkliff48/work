import { FULL_RECIPE } from '../types/recipeTypes';
import { NEW_RECIPE_SOCKET } from '../types/socketTypes/socket';

export const recipeReducer = (recipe = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_RECIPE: {
      return payload;
    }
    case NEW_RECIPE_SOCKET: {
      return [...recipe, payload];
    }
    default:
      return recipe;
  }
};
