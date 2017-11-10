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
        title: 'jojo',
      },
      map: {
        categories: [
          {
            title: 'Doprava',
            icon: 'transport',
            layers: [
              {
                name: 'silnicni',
                title: 'Silniční'
              },
              {
                name: 'zeleznicni',
                title: 'Železniční',
              },
              {
                name: 'letecka',
                title: 'Letecká'
              },
              {
                name: 'vodni',
                title: 'Vodní'
              }
            ]
          },
          {
            title: 'Podnik. sítě',
            icon: 'business',
            layers: [
              {
                name: 'dodavatele',
                title: 'Dodavatele',
                source: '/web-data/podnikatelska_sit/dodavatele.geojson',
                visible: false
              }
            ]
          },
          {
            title: 'VVI & Vzdělání',
            icon: 'science',
            layers: [
              {
                name: 'pi_vtp',
                title: 'VTParky ',
                source: '/web-data/vzdelavani/pi_vtp.geojson',
                visible: false,
                style: {
                  fill: '#7B1FA2'
                }
              },
              {
                name: 'whoiswho',
                title: 'Who is Who ',
                source: '/web-data/vzdelavani/whoiswho.geojson',
                visible: true,
                style: {
                  fill: '#FFC400'
                }
              }
            ]
          },
        {
            title: 'Start Up',
            icon: 'startup',
            layers: [
              // {
              //   name: 'business_angels',
              //   title: 'Business angels',
              //   source: '/web-data/startup/business_angels.geojson',
              //   visible: false
              // },
              {
                name: 'coworking',
                title: 'coworking',
                source: '/web-data/startup/coworking.geojson',
                visible: true,
                style: {
                  fill: '#AFB42B',
                  label: 'name'
                }
              },
              {
                name: 'sub_bic',
                title: 'ESA BIC SUPy',
                source: '/web-data/startup/sub_bic.geojson',
                visible: true,
                style: {
                  fill: '#FF3D00'
                }
              }
            ]
          },
          {
            title: 'Veř. Podpora',
            icon: 'handshake',
            layers: []
          },
          {
            title: 'Nemovitosti',
            icon: 'estate',
            layers: []
          },
          {
            title: 'Socioekonom.',
            icon: 'socioeconomic',
            layers: [
              {
                name: 'kraje',
                title: 'Kraje',
                source: '/web-data/socioekonomicka/kraje.geojson',
                visible: true
              }
            ]
          }
        ]
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
