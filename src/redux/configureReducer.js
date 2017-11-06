import { combineReducers } from 'redux';

import app from '../components/app/reducer';
import map from '../components/map/reducer';
import view from '../components/view/reducer';

const reducers = {
  app,
  map,
  view
};

export default () => combineReducers(reducers);
