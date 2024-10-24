import {
  UPDATE_BATCH_BUTTON_STATUS,
  UPDATE_BATCH_STATE,
  ADD_BATCH_STATE,
} from '../types/productionBatchLogTypes';

const batchDesignerReducer = (state = [], action) => {
  //state = []
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

    case ADD_BATCH_STATE: {
      return [...state, payload];
    }

    case UPDATE_BATCH_STATE: {
      const { id, cakes_in_batch, cakes_residue } = payload;
      const newState = state?.map((el) => {
        if (el.id === id)
          return {
            ...el,
            cakes_in_batch: cakes_in_batch,
            cakes_residue: cakes_residue,
            isButtonLocked: false,
          };
        return el;
      });

      return newState;
    }
    default:
      return [];
  }
};

export default batchDesignerReducer;
