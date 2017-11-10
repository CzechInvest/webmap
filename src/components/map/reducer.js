import * as actions from './actions';
import { Record, fromJS, toJS } from 'immutable';

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

    case actions.SET_LAYER_VISIBILITY: {
      const olLayer = window.map.getLayers().getArray().find((l) => {
        return l.get('name') === action.payload.layerName;
      });
      if (olLayer) {
        olLayer.setVisible(action.payload.visible);
      }

      const categories = state.get('categories');
      let layerIndex;
      const categoryIndex = categories.findIndex(category => {
        layerIndex = category.layers.findIndex(layer => {
          return layer.name === action.payload.layerName;
        });
        return layerIndex !== -1;
      });

      const keyPath = [categoryIndex, 'layers', layerIndex, 'visible'];
      return state.set(
        'categories',
        fromJS(state.categories).setIn(keyPath, action.payload.visible).toJS()
      );
    }

    default:
      return state;
  }
}
