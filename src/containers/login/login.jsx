import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {reqLogin} from '../../api'
import {createSaveUserInfoAction} from '../../redux/actions/login_action'
import logo from '../../static/images/logo.png';
import './css/login.less'
import {Form, Icon, Input, Button,message} from 'antd';

const {Item} = Form
@connect(
  state => ({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)
@Form.create()
class Login extends Component {
  componentDidMount() {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async(err, values) => {
      const {username,password} =values
      if (!err) {
      let result = await reqLogin(username,password)
        const{data,msg,status} = result
        if (data){
          const {token,user} = data
          if (status === 0){
            this.props.saveUserInfo({
              token,
              user
            })
            this.props.history.replace('/admin')
          }
        }else{
          message.warning(msg,1.5)
        }
        }

    });
  }
  rules = function(rule, value, callback){
    if(!value){
      callback('密码不能为空!')
    }else if(value.length<4){
      callback('密码不能小于4位')
    }else if(value.length>12){
      callback('密码不能大于12位')
    }else if(!(/^\w+$/).test(value)){
      callback('密码只允许数字字母下划线组成')
    }else{
      callback()
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    if(this.props.isLogin){
      return <Redirect to="/admin"/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  {required: true, message: '用户名必填!'},
                  {min: 4, message: '用户名最小长度为4位'},
                  {max: 12, message: '用户名最大长度为12位'},
                  {pattern: /^\w+$/, message: '用户名只允许数字字母下划线组成'}
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                  placeholder="用户名"
                />,
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [
                  {validator:this.rules},
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Item>
            <Item>
              <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Login