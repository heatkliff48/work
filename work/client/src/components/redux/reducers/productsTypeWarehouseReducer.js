import {
  FULL_ANCHORS_WAREHOUSE,
  FULL_DRY_MIXES_WAREHOUSE,
  FULL_RELATED_MATERIALS_WAREHOUSE,
  FULL_TOOLS_WAREHOUSE,
} from '../types/productsTypeWarehouseTypes';
import {
  ANCHOR_QUANTITYS_SOCKET,
  DRY_MIXES_QUANTITYS_SOCKET,
  NEED_UPDATE_ANCHORS_WAREHOUSE_SOCKET,
  NEED_UPDATE_DRY_MIXES_WAREHOUSE_SOCKET,
  NEED_UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  NEED_UPDATE_TOOLS_WAREHOUSE_SOCKET,
  NEW_ANCHORS_WAREHOUSE_SOCKET,
  NEW_DRY_MIXES_WAREHOUSE_SOCKET,
  NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET,
  NEW_TOOLS_WAREHOUSE_SOCKET,
  REL_MAT_QUANTITYS_SOCKET,
  TOOL_QUANTITYS_SOCKET,
} from '../types/socketTypes/socket';

export const dryMixesWarehouseReducer = (dryMixesWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_DRY_MIXES_WAREHOUSE: {
      return payload;
    }

    case DRY_MIXES_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = dryMixesWarehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case NEW_DRY_MIXES_WAREHOUSE_SOCKET: {
      return [...dryMixesWarehouse, payload];
    }

    case NEED_UPDATE_DRY_MIXES_WAREHOUSE_SOCKET: {
      const result = dryMixesWarehouse.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }

    default:
      return dryMixesWarehouse;
  }
};

export const relatedMaterialsWarehouseReducer = (
  relatedMaterialsWarehouse = [],
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_RELATED_MATERIALS_WAREHOUSE: {
      return payload;
    }

    case REL_MAT_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = relatedMaterialsWarehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case NEW_RELATED_MATERIALS_WAREHOUSE_SOCKET: {
      return [...relatedMaterialsWarehouse, payload];
    }

    case NEED_UPDATE_RELATED_MATERIALS_WAREHOUSE_SOCKET: {
      const result = relatedMaterialsWarehouse.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }

    default:
      return relatedMaterialsWarehouse;
  }
};

export const anchorsWarehouseReducer = (anchorsWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_ANCHORS_WAREHOUSE: {
      return payload;
    }

    case ANCHOR_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = anchorsWarehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case NEW_ANCHORS_WAREHOUSE_SOCKET: {
      return [...anchorsWarehouse, payload];
    }

    case NEED_UPDATE_ANCHORS_WAREHOUSE_SOCKET: {
      const result = anchorsWarehouse.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }

    default:
      return anchorsWarehouse;
  }
};

export const toolsWarehouseReducer = (toolsWarehouse = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_TOOLS_WAREHOUSE: {
      return payload;
    }

    case TOOL_QUANTITYS_SOCKET: {
      const { warehouse_id, total_quantity, ordered_quantity } = payload;

      const result = toolsWarehouse.map((el) => {
        if (el.id === warehouse_id) {
          return { ...el, total_quantity, ordered_quantity };
        }

        return el;
      });
      return result;
    }

    case NEW_TOOLS_WAREHOUSE_SOCKET: {
      return [...toolsWarehouse, payload];
    }

    case NEED_UPDATE_TOOLS_WAREHOUSE_SOCKET: {
      const result = toolsWarehouse.map((el) => {
        if (el.id === payload[1].id) return payload[1];
        return el;
      });
      return result;
    }

    default:
      return toolsWarehouse;
  }
};
