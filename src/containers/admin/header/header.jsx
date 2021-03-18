import React, {Component} from 'react';
import screenfull from 'screenfull';
import {withRouter} from 'react-router-dom'
import dayjs from "dayjs";
import {Button, Icon, Modal} from "antd";
import {connect} from 'react-redux';
import {reqWeather} from '../../../api/index'
import {logout} from '../../../redux/actions/login_action'
import {setTitle} from "../../../redux/actions/header_actions";
import menuList from '../../../config/menu-config'
import './css/header.less'

@connect(state => ({userInfo: state.userInfo.user,title: state.title}), {logout,setTitle})
@withRouter
class Header extends Component {
  async componentDidMount() {
    // 获取title
    const title = this.getTitle()
    this.props.setTitle(title)
    //获取天气
    const result = await reqWeather();
    if (result) {
      const {city, forecast} = result.data
      const {weather} = this.state
      weather.splice(0, 0, city, forecast[0])
      this.setState({
        weather: weather,
        high: weather[1].high,
        low: weather[1].low,
        type: weather[1].type
      })
      let str1 = this.state.high;
      let str2 = this.state.low
      str1 = str1.substring(2, str1.length)
      str2 = str2.substring(2, str2.length)
      this.setState({
        weather: weather,
        high: str1,
        low: str2,
        type: weather[1].type
      })
    } else {
      this.setState({
        weather: [],
        high: '26℃',
        low: '16℃',
        type: '晴'
      })
    }
    //全屏改变时触发
    screenfull.on('change', () => {
      this.setState({
        isFull: !this.state.isFull
      })
    })
    this.timer = setInterval(() => {
      this.setState({
        data: dayjs().format('YYYY年 MM月-DD日 HH:mm:ss')
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }


  state = {
    isFull: false,
    data: Date.now(),
    weather: [],
    high: 0,
    low: 0,
  }
  //退出登录
  logout = () => {
    let that = this
    Modal.confirm({
      title: '确认退出?',
      content: '若退出登录后,需输入用户名和密码重新登录',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.props.logout()
      },
      onCancel() {
      }
    });

  }
  //全屏
  fullScreen = () => {
    screenfull.toggle();
  }
  getTitle = () => {
    const {pathname} = this.props.location
    const path = pathname.indexOf('product') !== -1 ? 'product' : pathname.split('/').reverse()[0]
    let title = ''
    menuList.forEach((item)=>{
      if (item.children instanceof Array){
        let tmp = item.children.find((citem)=>{
          return path === citem.key
        })
        if (tmp) title = tmp.title
      }else{
        if (path === item.key) title = item.title
      }
    })
    return title
  }
  render() {
    const {isFull} = this.state
    const {username} = this.props.userInfo
    const {high, low, type} = this.state
    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_2408322_42jaeg9aeh3.js',
    });
    return (
      <header className="header">
        <div className="header-top">
          <Button size="small" onClick={this.fullScreen}>
            <Icon type={isFull ? "fullscreen-exit" : "fullscreen"}/>
          </Button>
          <span className="username">欢迎,{username}</span>
          <Button type="link" size="small" onClick={this.logout}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {this.props.title}
          </div>
          <div className="header-bottom-right">
            {this.state.data}&nbsp;&nbsp;
            <MyIcon type="icon-weizhi"/>
            <span>
                {this.state.weather[0]}
              </span>&nbsp;&nbsp;
            <span>{`天气 : ${type}`}</span> &nbsp;&nbsp; <span>{`温度:${low}-${high}`}</span>
          </div>
        </div>
      </header>
    )
  }
}

export default Header