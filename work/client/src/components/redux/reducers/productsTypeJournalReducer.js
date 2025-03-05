import {
  FULL_DRY_MIXES_JOURNAL,
  FULL_RELATED_MATERIALS_JOURNAL,
} from '../types/productsTypeJournalTypes';
import {
  NEW_DRY_MIXES_JOURNAL_SOCKET,
  NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
} from '../types/socketTypes/socket';

export const dryMixesJournalReducer = (dryMixesJournal = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_DRY_MIXES_JOURNAL: {
      return payload;
    }
    case NEW_DRY_MIXES_JOURNAL_SOCKET: {
      return [...dryMixesJournal, payload];
    }
    default:
      return dryMixesJournal;
  }
};

export const relatedMaterialsJournalReducer = (
  relatedMaterialsJournal = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_RELATED_MATERIALS_JOURNAL: {
      return payload;
    }
    case NEW_RELATED_MATERIALS_JOURNAL_SOCKET: {
      return [...relatedMaterialsJournal, payload];
    }
    default:
      return relatedMaterialsJournal;
  }
};
