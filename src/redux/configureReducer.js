import { combineReducers } from 'redux';

import app from '../components/app/reducer';
import view from '../components/view/reducer';
import lang from '../components/lang/reducer';
import baselayer from '../components/baselayer/reducer';
import categories from '../components/categories/reducer';
import layers from '../components/layers/reducer';
import districts from '../components/districts/reducer';

const reducers = {
  app,
  lang,
  categories,
  view,
  layers,
  baselayer,
  districts
};

export default () => combineReducers(reducers);
