import * as actions from './actions';
import { Record, OrderedMap } from 'immutable';
import env from '../../environment';
import Layer from './layer';

const lrs = new OrderedMap(env.layers.map((l, i) => [ i, new Layer(l).set('id', i) ]));

const InitialState = new Record({
  layers: lrs
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('layers', lrs);


export default function layerReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

    case actions.SET_LAYER_VISIBILITY: {
      return state.setIn(['layers', action.payload.id, 'visible'], action.payload.visible);
    }

    default:
      return state;
  }
}
