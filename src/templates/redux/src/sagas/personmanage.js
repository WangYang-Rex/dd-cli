import * as Act from 'actions';
import {
    put,
    select,
    call,
    takeEvery
} from 'redux-saga/effects';
import {
    callTakeEvery,
    callTakeLatest
} from 'util';
import * as Fetch from '../lib/server';
import {message} from 'antd';

let getDeptList = function* () {
    yield callTakeEvery(Act.GET_DEPT_LIST, function*(action){
        // 获取部门列表
        let dept_list = yield call(Fetch.user_info_dept_list);
        yield put({
            type: Act.SET_DEPT_LIST,
            dept_list: dept_list
        });
    })
}

let getUserList = function* () {
    yield callTakeLatest(Act.GET_USER_LIST, function*(action){
        // 获取人员列表
        let userPages = yield select(state => state.personmanage.userPages);
        if(action.userPages){
            userPages = Object.assign({}, userPages, action.userPages);
            yield put({
                type: Act.SET_USER_PAGES,
                userPages: userPages
            })
        }
        let data = yield call(Fetch.user_info_user_list, userPages);
        yield put({
            type: Act.SET_USER_LIST,
            user_list: data.list,
            total: data.total
        });
    })
}

let updateUserRole = function* () {
    yield callTakeLatest(Act.UPDATE_USER_ROLE, function*(action){
        // 更新人员角色
        yield call(Fetch.permission_update_user_role, Object.assign({}, action.params));
        message.success('角色更新成功');
    })
}

let deptSync = function* () {
    yield callTakeLatest(Act.DEPT_SYNC, function*(action){
        // 获取人员列表
        yield call(Fetch.user_info_dept_sync, {});
        message.success('组织架构更新成功');
        yield put({
            type: Act.GET_USER_LIST
        })
    })
}

export default function* rootSaga() {
    yield [
        getDeptList(),
        getUserList(),
        updateUserRole(),
        deptSync()
    ];
}
