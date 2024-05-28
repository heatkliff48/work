import { all } from 'redux-saga/effects';
import userWatcher from './userSagas';
import productsWatcher from './productsSagas';
export default function* rootSaga() {
  yield all([userWatcher(), productsWatcher()]);
}
