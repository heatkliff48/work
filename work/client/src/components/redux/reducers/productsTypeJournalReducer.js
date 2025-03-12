import {
  FULL_ANCHOR,
  FULL_DRY_MIXES_JOURNAL,
  FULL_RELATED_MATERIALS_JOURNAL,
  FULL_TOOL,
} from '../types/productsTypeJournalTypes';
import {
  NEW_ANCHOR_SOCKET,
  NEW_DRY_MIXES_JOURNAL_SOCKET,
  NEW_RELATED_MATERIALS_JOURNAL_SOCKET,
  NEW_TOOL_SOCKET,
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

export const anchorReducer = (anchor = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_ANCHOR: {
      return payload;
    }
    case NEW_ANCHOR_SOCKET: {
      return [...anchor, payload];
    }
    default:
      return anchor;
  }
};

export const toolReducer = (tool = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_TOOL: {
      return payload;
    }
    case NEW_TOOL_SOCKET: {
      return [...tool, payload];
    }
    default:
      return tool;
  }
};
