import {
  ADD_NEW_ANCHOR,
  ADD_NEW_DRY_MIXES_JOURNAL,
  ADD_NEW_RELATED_MATERIALS_JOURNAL,
  ADD_NEW_TOOL,
  GET_FULL_ANCHOR,
  GET_FULL_DRY_MIXES_JOURNAL,
  GET_FULL_RELATED_MATERIALS_JOURNAL,
  GET_FULL_TOOL,
  UPDATE_NEW_ANCHOR,
  UPDATE_NEW_DRY_MIXES_JOURNAL,
  UPDATE_NEW_RELATED_MATERIALS_JOURNAL,
  UPDATE_NEW_TOOL,
} from '../types/productsTypeJournalTypes';

export const getDryMixesJournal = () => {
  return {
    type: GET_FULL_DRY_MIXES_JOURNAL,
  };
};

export const addNewDryMixesJournal = (dryMixesJournal) => {
  return {
    type: ADD_NEW_DRY_MIXES_JOURNAL,
    payload: dryMixesJournal,
  };
};

export const updateDryMixesJournal = (dryMixesJournal) => {
  return {
    type: UPDATE_NEW_DRY_MIXES_JOURNAL,
    payload: dryMixesJournal,
  };
};

export const getRelatedMaterialsJournal = () => {
  return {
    type: GET_FULL_RELATED_MATERIALS_JOURNAL,
  };
};

export const addNewRelatedMaterialsJournal = (relatedMaterialsJournal) => {
  return {
    type: ADD_NEW_RELATED_MATERIALS_JOURNAL,
    payload: relatedMaterialsJournal,
  };
};

export const updateRelatedMaterialsJournal = (relatedMaterialsJournal) => {
  return {
    type: UPDATE_NEW_RELATED_MATERIALS_JOURNAL,
    payload: relatedMaterialsJournal,
  };
};

export const getAnchor = () => {
  return {
    type: GET_FULL_ANCHOR,
  };
};

export const addNewAnchor = (anchor) => {
  return {
    type: ADD_NEW_ANCHOR,
    payload: anchor,
  };
};

export const updateAnchor = (anchor) => {
  return {
    type: UPDATE_NEW_ANCHOR,
    payload: anchor,
  };
};

export const getTool = () => {
  return {
    type: GET_FULL_TOOL,
  };
};

export const addNewTool = (tool) => {
  return {
    type: ADD_NEW_TOOL,
    payload: tool,
  };
};

export const updateTool = (tool) => {
  return {
    type: UPDATE_NEW_TOOL,
    payload: tool,
  };
};
