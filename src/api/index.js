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