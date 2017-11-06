export const SET_TITLE = 'SET_TITLE';
export const START_APP = 'START_APP';


export const startApp = () => ({
  type: START_APP
});


export const setTitle = title => ({
  type: SET_TITLE,
  payload: {
    title
  }
});
