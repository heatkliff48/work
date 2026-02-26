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
  GET_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  ADD_NEW_MAIN_RAW_MAT_CONSUMPTION,
  DELETE_MAIN_RAW_MAT_CONSUMPTION,
  UPDATE_RECIPE,
  UPDATE_RAW_MAT_CONSUMPTION,
  ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  DESTROY_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
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

export const updateRawMatConsumption = (rawMatConsumption) => {
  return {
    type: UPDATE_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};

export const deleteRawMatConsumption = (rawMatConsumption) => {
  return {
    type: DELETE_RAW_MAT_CONSUMPTION,
    payload: rawMatConsumption,
  };
};

export const getRawMatConsumptionCurrentMolds = () => {
  return {
    type: GET_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
  };
};

export const clearRawMatConsumptionCurrentMolds = (raw) => {
  return {
    type: GET_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    payload: raw,
  };
};

export const addNewRawMatConsumptionCurrentMolds = (
  rawMatConsumptionCurrentMolds,
) => {
  return {
    type: ADD_NEW_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    payload: rawMatConsumptionCurrentMolds,
  };
};

export const deleteRawMatConsumptionCurrentMolds = (
  rawMatConsumptionCurrentMolds,
) => {
  return {
    type: DELETE_RAW_MAT_CONSUMPTION_CURRENT_MOLDS,
    payload: rawMatConsumptionCurrentMolds,
  };
};
