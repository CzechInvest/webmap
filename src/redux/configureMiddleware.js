import thunkMiddleware from '../middleware/thunkMiddleware';


export default function configureMiddleware() {
  const middleware = [
    thunkMiddleware(),
  ];

  if (process.env.NODE_ENV === 'development') {
    const loggerMiddleware = require('../middleware/loggerMiddleware').default;
    middleware.push(loggerMiddleware());
  }

  return middleware;
}
