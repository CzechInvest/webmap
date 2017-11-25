export const SET_BASELAYER_STYLE = 'SET_BASELAYER_STYLE';
export const SET_BASELAYER_VISIBILITY = 'SET_BASELAYER_VISIBILITY';
export const SET_BASELAYER_OPACITY = 'SET_BASELAYER_OPACITY';

export const setBaselayerStyle = (styleId = 'light-v9') => ({
  type: SET_BASELAYER_STYLE,
  payload: {
    styleId
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
