import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './App.scss';
import Map from '../map/Map.react';
import View from '../view/View.react';
import Baselayer from '../baselayer/Baselayer.react';
import LayersControl from '../layers-control/LayersControl.react';


const App = ({ title }) => (
  <div className="cimap-app">
    <Map>
      <View>
        <Baselayer />
      </View>
      <LayersControl />
    </Map>
  </div>
);


App.propTypes = {
  title: PropTypes.string.isRequired,
};


export default connect(state => ({
  title: state.app.title,
}))(App);
