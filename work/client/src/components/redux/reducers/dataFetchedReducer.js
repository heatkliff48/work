import { DATA_FETCHED } from '../types/userTypes';

export const dataFetchedReducer = (dataFetched = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case DATA_FETCHED: {
      return payload;
    }

    default:
      return dataFetched;
  }
};
