import { combineReducers } from 'redux';
import personmanage from './personmanage';
import user from './user';


export default combineReducers({
  user,
  personmanage
});
