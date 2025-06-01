import { ADD_NEW_ALDABARAN, GET_ALL_ALDABARAN } from "../types/aldabaranTypes";

export const getAldabaran = () => {
  return {
    type: GET_ALL_ALDABARAN,
  };
};

export const addNewAldabaran = (data) => {
  return {
    type: ADD_NEW_ALDABARAN,
    payload: data,
  };
};

