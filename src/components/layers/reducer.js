import * as actions from './actions';
import { Record, OrderedMap, Map } from 'immutable';
import env from '../../environment';
import Layer from './layer';
import DataSet from './dataset';
import lang from '../lang/messages/layers';


const lrs = new OrderedMap(env.layers.map((l, i) => [ l.id, new Layer(l) ]))
  .map( l => l.set('title', lang[l.id]) );
const datasets = new Map(env.datasets.map((ds, i) => [ ds.id, new DataSet(ds) ]));

const InitialState = new Record({
  layers: lrs,
  datasets: datasets
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('layers', lrs)
  .set('datasets', datasets);


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
