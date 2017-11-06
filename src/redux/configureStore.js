import configureMiddleware from './configureMiddleware';
import configureReducer from './configureReducer';
import { applyMiddleware, compose, createStore } from 'redux';


export default function configureStore(initialState) {
  const middleware = configureMiddleware();
  const reducer = configureReducer();

  let createReduxStore = applyMiddleware(...middleware);

  // Enable redux dev tools in development
  if (process.env.NODE_ENV === 'development') {
    if (window.devToolsExtension) {
      createReduxStore = compose(applyMiddleware(...middleware), window.devToolsExtension());
    }
  }

  const store = createReduxStore(createStore)(reducer, initialState);

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./configureReducer', () => {
      const nextAppReducer = require('./configureReducer').default;
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
