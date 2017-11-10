export const SET_CENTER = 'SET_CENTER';
export const SET_LAYER_VISIBILITY = 'SET_LAYER_VISIBILITY';

export const setCenter = ({ lat, lng }) => ({
  type: SET_CENTER,
  payload: {
    lat,
    lng
  }
});

export const setLayerVisibility = (layerName, visible) => ({
  type: SET_LAYER_VISIBILITY,
  payload: {
    layerName,
    visible
  }
});