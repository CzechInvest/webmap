import * as actions from './actions';
import { Record, OrderedMap } from 'immutable';

import Category from './category';
import lang from '../lang/messages/categories';

const InitialState = new Record({
  categories: {},
  activeId: null
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('categories', {});


export default function categoryReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

    case 'START_APP': {
      const { environment } = action.payload;
      const catgs = new OrderedMap(environment.categories.map(c => [ c.id, new Category(c) ]))
  .map( c => c.set('title', lang[c.id]) );
      return state.set('categories', catgs);
    }

    case actions.OPEN_CATEGORY: {
      return state.set('activeId', action.payload.id);
    }

    case actions.CLOSE_CATEGORY: {
      return state.set('activeId', null);
    }

    default:
      return state;

  }
}
