import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App.react';
import configureStore from './redux/configureStore';
import { Provider } from 'react-redux';



export default class app {
  constructor(divSelector = '#cimap', config) {
    this._container = document.querySelector(divSelector);;
    this._config = config;
    if (!this._container) {
      console.warn(`There is no element: ${divSelector}`);
      return null;
    }
    this._store = configureStore(this._config);
    this._render();
  }

  _render() {
    ReactDOM.render(
      <Provider store={this._store}>
        <App />
      </Provider>, this._container
    );

    if (module.hot) {
      this._renderHotReload();
    }

  }

  _renderHotReload() {
    module.hot.accept('./components/app/App.react', () => {
      const NextApp = require('./components/app/App.react').default;
      ReactDOM.render(
        <Provider store={this._store}>
          <NextApp />
        </Provider>, this._container);
    });
  }

  dispatch(action) {
    this._store.dispatch(action);
  }

  getIn(prop, query) {
    if (!(query instanceof Array)) {
      query = [query];
    }
    return this._store.getState()[prop].getIn(query);
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
