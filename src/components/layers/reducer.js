import * as actions from './actions';
import { Record, OrderedMap, Map } from 'immutable';

import Layer from './layer';
import DataSet from './dataset';
import lang from '../lang/messages/layers';

const InitialState = new Record({
  layers: {},
  datasets: {}
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('layers', {})
  .set('datasets', {});


export default function layerReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {
    case 'START_APP': {
      const { environment } = action.payload;
      const lrs = new OrderedMap(environment.layers.map((l, i) => [ l.id, new Layer(l) ])).map( l => l.set('title', lang[l.id]) );
      const datasets = new Map(environment.datasets.map((ds, i) => [ ds.id, new DataSet(ds) ]));
    
      return state.set('layers', lrs).set('datasets', datasets);
    }

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
