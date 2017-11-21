export const SET_BASELAYER_STYLE = 'SET_BASELAYER_STYLE';
export const SET_BASELAYER_VISIBILITY = 'SET_BASELAYER_VISIBILITY';

export const setBaselayerStyle = styleId => ({
  type: SET_BASELAYER_STYLE,
  payload: {
    styleId
  }
});

export const setBaselayerVisibility = visible => ({
  type: SET_BASELAYER_VISIBILITY,
  payload: {
    visible
  }
});
