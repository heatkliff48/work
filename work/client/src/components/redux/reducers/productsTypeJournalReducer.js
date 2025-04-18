import {
  FULL_ANCHOR,
  FULL_DRY_MIXES_JOURNAL,
  FULL_RELATED_MATERIALS_JOURNAL,
  FULL_TOOL,
  UPDATE_DRY_MIXES_JOURNAL,
} from '../types/productsTypeJournalTypes';
import {
  NEED_UPDATE_ANCHOR_SOCKET,
  NEED_UPDATE_DRY_MIXES_JOURNAL_SOCKET,
  NEED_UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET,
  NEED_UPDATE_TOOL_SOCKET,
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
    case NEED_UPDATE_DRY_MIXES_JOURNAL_SOCKET: {
      const result = dryMixesJournal.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
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
    case NEED_UPDATE_RELATED_MATERIALS_JOURNAL_SOCKET: {
      const result = relatedMaterialsJournal.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
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
    case NEED_UPDATE_ANCHOR_SOCKET: {
      const result = anchor.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
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
    case NEED_UPDATE_TOOL_SOCKET: {
      const result = tool.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }
    default:
      return tool;
  }
};
