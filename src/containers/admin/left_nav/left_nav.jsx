import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import menuList from '../../../config/menu-config'
import logo from '../../../static/images/logo.png'
import {setTitle} from '../../../redux/actions/header_actions'
import './css/leftnav.less'

const {SubMenu, Item} = Menu;
@connect(state=>({}),{
  setTitle
})
@withRouter
class LeftNav extends Component {
  componentDidMount() {
  }
  setTitle = (path) =>{
    console.log(path)
    // this.props.setTitle(path)
  }
  state = {
    collapsed: false,
  };
  showMenu = (target) => {
   return target.map(item => {
      if (!item.children) {
        return (
          <Item key={item.key} onClick={()=>{this.props.setTitle(item.title)}}>
            <Link to={item.path}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }>
            {
              this.showMenu(item.children)
            }
          </SubMenu>
        )
      }
    })
  }
  render() {
    return (
      <div>
        <header className="left-nav">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </header>
        <Menu
          selectedKeys={this.props.location.pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
        >
          {
            this.showMenu(menuList)
          }


        </Menu>
      </div>
    )
  }
}
export default LeftNav