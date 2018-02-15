import * as actions from './actions';
import { Record } from 'immutable';


const InitialState = new Record({
  object: null
});

const initialState = new InitialState();

const setInitalState = (state) => initialState;


export default function identificationReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

    case actions.SHOW_OBJECT_INFO: {
      const { featureId, layerId, identifyPoint } = action.payload;
      if (!featureId || !layerId) {
        return state.set('object', null);
      }
      return state.set('object', {featureId, layerId, identifyPoint});
    }

    default:
      return state;

  }
}