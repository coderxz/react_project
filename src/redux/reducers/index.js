import Login from './login_reducer';
import setTitle from './heder_reducer'
import saveProduct from './product_reducer'
import categoryInfo from "./category_reducer";
import {combineReducers} from 'redux'
export default combineReducers({
  userInfo:Login,
  title:setTitle,
  productDetail:saveProduct,
  categoryInfo:categoryInfo
})