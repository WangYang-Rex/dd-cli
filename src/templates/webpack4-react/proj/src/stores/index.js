import 'babel-polyfill';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

// 创建一个 Redux middleware，并将 Sagas 连接到 Redux Store
const sagaMiddleware = createSagaMiddleware ();
let store;
// 调试工具
if(window.devToolsExtension){
  store = createStore(
    reducers,
    // applyMiddleware(sagaMiddleware)
    compose(applyMiddleware(sagaMiddleware), window.devToolsExtension && window.devToolsExtension()),
  );
  if (module && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
} else {
  store = createStore(
    reducers,
    applyMiddleware(sagaMiddleware)
    // compose(applyMiddleware(sagaMiddleware), window.devToolsExtension && window.devToolsExtension())
  );
}
sagaMiddleware.run (rootSaga);
export default store;
