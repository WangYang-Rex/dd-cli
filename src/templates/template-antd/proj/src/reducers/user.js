import * as Act from 'actions';
import util from 'util';

const initState = {
    userInfo: util.getUserInfo()
}

export default function user(state = initState, action) {
    switch(action.type) {
        case Act.USER_SET_USERINFO:
            return Object.assign({}, state, {
                userInfo: action.userInfo
            });
        default:
            return state;
    }
}
