import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
    Router,
    Route,
    hashHistory,
    IndexRoute
} from 'react-router';
import store from './stores';

import 'normalize.css/normalize.css';
import 'styles/app.styl';

//业务逻辑初始化操作
// import dingApi from './lib/dingApi.js';
import util from './lib/util.js';
let _corpId = util.getUrlParam('corpId') || util.getUrlParam('corpId', location.href);
_corpId ? window.localStorage.setItem('corpId', _corpId) : null;
// if (window.chrome && window.chrome.webstore) { // This is a Chrome only hack
//     // see https://github.com/livereload/livereload-extensions/issues/26
//     setInterval(function() {
//         document.body.focus();
//     }, 200);
// }
// bind fastclick
// window.FastClick && FastClick.attach(document.body);


import LeftNav from './components/common/leftnav';
class App extends React.Component {
    render() {
        let path = this.props.location.pathname;
        // console.log(path);
        if(path.includes('slidePanel')){ //此处约定 router中包含slidePanel的是通过JSAPI打开的钉钉右侧panel
            return (
                <div className="main t-FBH">
                    {this.props.children}
                </div>
            );
        }else{
            return (
                <div className="main t-FBH">
                    <LeftNav data={this.props}></LeftNav>
                    <div className="main-content t-FB1">
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }
}

import PageLogin from './pages/login.js';
import PageHome from './pages/home/home.js';
import PagePersonManage from './pages/personmanage/personmanage.js';

// Render the main component into the dom
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route name="app" path="/" component={App}>
                <IndexRoute component={PageHome}/>
                <Route path="login" component={PageLogin}/>
                <Route path="personmanage" component={PagePersonManage}/>
            </Route>
        </Router>
    </Provider>
    , document.getElementById('App')
);
