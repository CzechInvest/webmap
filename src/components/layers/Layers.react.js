import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Layer from './Layer.react';
import { setLayerVisibility, setVisibleLayers } from './actions';
import messages from '../lang/messages/app';
import './Layers.scss';

class Layers extends React.Component {

  onChange(layerId, visible) {
    const { category, layers, setLayerVisibility } = this.props;
    if (category.selectType === 'radio') {
      const visible = layers.toList()
        .filter(l => l.catId === category.id && l.visible)
        .map(l => l.id);
      visible.forEach(id => setLayerVisibility(id, false));
    }
    setLayerVisibility(layerId, visible);
  }

  render() {
    const { category: { id, title, selectType }, layers, setVisibleLayers, lang } = this.props;
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
    const onChange = this.onChange.bind(this);

    return (
      <div
        className="layers-list">
        <h3>{title[lang]}</h3>
        {selectType !== 'radio' && <div className="category-visibility">
          {!allHidden && <button onClick={hideCategoryLayers}>{messages['hideAll'][lang]}</button>}
          {allHidden && <button onClick={showCategoryLayers}>{messages['showAll'][lang]}</button>}
        </div>}
        {categoryLayers.toList().map(l => <Layer key={l.id} onChange={onChange} {...l.toJS()} />)}
      </div>
    )
  }
}

Layers.propTypes = {
  category: PropTypes.object,
  layers: PropTypes.object,
  lang: PropTypes.string,
  setVisibleLayers: PropTypes.func.isRequired,
  setLayerVisibility: PropTypes.func.isRequired
}

export default connect(state => ({
  category: state.categories.categories.get(state.categories.activeId),
  layers: state.layers.layers,
  lang: state.lang.selectedLanguage
}), dispatch => bindActionCreators({
  setVisibleLayers,
  setLayerVisibility
}, dispatch))(Layers);
