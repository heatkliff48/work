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

      if (Array.isArray(payload) && payload[1]?.id) {
        return recipe.map((el) => (el.id === payload[1].id ? payload[1] : el));
      }
      if (payload?.id) {
        return recipe.map((el) => (el.id === payload.id ? payload : el));
      }
      if (Array.isArray(payload)) {
        const map = new Map(payload.map((item) => [item.id, item]));
        return recipe.map((el) => (map.has(el.id) ? map.get(el.id) : el));
      }
      return recipe;
    }
    case NEED_DELETE_RECIPE_SOCKET: {
      const result = recipe.filter((el) => el.id !== payload);
      return result;
    }

    default:
      return recipe;
  }
};
