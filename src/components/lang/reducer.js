import * as actions from './actions';
import messages from './messages';
import { Record } from 'immutable';

const InitialState = Record({
  availableLanguages: ['cs', 'en', 'sk'],
  msg: messages.cs,
  selectedLanguage: 'cs'
});
const initialState = new InitialState();

export default function langReducer(state = initialState, action) {

  switch (action.type) {
    case actions.SET_LANGUAGE: {
      const { lang } = action.payload;
      return state.set('selectedLanguage', lang)
        .set('msg', messages[lang])
    }

    default:
      return state;
  }
}
