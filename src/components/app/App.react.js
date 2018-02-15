import React from 'react';
import Map from '../map/Map.react';
import View from '../view/View.react';
import Baselayer from '../baselayer/Baselayer.react';
import CategoriesMenu from '../categories/Menu.react';
import Identification from '../identification/Identification.react';
import DistrictsComparator from '../districts/DistrictsComparator.react';
import Search from '../search/Search.react';
import Contact from '../contact/Contact.react';
import '../../fonts.scss';
import '../../animations.scss';
import './App.scss';


export default () => (
  <Map>
    <View>
      <Baselayer />
    </View>
    <Contact />
    <CategoriesMenu />
    <Identification />
    <DistrictsComparator />
    <Search />
  </Map>
);
