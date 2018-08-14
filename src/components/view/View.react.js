import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { setZoom, setCenter } from './actions';
import { connect } from 'react-redux';
import { View } from 'ol';
import debounce from 'lodash/debounce';


class ViewComponent extends Component {

  componentDidMount() {
    const { x, y, z, projCode, setZoom, setCenter } = this.props;

    this.view = new View({
      zoom: z,
      center: [x, y],
      projection: projCode
    });
    this.context.map.setView(this.view);

    this.view.on('change:resolution', debounce(e => {
      const zoom = this.view.getZoom();
      setZoom(zoom);
    }, 50));

    this.context.map.on('moveend', e => {
      const center = this.view.getCenter();
      setCenter(center[0], center[1]);
    });

  }

  componentDidUpdate(prevProps) {
    const { z, x, y } = this.props;

    if ( z !== prevProps.z && this.view.getZoom() !== z) {
      this.view.setZoom(z);
    }

    if ( x !== prevProps.x && this.view.getCenter[0] !== x) {
      this.view.setCenter([x, y]);
    }

    if ( y !== prevProps.y && this.view.getCenter[1] !== y) {
      this.view.setCenter([x, y]);
    }
  }

  render() {
    return this.props.children;
  }
}


ViewComponent.contextTypes = {
  map: PropTypes.object
};


ViewComponent.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  projCode: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  setCenter: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
}

export default connect(state => ({
  x: state.view.x,
  y: state.view.y,
  z: state.view.z,
  projCode: state.view.projCode
}), dispatch => bindActionCreators({
  setZoom,
  setCenter
}, dispatch))(ViewComponent);
