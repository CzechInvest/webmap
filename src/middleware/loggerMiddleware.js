import { createLogger } from 'redux-logger';

export default () => createLogger({
  collapsed: true,
  duration: true,
  // Convert immutable to JSON.
  stateTransformer: state => JSON.parse(JSON.stringify(state)),
});
