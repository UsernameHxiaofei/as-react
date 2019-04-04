// tweak from https://github.com/rematch/rematch/blob/master/plugins/immer/src/index.ts

import { combineReducers } from 'redux';
import produce from 'immer';

function combineReducersWithImmer(reducers) {
  console.log(reducers, '000');
  const reducersWithImmer = {};

  // reducer must return value because literal don't support immer
  for (const [key, reducerFn] of Object.entries(reducers)) { // eslint-disable-line
    reducersWithImmer[key] = (state, payload) => { // eslint-disable-line
      if (typeof state === 'object') {
        return produce(state, draft => reducerFn(draft, payload));
      }
      return reducerFn(state, payload);
    };
  }

  return combineReducers(reducersWithImmer);
}

const immerPlugin = () => ({
  config: {
    redux: {
      combineReducers: combineReducersWithImmer,
    },
  },
});

export default immerPlugin;
