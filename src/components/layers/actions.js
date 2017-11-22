export const SET_VISIBLE_LAYERS = 'SET_VISIBLE_LAYERS';
export const SET_LAYER_VISIBILITY = 'SET_LAYER_VISIBILITY';


export const setVisibleLayers = (layers) => ({
  type: SET_VISIBLE_LAYERS,
  payload: {
    layers
  }
});

export const setLayerVisibility = (id, visible) => ({
  type: SET_LAYER_VISIBILITY,
  payload: {
    id,
    visible
  }
});
