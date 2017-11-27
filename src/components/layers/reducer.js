import * as actions from './actions';
import { Record, OrderedMap } from 'immutable';
import env from '../../environment';
import Layer from './layer';

const lrs = new OrderedMap(env.layers.map((l, i) => [ l.id, new Layer(l) ]));

const InitialState = new Record({
  layers: lrs
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('layers', lrs);


export default function layerReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

    case actions.SET_VISIBLE_LAYERS: {
      return state.update('layers', (layers) => (
        layers.map(l => l.set('visible', action.payload.layers.indexOf(l.id) !== -1))
      ));
    }
    case actions.SET_LAYER_VISIBILITY: {
      return state.setIn(['layers', action.payload.id, 'visible'], action.payload.visible);
    }

    default:
      return state;
  }
}
