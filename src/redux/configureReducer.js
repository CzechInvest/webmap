import { combineReducers } from 'redux';

import app from '../components/app/reducer';
import view from '../components/view/reducer';
import lang from '../components/lang/reducer';
import baselayer from '../components/baselayer/reducer';
import categories from '../components/categories/reducer';
import layers from '../components/layers/reducer';
import districts from '../components/districts/reducer';
import identification from '../components/identification/reducer';


const reducers = {
  app,
  lang,
  categories,
  view,
  layers,
  baselayer,
  districts,
  identification
};

export default () => combineReducers(reducers);
