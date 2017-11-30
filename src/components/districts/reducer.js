import * as actions from './actions';
import { Record, OrderedMap } from 'immutable';


const InitialState = new Record({
  districts: new OrderedMap()
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('districts', new OrderedMap());


export default function districtsReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

    case actions.ADD_DISTRICT_TO_COMPARE: {
      return state.setIn(['districts', action.payload.id], action.payload.properties);
    }

    case actions.REMOVE_DISTRICT_TO_COMPARE: {
      return state.removeIn(['districts', action.payload.id]);
    }

    default:
      return state;

  }
}
