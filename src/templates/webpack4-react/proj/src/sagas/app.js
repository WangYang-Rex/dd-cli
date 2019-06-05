import * as Act from 'actions';
import {put, select, call, takeEvery, all, fork} from 'redux-saga/effects';
import util, {
  callTakeEvery,
  callTakeLatest,
} from 'lib/util';
import * as Fetch from 'server';
import dingApi from 'dingApi';


const dd_config = function* () {
  yield callTakeLatest(Act.DD_CONFIG, function* (action) {
    // 存储corpId
    const _corpId =
      util.getUrlParam('corpId') || util.getUrlParam('corpId', location.href);
    _corpId ? window.localStorage.setItem('corpId', _corpId) : null;

    if (location.href.indexOf('#/login') == -1) {
      //如果是刷新，不需要走重新授权，原页面刷新即可，减少授权操作
      return;
    }
    console.time('dd_config');
    const ddReady = yield dingApi.dd_config();
    console.timeEnd('dd_config')

    if (ddReady && action.needAuth) {
      // 通过 cookie 中的 corpId 判断用户是否登录
      console.time('dd_auth');
      yield dd_auth();
      console.timeEnd('dd_auth');

      // 判断是否是其他页面跳过来的
      // 有url则后退，否则跳转到首页
      if (location.href.indexOf('#/login') >= 0) {
        if (util.getUrlParam('expired')) {
          window.history.go(-1);
        } else if (util.getUrlParam('url')) {
          location.hash = decodeURIComponent(util.getUrlParam('url'));
        } else {
          location.hash = '#/home';
        }
      }
    }
  });
};
// 授权用户访问企业下的自定义空间 每次要操作钉盘前调用
const pan_auth = function* () {
  yield callTakeLatest(Act.PAN_AUTH, function* (action) {
    const data = yield call(Fetch.pan_auth, {
      domain: 'crm',
      type: action.params.type, //'add','download'
      duration: 3600,
    });
    action.cb && action.cb(data);
  });
};

//jssdk免登
let dd_auth = function* () {
  const code = yield dingApi.getAuthCode();
  if (code) {
    yield call(Fetch.get_free_login_auth, {
      code,
      corpId: localStorage.getItem('corpId'),
    });
  }
};

// 项目启动配置基础设置
let start = function* () {
  if (!__LOCAL__) {
    // 特殊处理 如果是login页面，则走login的js鉴权+免登 否则走这里的dd_config
    if (location.href.indexOf('#/login') < 0) {
      yield put({
        type: Act.DD_CONFIG,
        needAuth: true,
      });
    }
  } else {
    try {
      yield call(Fetch.test_login, {

      });
    } catch (e) {
    }
  }
};


export default function* rootSaga() {
  yield all(
    [
      dd_config(),
      pan_auth(),
      start(),
    ]
  );
}
