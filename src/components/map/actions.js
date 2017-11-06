export const SET_CENTER = 'SET_CENTER';

export const setCenter = ({ lat, lng }) => ({
  type: SET_CENTER,
  payload: {
    lat,
    lng
  }
});
