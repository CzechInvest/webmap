import { combineReducers } from 'redux';

import app from '../components/app/reducer';
import map from '../components/map/reducer';
import view from '../components/view/reducer';
import lang from '../components/lang/reducer';
import baselayer from '../components/baselayer/reducer';

const reducers = {
  app,
  map,
  view,
  lang,
  baselayer
};

export default () => combineReducers(reducers);
