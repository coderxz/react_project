import axios from './axios'
import {BASE_URL,LOCATION} from '../config'
//登录
export const reqLogin = (username,password) => axios.post(`${BASE_URL}/login`,{username,password})
// 分类
export const reqCategoryList = (username,password) => axios.get(`${BASE_URL}/manage/category/list`)
//天气
export const reqWeather = () => axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${LOCATION}`)
//添加分类
export const reqAddCategory = (categoryName) => axios.post(`${BASE_URL}/manage/category/add`,categoryName)
// 修改分类
export const reqUpDateCategory = (categoryId,categoryName) => axios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})
//商品分页
export const reqProductList = (pageNum,pageSize) => axios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}})
//更新商品状态
export const reqUpDtaProduct = (productId,status) => axios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
//搜索商品
export const reqSearchProduct = (pageNum,pageSize,searchType,keyword) => axios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyword}})
//根据商品ID获取商品详细信息
export const reqDetailProduct = (productId) => axios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
//删除商品图片
export const reqDeleteImage = (name) => axios.post(`${BASE_URL}/manage/img/delete`, {name})
//添加商品
export const reqAddProduct = (productObj) => axios.post(`${BASE_URL}/manage/product/add`, {...productObj})
//更新商品
export const reqUpdateProduct = (productObj) => axios.post(`${BASE_URL}/manage/product/update`, {...productObj})
//获取角色列表
export const reqRoleList = () => axios.get(`${BASE_URL}/manage/role/list`)
// 添加角色
export const reqAddRole = (roleName) => axios.post(`${BASE_URL}/manage/role/add`, {roleName})
//角色授权
export const reqAuthRole = (roleList) => axios.post(`${BASE_URL}/manage/role/update`, {...roleList,auth_time:Date.now()})
//获取用户列表
export const reqUserList = () => axios.get(`${BASE_URL}/manage/user/list`)
//添加用户
export const reqAddUser = (userInfo) => axios.post(`${BASE_URL}/manage/user/add`, {...userInfo})
//删除用户
export const reqDeleteUser = (userId) => axios.post(`${BASE_URL}/manage/user/delete`, {...userId})



