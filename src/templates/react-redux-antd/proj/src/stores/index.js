import 'babel-polyfill';
import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';

import reducers from '../reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
let store;
if(window.devToolsExtension){
    store = createStore(
        reducers,
        // applyMiddleware(sagaMiddleware)
        compose(applyMiddleware(sagaMiddleware), window.devToolsExtension && window.devToolsExtension())
    );
} else {
    store = createStore(
        reducers,
        applyMiddleware(sagaMiddleware)
        // compose(applyMiddleware(sagaMiddleware), window.devToolsExtension && window.devToolsExtension())
    );
}
 
sagaMiddleware.run(rootSaga);
export default store;
