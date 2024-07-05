import { ALL_PAGES } from '../types/rolesTypes';

export const pagesReducer = (pages = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case ALL_PAGES: {
      return payload;
    }

    default:
      return pages;
  }
};
