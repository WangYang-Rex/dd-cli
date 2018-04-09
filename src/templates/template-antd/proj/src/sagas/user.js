import * as Act from 'actions';
import {
    put,
    select,
    call,
    takeEvery
} from 'redux-saga/effects';
import util, {
    callTakeEvery
} from '../lib/util';
import * as Fetch from 'server';
import dingApi from 'dingApi'

let dd_config = function* () {
    yield callTakeEvery(Act.LOGIN_DD_CONFIG, function*(action) {
        let cfg = yield call(Fetch.get_free_login_cfg, {
            'corpId': localStorage.getItem('corpId'),
            'redirectURL': location.href.replace(location.hash, ''),
            'domain': 'crm'
        })
        if(cfg){
            let ddReady = yield dingApi.dd_config(cfg);
            if(ddReady && action.needAuth){
                yield put({
                    type: Act.LOGIN_DO_AUTH
                });
            }
        }
    });
}

//jssdk免登
let dd_auth = function* (){
    yield callTakeEvery(Act.LOGIN_DO_AUTH, function*(action) {
        let code = yield dingApi.getAuthCode();
        if(code){
            yield call(Fetch.get_free_login_auth, {
                'code': code,
                'corpId': localStorage.getItem('corpId')
            })
            let userInfo = util.getUserInfo();
            yield put({
                type: Act.USER_SET_USERINFO,
                userInfo: userInfo
            })
        }
    });
}

export default function* rootSaga() {
    yield [
        dd_config(),
        dd_auth()
    ];
}
