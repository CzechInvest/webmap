export const OPEN_CATEGORY = 'OPEN_CATEGORY';
export const CLOSE_CATEGORY = 'CLOSE_CATEGORY';

export const openCategory = (id, x, y) => ({
  type: OPEN_CATEGORY,
  payload: {
    id
  }
});

export const closeCategory = () => ({
  type: CLOSE_CATEGORY,
  payload: {}
});