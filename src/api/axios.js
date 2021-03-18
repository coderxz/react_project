import axios from 'axios'
import {message} from 'antd'
import qs from 'querystring'
import nprogress from 'nprogress'
import store from '../redux/store'
import {logout} from '../redux/actions/login_action'
import 'nprogress/nprogress.css'

const instance = axios.create({
});
//请求拦截器
instance.interceptors.request.use(
  config => {
    nprogress.start()
    const {token} = store.getState().userInfo
    if (token) config.headers.Authorization = 'atguigu_' + token
    const {data, method} = config
    if (method.toLowerCase() === 'post' && data instanceof Object) {
      config.data = qs.stringify(data)
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });
//响应拦截器
instance.interceptors.response.use(
  response => {
    nprogress.done()
    return response.data;
  },
  error => {
    nprogress.done()
    if (error){
      if (error.response){
        const {status} = error.response
        if (status) {
          if (status === 401) {
            message.error('校验用户失败!请重新登录', 1)
            setTimeout(() => {
              store.dispatch(logout())
            }, 1000)
          } else {
            message.error(error.message, 1)
          }
        }
        console.log(error)
        return new Promise(() => {
        })
      }
    }else{
      message.error(error.message, 1)
      console.log(error)
      return new Promise(() => {
      })
    }
  });

export default instance