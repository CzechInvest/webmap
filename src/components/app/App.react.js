import React from 'react';
import Map from '../map/Map.react';
import View from '../view/View.react';
import Baselayer from '../baselayer/Baselayer.react';
import CategoriesMenu from '../categories/Menu.react';
import Identification from '../identification/Identification.react';
import Contact from '../contact/Contact.react';
import '../../fonts.scss';
import '../../animations.scss';


export default () => (
  <Map>
    <View>
      <Baselayer />
    </View>
    <Contact />
    <CategoriesMenu />
    <Identification />
  </Map>
);
