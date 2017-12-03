import * as actions from './actions';
import { Record, OrderedMap } from 'immutable';
import env from '../../environment';
import Category from './category';
import lang from '../lang/messages/categories';

const catgs = new OrderedMap(env.categories.map(c => [ c.id, new Category(c) ]))
  .map( c => c.set('title', lang[c.id]) );

const InitialState = new Record({
  categories: catgs,
  activeId: null
});

const initialState = new InitialState();

const setInitalState = (state) => initialState
  .set('categories', catgs);


export default function categoryReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return setInitalState(state);

  switch (action.type) {

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
