import { GET_ALL_PAGES } from "../types/rolesTypes";

export const getPagesList = () => {
  return {
    type: GET_ALL_PAGES,
  };
};
