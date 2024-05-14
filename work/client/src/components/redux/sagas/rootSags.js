import { all } from 'redux-saga/effects';
import userWatcher from './userSagas';
export default function* rootSaga() {
  yield all([userWatcher()]);
}
