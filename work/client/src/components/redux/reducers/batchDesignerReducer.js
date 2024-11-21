import {
  UPDATE_BATCH_BUTTON_STATUS,
  UPDATE_BATCH_STATE,
  ADD_BATCH_STATE,
  CLEAR_BATCH_DESIGNER,
} from '../types/productionBatchLogTypes';

const batchDesignerReducer = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_BATCH_BUTTON_STATUS: {
      const { id, isButtonLocked } = payload;
      const newState = state?.map((el) => {
        if (el.id === id) return { ...el, isButtonLocked };
        return el;
      });

      return newState;
    }

    case CLEAR_BATCH_DESIGNER: {
      return [];
    }

    case ADD_BATCH_STATE: {
      if (state?.find((el) => el.id === payload.id)) {
        return state;
      }
      return [...state, payload];
    }

    case UPDATE_BATCH_STATE: {
      const { id, cakes_in_batch, cakes_residue } = payload;
      const newState = state?.map((el) => {
        if (el.id === id)
          return {
            ...el,
            cakes_in_batch,
            cakes_residue,
          };
        return el;
      });

      return newState;
    }
    default:
      return state;
  }
};

export default batchDesignerReducer;
