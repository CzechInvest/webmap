import * as actions from './actions';
import { Record } from 'immutable';


const InitialState = new Record({
  active: false
});

const initialState = new InitialState();

export default function baselayerReducer(state = initialState, action) {

  switch (action.type) {

    case actions.ACTIVATE_PRINT: {
      return state.set('active', action.payload.active);
    }

    default:
      return state;
  }
}
