import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = new Record({
  styleId: 'dark-v9',
  token: 'pk.eyJ1IjoiZmlsaXB6YXZhIiwiYSI6ImNqMmdlM3J1NzA2d2EyeHRoNmQ1djg2NGUifQ.JS_hvk8MMHglEhhtRE2ZVA',
  visible: true,
  opacity: 1,
  tileSize: 256
});
const initialState = new InitialState();

export default function baselayerReducer(state = initialState, action) {

  switch (action.type) {
    case actions.SET_BASELAYER_STYLE: {
      return state.set('styleId', action.payload.styleId);
    }

    case actions.SET_BASELAYER_VISIBILITY: {
      return state.set('visible', action.payload.visible);
    }


    case actions.SET_BASELAYER_OPACITY: {
      return state.set('opacity', action.payload.opacity);
    }



    default:
      return state;
  }
}
