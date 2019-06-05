import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import store from 'stores';
// import {getVersion, clickPoint} from 'util';

import {  HashRouter } from 'react-router-dom';
import Routers from './router';

// import 'normalize.css/normalize.css';
import 'styles/app.styl';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { href } = location;
    // 如果地址中包含 这三种 则没有左侧导航栏 和 活动信息弹窗

    return (
      <div className="pageMain t-FBH">
        <Routers />
      </div>
    );
  }
}

// 注意点
// 1、require('components/Index').default中require方法的参数不能使用变量，只能使用字符串！
// 2、如果你的组件是使用es5的module.exports导出的话，那么只需要require('components/Index')即可。而如果你的组件是使用es6的export default导出的话，那么需要加上default！例如：require('components/Index').default
// 3、如果在路由页面使用了按需加载（require.ensure）加载路由级组件的方式，那么在其他地方（包括本页面）就不要再import了，否则不会打包生成chunk文件。简而言之，需要按需加载的路由级组件必须在路由页面进行加载。
ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </LocaleProvider>,
  document.getElementById('App')
);

// webpack进行热更新
if (module.hot) {
  module.hot.accept();
}
