import { combineReducers } from 'redux';

import app from '../components/app/reducer';
import map from '../components/map/reducer';

const reducers = {
  app,
  map
};

export default () => combineReducers(reducers);
