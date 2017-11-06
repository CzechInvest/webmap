import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const App = ({ title }) => (
  <div className="cimap-app">
    { title } a moz
  </div>
);


App.propTypes = {
  title: PropTypes.string.isRequired,
};


export default connect(state => ({
  title: state.app.title,
}))(App);
