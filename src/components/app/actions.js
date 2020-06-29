export const SET_TITLE = 'SET_TITLE';
export const START_APP = 'START_APP';


export const startApp = ({ env }) => ({
  type: START_APP,
  payload: {
    environment: env
  }
});


export const setTitle = title => ({
  type: SET_TITLE,
  payload: {
    title
  }
});
