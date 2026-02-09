import {
  ADD_NEW_RECIPE,
  GET_FULL_RECIPE,
  SAVE_MATERIAL_PLAN,
  DELETE_RECIPE,
  GET_RECIPE_ORDERS_DATA,
  DELETE_MATERIAL_PLAN,
  GET_RAW_MAT_CONSUMPTION,
  ADD_NEW_RAW_MAT_CONSUMPTION,
  DELETE_RAW_MAT_CONSUMPTION,
  GET_MAIN_RAW_MAT_CONSUMPTION,
  ADD_NEW_MAIN_RAW_MAT_CONSUMPTION,
  DELETE_MAIN_RAW_MAT_CONSUMPTION,
  UPDATE_RECIPE,
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

export const updateRecipe = (recipe) => {
  return {
    type: UPDATE_RECIPE,
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

export const deleteMaterialPlan = (mat_plan_id) => {
  return {
    type: DELETE_MATERIAL_PLAN,
    payload: mat_plan_id,
  };
};

// ------------------------------------------

export const getRawMatConsumption = () => {
  return {
    type: GET_RAW_MAT_CONSUMPTION,
  };
};

export const addNewRawMatConsumption = (rawMatConsumption) => {
  return {
    type: ADD_NEW_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};

export const deleteRawMatConsumption = (rawMatConsumption) => {
  return {
    type: DELETE_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};

export const getMainRawMatConsumption = () => {
  return {
    type: GET_MAIN_RAW_MAT_CONSUMPTION,
  };
};

export const clearMainRawMatConsumption = (raw) => {
  return {
    type: GET_MAIN_RAW_MAT_CONSUMPTION,
    payload: raw,
  };
};

export const addNewMainRawMatConsumption = (rawMatConsumption) => {
  return {
    type: ADD_NEW_MAIN_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};

export const deleteMainRawMatConsumption = (rawMatConsumption) => {
  return {
    type: DELETE_MAIN_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};
