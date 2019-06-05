import { all } from 'redux-saga/effects';

import app from './app';

export default function* rootSaga() {
  yield all([
    app(), //app中start进行js鉴权/免登，及其他初始化操作
  ])
}
