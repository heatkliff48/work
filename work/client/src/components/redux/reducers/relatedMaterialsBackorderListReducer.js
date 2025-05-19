import { FULL_RELATED_MATERIALS_BACKORDER } from '../types/relatedMaterialsBackorderListTypes';
import {
  NEED_UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET,
  NEW_RELATED_MATERIALS_BACKORDER_SOCKET,
} from '../types/socketTypes/socket';

export const relatedMaterialsBackorderListReducer = (
  relatedMaterialsBackorderList = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_RELATED_MATERIALS_BACKORDER: {
      return payload;
    }
    case NEW_RELATED_MATERIALS_BACKORDER_SOCKET: {
      return [...relatedMaterialsBackorderList, payload];
    }
    case NEED_UPDATE_RELATED_MATERIALS_BACKORDER_SOCKET: {
      const result = relatedMaterialsBackorderList.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }
    default:
      return relatedMaterialsBackorderList;
  }
};
