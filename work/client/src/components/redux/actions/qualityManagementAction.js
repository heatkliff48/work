import {
  ADD_NEW_QUALITY_MANAGEMENT_DATA,
  DELETE_QUALITY_MANAGEMENT_DATA,
  GET_FULL_QUALITY_MANAGEMENT_DATA,
  UPDATE_NEW_QUALITY_MANAGEMENT_DATA,
} from '../types/qualityManagementTypes';

export const getQualityManagement = () => {
  return {
    type: GET_FULL_QUALITY_MANAGEMENT_DATA,
  };
};

export const addNewQualityManagement = (qualityManagementData) => {
  return {
    type: ADD_NEW_QUALITY_MANAGEMENT_DATA,
    payload: qualityManagementData,
  };
};

export const updateQualityManagement = (qualityManagementData) => {
  return {
    type: UPDATE_NEW_QUALITY_MANAGEMENT_DATA,
    payload: qualityManagementData,
  };
};

export const deleteQualityManagement = (qualityManagementDataID) => {
  return {
    type: DELETE_QUALITY_MANAGEMENT_DATA,
    payload: qualityManagementDataID,
  };
};
