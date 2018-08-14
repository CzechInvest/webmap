import * as actions from './actions';
import { Record } from 'immutable';
import Baselayer from './Baselayer.react';

const InitialState = new Record({
  visible: true,
  opacity: 1,
  activeLayer: Baselayer.layerType.ORTOFOTO,
});

const initialState = new InitialState();

export default function baselayerReducer(state = initialState, action) {

  switch (action.type) {

    case actions.SET_BASELAYER_VISIBILITY: {
      return state.set('visible', action.payload.visible);
    }

    case actions.SET_BASELAYER_OPACITY: {
      return state.set('opacity', action.payload.opacity);
    }

    case actions.SET_BASELAYER_TYPE: {
      return state.set('activeLayer', action.payload.type);
    }

    default:
      return state;
  }
}
