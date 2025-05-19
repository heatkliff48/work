import {} from '../types/productsTypeJournalTypes';
import {
  ADD_NEW_RELATED_MATERIALS_BACKORDER,
  GET_FULL_RELATED_MATERIALS_BACKORDER,
  UPDATE_NEW_RELATED_MATERIALS_BACKORDER,
} from '../types/relatedMaterialsBackorderListTypes';

export const getRelatedMaterialsBackorder = () => {
  return {
    type: GET_FULL_RELATED_MATERIALS_BACKORDER,
  };
};

export const addNewRelatedMaterialsBackorder = (relatedMaterialsBackorderList) => {
  return {
    type: ADD_NEW_RELATED_MATERIALS_BACKORDER,
    payload: relatedMaterialsBackorderList,
  };
};

export const updateRelatedMaterialsBackorder = (relatedMaterialsBackorderList) => {
  return {
    type: UPDATE_NEW_RELATED_MATERIALS_BACKORDER,
    payload: relatedMaterialsBackorderList,
  };
};
