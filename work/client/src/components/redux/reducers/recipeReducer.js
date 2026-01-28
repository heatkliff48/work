import { FULL_RECIPE } from '../types/recipeTypes';
import {
  NEED_DELETE_RECIPE_SOCKET,
  NEW_RECIPE_SOCKET,
  UPDATE_NEW_RECIPE_SOCKET,
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
    case UPDATE_NEW_RECIPE_SOCKET: {
      console.log(payload, 'payload recipeReducer.js line 18');

      const recipeUpdate = recipe.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return recipeUpdate;
    }
    case NEED_DELETE_RECIPE_SOCKET: {
      const result = recipe.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return recipe;
  }
};
