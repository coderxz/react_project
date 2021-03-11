import Login from './login_reducer';
import setTitle from './heder_reducer'
import {combineReducers} from 'redux'
export default combineReducers({
  userInfo:Login,
  title:setTitle
})