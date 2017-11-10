import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = new Record({
  x: 1744000,
  y: 6442975,
  z: 7,
  projCode: 'EPSG:3857'
});
const initialState = new InitialState();


const setInitalState = (state) => initialState
  .set('x', state.x)
  .set('y', state.y);


export default function viewReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {
    case actions.SET_CENTER: {
      return state.set('y', action.payload.y)
        .set('x', action.payload.x);
    }


    case actions.SET_ZOOM: {  
      return state.set('z', action.payload.zoom);
    }

    default:
      return state;
  }
}
