import React, {useEffect} from 'react';
import Map from '../map/Map.react';
import View from '../view/View.react';
import Baselayer from '../baselayer/Baselayer.react';
import CategoriesMenu from '../categories/Menu.react';
import Identification from '../identification/Identification.react';
import DistrictsComparator from '../districts/DistrictsComparator.react';
import Search from '../search/Search.react';
import BottomPanel from '../bottom-panel/Panel.react';
import UrlState from '../map/UrlState.react'
import '../../fonts.scss';
import '../../animations.scss';
import './App.scss';
import { startApp } from './actions'
import axios from 'axios';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';


const App = ({ env, startApp}) => { 

  useEffect(() => {
    axios.get(process.env.ENV_URL)
    .then(response => {
      startApp({ env: response.data });
    }).catch(e=> console.error(e))
    
  }, [])
  if (!env) {
    return 'načítám ...'
  }
  return (
   <Map>
    <View>
      <Baselayer />
    </View>
    <BottomPanel />
    <CategoriesMenu />
    <Identification />
    <DistrictsComparator />
    <Search />
    <UrlState />
  </Map>
)};



export default connect(state => ({
  env: state.app.env  
}), dispatch => bindActionCreators({ startApp }, dispatch))(App);