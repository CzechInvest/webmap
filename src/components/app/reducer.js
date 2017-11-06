import * as actions from './actions';
import { Record } from 'immutable';


const InitialState = new Record({
  title: null,
});
const initialState = new InitialState();


const setInitalState = (state) => initialState
  .set('title', state.title);


export default function appReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);
  
  switch (action.type) {
    case actions.START_APP: {
      console.log('app started');
      return state;
    }


    case actions.SET_TITLE: {
      return state.set('title', action.payload.val);
    }


    default:
      return state;
  }
}
