export const SET_ZOOM = 'SET_ZOOM';
export const SET_CENTER = 'SET_CENTER';

export const setZoom = zoom => ({
  type: SET_ZOOM,
  payload: {
    zoom
  }
});

export const setCenter = (x, y, projCode) => ({
  type: SET_CENTER,
  payload: {
    x,
    y,
    projCode
  }
});
