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

let getUserList = function* () {
	yield callTakeEvery(Act.GET_USER_LIST, function*(action){
		// 获取用户列表
		let user_list = yield call(Fetch.get_user_list);
		yield put({
			type: Act.SET_USER_LIST,
			user_list: user_list
		});
	})
}

export default function* rootSaga() {
	yield [
		// getUserList(),
	];
}
