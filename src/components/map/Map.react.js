import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from 'ol/map';
import './Map.scss';


class MapComponent extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  constructor() {
    super();
    this.map = new Map();
  }

  getChildContext() {
    return { map: this.map };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.map.setTarget(this.mapEl);
    window.map = this.map;
  }


  render() {
    return (
      <div
        id="map"
        ref={node => {this.mapEl = node;} }
      >
        { this.props.children }
      </div>
    );
  }
}

MapComponent.childContextTypes = {
  map: PropTypes.instanceOf(Map)
};

export default connect(state => ({
  title: state.app.title,
}), dispatch => bindActionCreators({
}, dispatch))(MapComponent);
