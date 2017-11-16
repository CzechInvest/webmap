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
                name: 'dodavatele:automobilovy_prumysl',
                title: 'Automobilový průmysl',
                source: 'web-data/podnikatelska_sit/dodavatele.geojson',
                type: 'point',
                filter: {
                  attribute: 'sectors',
                  value: 'Automobilový průmysl'
                },
                visible: true,
                style: {
                  fill: [30,30,30,0.5],
                  label: 'name'
                }
              },
              {
                name: 'dodavatele:letecky_prumysl',
                title: 'Letecký průmysl',
                filter: {
                  attribute: 'sectors',
                  value: 'Letecký průmysl'
                },
                visible: true,
                style: {
                  fill: [41,182,246,0.5],
                  label: 'name'
                }
              },
              {
                name: 'dodavatele:elektronika',
                title: 'Elektronika a elektrotechnika',
                filter: {
                  attribute: 'sectors',
                  value: 'Elektronika a elektrotechnika'
                },
                visible: false,
                style: {
                  fill: [150,50,30,0.5],
                  label: 'name'
                }
              },
              {
                name: 'dodavatele:energetika',
                title: 'Energetika',
                filter: {
                  attribute: 'sectors',
                  value: 'Energetika'
                },
                visible: false,
                style: {
                  fill: [80,50,200,0.5],
                  label: 'name'
                }
              },
              {
                name: 'dodavatele:zdravotnictvo',
                title: 'Zdravotnická technika, biotechnologie a farmaceutický průmysl',
                filter: {
                  attribute: 'sectors',
                  value: 'Zdravotnická technika, biotechnologie a farmaceutický průmysl'
                },
                visible: false,
                style: {
                  fill: [124,179,66,0.5]
                }
              },
              {
                name: 'dodavatele:top10',
                title: '10 největších firem podle sektorů',
                filter: {
                  attribute: 'sectors',
                  value: '10 největších firem podle sektorů'
                },
                visible: false,
                style: {
                  fill: [100,100,30,0.5]
                }
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
                source: 'web-data/vzdelavani/pi_vtp.geojson',
                type: 'point',
                visible: false,
                style: {
                  fill: '#7B1FA2'
                }
              },
              {
                name: 'whoiswho',
                title: 'Who is Who',
                source: 'web-data/vzdelavani/whoiswho.geojson',
                visible: false,
                style: {
                  fill: [255,193,7, 0.5]
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
              //   source: 'web-data/startup/business_angels.geojson',
              //   visible: false
              // },
              {
                name: 'coworking',
                title: 'coworking',
                source: 'web-data/startup/coworking.geojson',
                type: 'point',
                visible: false,
                style: {
                  fill: '#AFB42B',
                  label: 'name'
                }
              },
              {
                name: 'sub_bic',
                title: 'ESA BIC SUPy',
                source: 'web-data/startup/sub_bic.geojson',
                type: 'point',
                visible: false,
                style: {
                  fill: '#FF3D00',
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
                // source: 'web-data/socioekonomicka/kraje.geojson',
                source: 'web-data/socioekonomicka/kraje.pbf',
                type: 'polygon',
                visible: true,
                style: {
                  fill: [255,255,255,0.2],
                  stroke: 'red'
                }
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
