import {
  ADD_NEW_DRY_MIXES_JOURNAL,
  ADD_NEW_RELATED_MATERIALS_JOURNAL,
  GET_FULL_DRY_MIXES_JOURNAL,
  GET_FULL_RELATED_MATERIALS_JOURNAL,
  UPDATE_NEW_DRY_MIXES_JOURNAL,
  UPDATE_NEW_RELATED_MATERIALS_JOURNAL,
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
