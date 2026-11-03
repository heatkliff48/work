import {
  FULL_WAREHOUSE_SAND,
  FULL_WAREHOUSE_LIME,
  FULL_WAREHOUSE_CEMENT,
  FULL_WAREHOUSE_GYPSUM,
  FULL_WAREHOUSE_GYPSUM_STONE,
  FULL_WAREHOUSE_ALUMINUM1,
  FULL_WAREHOUSE_ALUMINUM2,
  FULL_WAREHOUSE_GRINDING_BALLS,
  FULL_WAREHOUSE_AAC,
  FULL_WAREHOUSE_SAND_SLURRY,
  FULL_WAREHOUSE_PALLETS,
  FULL_WAREHOUSE_PLASTICS,
  FULL_WAREHOUSE_SAND_POWDER,
  FULL_WAREHOUSE_RELEASE_OIL,
} from '../types/warehouseRawMaterialsTypes';
import {
  NEED_DELETE_WAREHOUSE_SAND_SOCKET,
  NEED_UPDATE_WAREHOUSE_SAND_SOCKET,
  NEW_WAREHOUSE_SAND_SOCKET,
  NEED_DELETE_WAREHOUSE_LIME_SOCKET,
  NEED_UPDATE_WAREHOUSE_LIME_SOCKET,
  NEW_WAREHOUSE_LIME_SOCKET,
  NEED_DELETE_WAREHOUSE_CEMENT_SOCKET,
  NEED_UPDATE_WAREHOUSE_CEMENT_SOCKET,
  NEW_WAREHOUSE_CEMENT_SOCKET,
  NEED_DELETE_WAREHOUSE_GYPSUM_SOCKET,
  NEED_UPDATE_WAREHOUSE_GYPSUM_SOCKET,
  NEW_WAREHOUSE_GYPSUM_SOCKET,
  NEED_DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  NEED_UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET,
  NEW_WAREHOUSE_GYPSUM_STONE_SOCKET,
  NEED_DELETE_WAREHOUSE_ALUMINUM1_SOCKET,
  NEED_UPDATE_WAREHOUSE_ALUMINUM1_SOCKET,
  NEW_WAREHOUSE_ALUMINUM1_SOCKET,
  NEED_DELETE_WAREHOUSE_ALUMINUM2_SOCKET,
  NEED_UPDATE_WAREHOUSE_ALUMINUM2_SOCKET,
  NEW_WAREHOUSE_ALUMINUM2_SOCKET,
  NEED_DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  NEED_UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET,
  NEW_WAREHOUSE_GRINDING_BALLS_SOCKET,
  NEED_DELETE_WAREHOUSE_AAC_SOCKET,
  NEED_UPDATE_WAREHOUSE_AAC_SOCKET,
  NEW_WAREHOUSE_AAC_SOCKET,
  NEW_WAREHOUSE_SAND_SLURRY_SOCKET,
  NEED_UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET,
  NEW_WAREHOUSE_PALLETS_SOCKET,
  NEED_UPDATE_WAREHOUSE_PALLETS_SOCKET,
  NEED_DELETE_WAREHOUSE_PALLETS_SOCKET,
  NEW_WAREHOUSE_PLASTICS_SOCKET,
  NEED_UPDATE_WAREHOUSE_PLASTICS_SOCKET,
  NEED_DELETE_WAREHOUSE_PLASTICS_SOCKET,
  NEW_WAREHOUSE_SAND_POWDER_SOCKET,
  NEED_UPDATE_WAREHOUSE_SAND_POWDER_SOCKET,
  NEED_DELETE_WAREHOUSE_SAND_POWDER_SOCKET,
  NEW_WAREHOUSE_RELEASE_OIL_SOCKET,
  NEED_UPDATE_WAREHOUSE_RELEASE_OIL_SOCKET,
  NEED_DELETE_WAREHOUSE_RELEASE_OIL_SOCKET,
} from '../types/socketTypes/socket';
import showMessage from '#components/Utils/showMessage.js';

// Sequelize update with returning sends [count, row] or [count, rows].
// A single row in the second slot has no id when that slot is the whole list,
// so matching payload[1].id never updates the stored rows.
const rowsFromUpdatePayload = (payload) => {
  if (payload == null) return [];

  if (Array.isArray(payload) && typeof payload[0] === 'number') {
    const rows = payload[1];
    if (Array.isArray(rows)) return rows.filter((row) => row?.id != null);
    if (rows?.id != null) return [rows];
    return [];
  }

  if (Array.isArray(payload)) return payload.filter((row) => row?.id != null);
  if (payload.id != null) return [payload];
  return [];
};

const mergeWarehouseRows = (rows, payload) => {
  const incoming = rowsFromUpdatePayload(payload);
  if (!incoming.length || !Array.isArray(rows)) return rows;

  const byId = new Map(incoming.map((row) => [String(row.id), row]));
  let changed = false;

  const next = rows.map((row) => {
    const updated = byId.get(String(row.id));
    if (!updated) return row;
    changed = true;
    byId.delete(String(row.id));
    return updated;
  });

  if (byId.size > 0) {
    changed = true;
    next.push(...byId.values());
  }

  return changed ? next : rows;
};

// Sand
export const warehouseSandReducer = (warehouseSand = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_SAND: {
      return payload;
    }
    case NEW_WAREHOUSE_SAND_SOCKET: {
      return [...warehouseSand, payload];
    }
    case NEED_DELETE_WAREHOUSE_SAND_SOCKET: {
      const result = warehouseSand.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_SAND_SOCKET: {
      return mergeWarehouseRows(warehouseSand, payload);
    }
    default:
      return warehouseSand;
  }
};

// Lime
export const warehouseLimeReducer = (warehouseLime = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_LIME: {
      return payload;
    }
    case NEW_WAREHOUSE_LIME_SOCKET: {
      return [...warehouseLime, payload];
    }
    case NEED_DELETE_WAREHOUSE_LIME_SOCKET: {
      const result = warehouseLime.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_LIME_SOCKET: {
      return mergeWarehouseRows(warehouseLime, payload);
    }
    default:
      return warehouseLime;
  }
};

// Cement
export const warehouseCementReducer = (warehouseCement = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_CEMENT: {
      return payload;
    }
    case NEW_WAREHOUSE_CEMENT_SOCKET: {
      return [...warehouseCement, payload];
    }
    case NEED_DELETE_WAREHOUSE_CEMENT_SOCKET: {
      const result = warehouseCement.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_CEMENT_SOCKET: {
      return mergeWarehouseRows(warehouseCement, payload);
    }
    default:
      return warehouseCement;
  }
};

// Gypsum
export const warehouseGypsumReducer = (warehouseGypsum = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_GYPSUM: {
      return payload;
    }
    case NEW_WAREHOUSE_GYPSUM_SOCKET: {
      return [...warehouseGypsum, payload];
    }
    case NEED_DELETE_WAREHOUSE_GYPSUM_SOCKET: {
      const result = warehouseGypsum.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_GYPSUM_SOCKET: {
      return mergeWarehouseRows(warehouseGypsum, payload);
    }
    default:
      return warehouseGypsum;
  }
};

// Gypsum stone
export const warehouseGypsumStoneReducer = (warehouseGypsumStone = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_GYPSUM_STONE: {
      return payload;
    }
    case NEW_WAREHOUSE_GYPSUM_STONE_SOCKET: {
      return [...warehouseGypsumStone, payload];
    }
    case NEED_DELETE_WAREHOUSE_GYPSUM_STONE_SOCKET: {
      const result = warehouseGypsumStone.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_GYPSUM_STONE_SOCKET: {
      return mergeWarehouseRows(warehouseGypsumStone, payload);
    }
    default:
      return warehouseGypsumStone;
  }
};

// Aluminum1
export const warehouseAluminum1Reducer = (warehouseAluminum1 = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_ALUMINUM1: {
      return payload;
    }
    case NEW_WAREHOUSE_ALUMINUM1_SOCKET: {
      return [...warehouseAluminum1, payload];
    }
    case NEED_DELETE_WAREHOUSE_ALUMINUM1_SOCKET: {
      const result = warehouseAluminum1.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_ALUMINUM1_SOCKET: {
      return mergeWarehouseRows(warehouseAluminum1, payload);
    }
    default:
      return warehouseAluminum1;
  }
};

// Aluminum2
export const warehouseAluminum2Reducer = (warehouseAluminum2 = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_ALUMINUM2: {
      return payload;
    }
    case NEW_WAREHOUSE_ALUMINUM2_SOCKET: {
      return [...warehouseAluminum2, payload];
    }
    case NEED_DELETE_WAREHOUSE_ALUMINUM2_SOCKET: {
      const result = warehouseAluminum2.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_ALUMINUM2_SOCKET: {
      return mergeWarehouseRows(warehouseAluminum2, payload);
    }
    default:
      return warehouseAluminum2;
  }
};

// Grinding Balls
export const warehouseGrindingBallsReducer = (
  warehouseGrindingBalls = [],
  action,
) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_GRINDING_BALLS: {
      return payload;
    }
    case NEW_WAREHOUSE_GRINDING_BALLS_SOCKET: {
      return [...warehouseGrindingBalls, payload];
    }
    case NEED_DELETE_WAREHOUSE_GRINDING_BALLS_SOCKET: {
      const result = warehouseGrindingBalls.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_GRINDING_BALLS_SOCKET: {
      return mergeWarehouseRows(warehouseGrindingBalls, payload);
    }
    default:
      return warehouseGrindingBalls;
  }
};

// AAC
export const warehouseAACReducer = (warehouseAAC = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_AAC: {
      return payload;
    }
    case NEW_WAREHOUSE_AAC_SOCKET: {
      return [...warehouseAAC, payload];
    }
    case NEED_DELETE_WAREHOUSE_AAC_SOCKET: {
      const result = warehouseAAC.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_AAC_SOCKET: {
      return mergeWarehouseRows(warehouseAAC, payload);
    }
    default:
      return warehouseAAC;
  }
};

// Sand Slurry
export const warehouseSandSlurryReducer = (warehouseSandSlurry = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_SAND_SLURRY: {
      return payload;
    }
    case NEW_WAREHOUSE_SAND_SLURRY_SOCKET: {
      if (payload?.isNeedCheck) {
        showMessage('You have a new task!', 'info');
      }
      return [...warehouseSandSlurry, payload];
    }
    case NEED_UPDATE_WAREHOUSE_SAND_SLURRY_SOCKET: {
      return mergeWarehouseRows(warehouseSandSlurry, payload);
    }
    default:
      return warehouseSandSlurry;
  }
};

// Pallets
export const warehousePalletsReducer = (warehousePallets = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_PALLETS: {
      return payload;
    }
    case NEW_WAREHOUSE_PALLETS_SOCKET: {
      return [...warehousePallets, payload];
    }
    case NEED_DELETE_WAREHOUSE_PALLETS_SOCKET: {
      const result = warehousePallets.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_PALLETS_SOCKET: {
      return mergeWarehouseRows(warehousePallets, payload);
    }
    default:
      return warehousePallets;
  }
};

// Plastics
export const warehousePlasticsReducer = (warehousePlastics = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_PLASTICS: {
      return payload;
    }
    case NEW_WAREHOUSE_PLASTICS_SOCKET: {
      return [...warehousePlastics, payload];
    }
    case NEED_DELETE_WAREHOUSE_PLASTICS_SOCKET: {
      const result = warehousePlastics.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_PLASTICS_SOCKET: {
      return mergeWarehouseRows(warehousePlastics, payload);
    }
    default:
      return warehousePlastics;
  }
};

// Sand Powder
export const warehouseSandPowderReducer = (warehouseSandPowder = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_SAND_POWDER: {
      return payload;
    }
    case NEW_WAREHOUSE_SAND_POWDER_SOCKET: {
      return [...warehouseSandPowder, payload];
    }
    case NEED_DELETE_WAREHOUSE_SAND_POWDER_SOCKET: {
      const result = warehouseSandPowder.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_SAND_POWDER_SOCKET: {
      return mergeWarehouseRows(warehouseSandPowder, payload);
    }
    default:
      return warehouseSandPowder;
  }
};

// Release Oil
export const warehouseReleaseOilReducer = (warehouseReleaseOil = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case FULL_WAREHOUSE_RELEASE_OIL: {
      return payload;
    }
    case NEW_WAREHOUSE_RELEASE_OIL_SOCKET: {
      return [...warehouseReleaseOil, payload];
    }
    case NEED_DELETE_WAREHOUSE_RELEASE_OIL_SOCKET: {
      const result = warehouseReleaseOil.filter((el) => el.id !== payload);
      return result;
    }
    case NEED_UPDATE_WAREHOUSE_RELEASE_OIL_SOCKET: {
      return mergeWarehouseRows(warehouseReleaseOil, payload);
    }
    default:
      return warehouseReleaseOil;
  }
};
