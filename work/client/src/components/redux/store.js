import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/rootReducer';
import initState from './initState';
import rootSaga from './sagas/rootSagas';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
  persistReducer,
  persistStore,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const sagaMiddleware = createSagaMiddleware();

const migrations = {
  1: (state) => {
    if (!state) {
      return state;
    }

    const nextState = {
      ...state,
    };

    delete nextState.jwt;

    return nextState;
  },
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage,

  blacklist: ['jwt', 'authChecked'],

  migrate: createMigrate(migrations, {
    debug: false,
  }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initState,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),

  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export const persister = persistStore(store);

export default store;
