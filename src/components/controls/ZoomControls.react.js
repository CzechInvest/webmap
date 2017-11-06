import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setZoom } from '../view/actions';


class ZoomControls extends React.PureComponent {
  static propTypes = {
    setZoom: PropTypes.func.isRequired,
    z: PropTypes.number.isRequired,
  }

  onZoom(dir) {
    const { setZoom, z } = this.props;
    setZoom(z + dir);
  }

  render() {
    return (
      <div>
        <button onClick={ () => this.onZoom(1) }> + </button>
        <button onClick={ () => this.onZoom(-1) }> - </button>
      </div>
    );
  }
}


export default connect(state => ({
  z: state.view.z,
}), dispatch => bindActionCreators({
  setZoom
}, dispatch))(ZoomControls);
