export const SET_BASELAYER_TYPE = 'SET_BASELAYER_TYPE';
export const SET_BASELAYER_VISIBILITY = 'SET_BASELAYER_VISIBILITY';
export const SET_BASELAYER_OPACITY = 'SET_BASELAYER_OPACITY';

export const setBaselayer = type => ({
  type: SET_BASELAYER_TYPE,
  payload: {
    type
  }
});

export const setBaselayerVisibility = (visible = false) => ({
  type: SET_BASELAYER_VISIBILITY,
  payload: {
    visible
  }
});

export const setBaselayerOpacity = (opacity = 1) => ({
  type: SET_BASELAYER_OPACITY,
  payload: {
    opacity
  }
});
