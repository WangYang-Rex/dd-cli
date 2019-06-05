import * as Act from 'actions';
import util from 'util';

const initState = {
  userInfo: util.getUserInfo(),
};
export default function app(state = initState, action) {
  switch (action.type) {
    case Act.INIT_PERMISSION_MENUS:
      return Object.assign({}, state, { ...action.params });
    default:
      return state;
  }
}
