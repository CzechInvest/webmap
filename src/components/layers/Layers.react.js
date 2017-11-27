import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Layer from './Layer.react';
import { setVisibleLayers } from './actions';
import './Layers.scss';


class Layers extends React.Component {
  static propTypes = {
    category: PropTypes.object,
    layers: PropTypes.object,
  }

  render() {
    const { category, layers, setVisibleLayers } = this.props;
    const categoryLayers = layers.filter(l => l.catId === category.id);
    const hideCategoryLayers = () => {
      const visibleLayers = layers.toList().filter(l => (l.catId !== category.id && l.visible));
      setVisibleLayers(visibleLayers.map(l => l.id));
    }
    const showCategoryLayers = () => {
      const visibleLayers = layers.toList()
        .filter(l => ((l.catId !== category.id && l.visible) || l.catId === category.id));
      setVisibleLayers(visibleLayers.map(l => l.id));
    }
    const allHidden = !categoryLayers.find(l => l.catId === category.id && l.visible);
    return (
      <div
        className="layers-list">
        <h3>{category.title}</h3>
        <div className="category-visibility">
          {!allHidden && <button onClick={hideCategoryLayers}>Hide all</button>}
          {allHidden && <button onClick={showCategoryLayers}>Show all</button>}
        </div>
        {categoryLayers.toList().map(l => <Layer key={l.id} {...l.toJS()} />)}
      </div>
    )
  }
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  layers: state.layers.layers
}), dispatch => bindActionCreators({
  setVisibleLayers
}, dispatch))(Layers);