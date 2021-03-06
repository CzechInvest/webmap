import * as actions from './actions';
import { Record } from 'immutable';


const InitialState = new Record({
  title: null,
  env: null,
});
const initialState = new InitialState();

export default function appReducer(state = initialState, action) {

  switch (action.type) {
    case actions.START_APP: {
      return state.set('env', action.payload.environment);
    }


    case actions.SET_TITLE: {
      return state.set('title', action.payload.val);
    }


    default:
      return state;
  }
}
