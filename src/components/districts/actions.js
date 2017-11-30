export const ADD_DISTRICT_TO_COMPARE = 'ADD_DISTRICT_TO_COMPARE';
export const REMOVE_DISTRICT_TO_COMPARE = 'REMOVE_DISTRICT_TO_COMPARE';

export const addDistrictToCompare = (id, properties) => ({
  type: ADD_DISTRICT_TO_COMPARE,
  payload: {
    id,
    properties
  }
});

export const removeDistrictToCompare = (id) => ({
  type: REMOVE_DISTRICT_TO_COMPARE,
  payload: {
    id
  }
});