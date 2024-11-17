import { FULL_RECIPE } from '../types/recipeTypes';
import {
  NEED_DELETE_RECIPE_SOCKET,
  NEW_RECIPE_SOCKET,
} from '../types/socketTypes/socket';

export const recipeReducer = (recipe = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_RECIPE: {
      return payload;
    }
    case NEW_RECIPE_SOCKET: {
      return [...recipe, payload];
    }
    case NEED_DELETE_RECIPE_SOCKET: {
      const result = recipe.filter((el) => el.id !== payload);
      return result;
    }
    default:
      return recipe;
  }
};
