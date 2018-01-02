import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Layer from './Layer.react';
import { setVisibleLayers } from './actions';
import messages from '../lang/messages/app';
import './Layers.scss';

class Layers extends React.Component {

  render() {
    const { category: { id, title }, layers, setVisibleLayers, lang } = this.props;
    const categoryLayers = layers.filter(l => l.catId === id);
    const hideCategoryLayers = () => {
      const visibleLayers = layers.toList().filter(l => (l.catId !== id && l.visible));
      setVisibleLayers(visibleLayers.map(l => l.id));
    }
    const showCategoryLayers = () => {
      const visibleLayers = layers.toList()
        .filter(l => ((l.catId !== id && l.visible) || l.catId === id));
      setVisibleLayers(visibleLayers.map(l => l.id));
    }
    const allHidden = !categoryLayers.find(l => l.catId === id && l.visible);
    
    return (
      <div
        className="layers-list">
        <h3>{title[lang]}</h3>
        <div className="category-visibility">
          {!allHidden && <button onClick={hideCategoryLayers}>{messages['hideAll'][lang]}</button>}
          {allHidden && <button onClick={showCategoryLayers}>{messages['showAll'][lang]}</button>}
        </div>
        {categoryLayers.toList().map(l => <Layer key={l.id} {...l.toJS()} />)}
      </div>
    )
  }
}

Layers.propTypes = {
  category: PropTypes.object,
  layers: PropTypes.object,
  lang: PropTypes.string
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  layers: state.layers.layers,
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
  setVisibleLayers
}, dispatch))(Layers);
