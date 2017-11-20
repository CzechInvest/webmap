export const SET_LANGUAGE = 'SET_LANGUAGE';

export function setLanguage(lang) {
  return ({
    type: SET_LANGUAGE,
    payload: {
      lang
    }
  });
}
