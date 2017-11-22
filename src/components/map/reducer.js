import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = new Record({
  lat: 0,
  lng: 0,
  categories: []
});
const initialState = new InitialState();


const setInitalState = (state) => initialState
  .set('lat', state.lat)
  .set('lng', state.lng)
  .set('categories', state.categories);


export default function mapReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {
    case actions.SET_CENTER: {
      return state.set('lat', action.payload.lat)
        .set('lng', action.payload.lng);
    }

    default:
      return state;
  }
}
