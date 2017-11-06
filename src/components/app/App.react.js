import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.scss';
import Map from '../map/Map.react';
import View from '../view/View.react';
import TileLayer from '../tileLayer/TileLayer.react';
import ZoomControls from '../controls/ZoomControls.react';



const App = ({ title }) => (
  <div className="cimap-app">
    <ZoomControls />
    <Map>
      <View />
      <TileLayer />
    </Map>
  </div>
);


App.propTypes = {
  title: PropTypes.string.isRequired,
};


export default connect(state => ({
  title: state.app.title,
}))(App);
