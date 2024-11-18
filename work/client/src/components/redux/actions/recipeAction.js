import {
  ADD_NEW_RECIPE,
  GET_FULL_RECIPE,
  SAVE_MATERIAL_PLAN,
  DELETE_RECIPE,
  GET_RECIPE_ORDERS_DATA,
} from '../types/recipeTypes';

export const getRecipe = () => {
  return {
    type: GET_FULL_RECIPE,
  };
};

export const addNewRecipe = (recipe) => {
  return {
    type: ADD_NEW_RECIPE,
    payload: recipe,
  };
};

export const deleteRecipe = (recipe_id) => {
  return {
    type: DELETE_RECIPE,
    payload: recipe_id,
  };
};

// ------------------------------------------
export const getRecipeOrdersData = () => {
  return {
    type: GET_RECIPE_ORDERS_DATA,
  };
};

export const saveMaterialPlan = (mat_data) => {
  return {
    type: SAVE_MATERIAL_PLAN,
    payload: mat_data,
  };
};
