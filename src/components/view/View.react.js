import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import View from 'ol/view';


class ViewComponent extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    projCode: PropTypes.string.isRequired
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const { x, y, z, projCode } = this.props;
    this.view = new View({
      zoom: z,
      center: [x, y],
      projection: projCode
    });
    this.context.map.setView(this.view);
  }

  componentWillReceiveProps(nextProps) {
    const { z } = nextProps;
    this.view.animate({ zoom: z });
  }

  render() {
    return null;
  }
}


ViewComponent.contextTypes = {
  map: PropTypes.object
};

export default connect(state => ({
  x: state.view.x,
  y: state.view.y,
  z: state.view.z,
  projCode: state.view.projCode
}), dispatch => bindActionCreators({
}, dispatch))(ViewComponent);
