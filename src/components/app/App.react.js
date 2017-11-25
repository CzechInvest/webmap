import React from 'react';
import Map from '../map/Map.react';
import View from '../view/View.react';
import Baselayer from '../baselayer/Baselayer.react';
import CategoriesMenu from '../categories/Menu.react';
import Identification from '../identification/Identification.react';


const App = () => (
  <Map>
    <View>
      <Baselayer />
    </View>
    <CategoriesMenu />
    <Identification />
  </Map>
);
