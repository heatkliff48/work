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
} from '../types/socketTypes/socket';
import showMessage from '#components/Utils/showMessage.js';

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
      const result = warehouseSand.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseLime.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseCement.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseGypsum.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseGypsumStone.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseAluminum1.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseAluminum2.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseGrindingBalls.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseAAC.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseSandSlurry.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehousePallets.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehousePlastics.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
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
      const result = warehouseSandPowder.map((el) => {
        if (el.id === payload[1]?.id) return payload[1];
        return el;
      });
      return result;
    }
    default:
      return warehouseSandPowder;
  }
};
