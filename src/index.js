import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App.react';
import configureStore from './redux/configureStore';
import { Provider } from 'react-redux';
import { startApp } from './components/app/actions';


export class CiMap {
  constructor(divSelector = '#cimap', config) {
    this._container = document.querySelector(divSelector);;
    this._config = config || this._getDefaultState();
    if (!this._container) {
      console.warn(`There is no element: ${divSelector}`);
      return null;
    }
    this._store = configureStore(this._config);
    this._render();
  }

  _getDefaultState() {
    return {
      app: {
        title: 'jojo'
      }
    };
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
    this._store.dispatch(startApp());
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


  destroy() {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}

window.CiMap = CiMap;

new CiMap();
