import {
  ADD_NEW_RECIPE,
  GET_FULL_RECIPE,
  SAVE_MATERIAL_PLAN,
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

export const saveMaterialPlan = (mat_data) => {
  return {
    type: SAVE_MATERIAL_PLAN,
    payload: mat_data,
  };
};
