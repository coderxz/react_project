import React, {Component} from 'react';
import {Form,Icon,Input,Button,message} from 'antd';
import './css/login.less'
import Logo from './imgs/logo.png'
const {Item} = Form;
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }else{
        message.error('请正确输入信息!')
      }
    });
  }
  pwdValidator = (rule, value, callback) => {
    if (!value){
      callback('密码不能为空!')
    }else if (value.length>12){
      callback('密码长度必须小于12位')
    }else if (value.length<4){
      callback('密码长度必须大于4位')
    }else if (!(/^\w+$/).test(value)){
      callback('密码必须是英文,数字,下划线组成!')
    }else{
      callback()
    }
    callback()
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="login">
        <header>
          <img src={Logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '用户名不能为空!' },
                  { max: 12, message: '用户名必须小于12位' },
                  { min: 4, message: '用户名必须大于等于4位' },
                  { pattern: /^\w+$/, message: '用户名必须是英文,数字,下划线组成' },
                  ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [
                  { validator: this.pwdValidator},
                  ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Form.create()(Login)