import React, {Component} from 'react';
import {Card, Button, Icon, Table, Form, Modal, Input, Select,message} from 'antd';
import dayjs from 'dayjs'
import {PAGE_SIZE} from '../../config'
import {reqUserList, reqAddUser,reqDeleteUser} from "../../api";

const {Option} = Select

@Form.create()
class User extends Component {
  state = {
    visible: false,
    userList: [],
    roleList: []
  };

  componentDidMount() {
    this.getUserList()
  }

  getUserList = async () => {
    const result = await reqUserList()
    const {status, data} = result
    if (status === 0) {
      const {users, roles} = data
      this.setState({
        userList: users,
        roleList: roles
      })
    }
  }
  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await reqAddUser({...values})
        console.log(result)
        const {status} = result
        if (status ===0){
          message.success('新增用户成功!')
          this.getUserList()
          this.setState({
            visible: false,
          });
        }else{
          message.error('新增用户失败!')
        }
        console.log('Received values of form: ', values);
      }
    });

  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  deleteUser = async(userId) => {
    const result = await reqDeleteUser({userId})
    const {status} = result
    console.log(result)
    if (status===0){
      message.success('删除用户成功！')
      this.getUserList()
    }else{
      message.error('删除用户失败！')
    }
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const dataSource = this.state.userList
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) => {
          return dayjs(create_time).format('YYYY年 MM月-DD日 HH:mm:ss')
        }
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id) => {
          const result = this.state.roleList.find(item => {
            return item._id === id
          })
          return result.name
        }
      },
      {
        title: '操作',
        render: (item) => {
          return (
            <div>
              <Button type="link">修改</Button>
              <Button type="link" onClick={() => {this.deleteUser(item._id)}}>删除</Button>
            </div>
          )
        }
      }
    ];
    return (
      <div>
        <Card title={
          <Button type="primary" onClick={this.showModal}>
            <span style={{marginRight: "8%"}}><Icon type="plus"/></span>
            <span>新增用户</span>
          </Button>
        }>
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{defaultPageSize: PAGE_SIZE}}
            rowKey="_id"
          />;
        </Card>
        <Modal
          title="新增用户"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
        >
          <Form labelCol={{span: 4}} wrapperCol={{span: 18}}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{required: true, message: '用户名必须输入!'}],
              })(<Input placeholder="请输入用户名"/>)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{required: true, message: '密码必须输入!'}],
              })(<Input placeholder="请输入密码"/>)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('phone', {
                rules: [{required: true, message: '手机号必须输入!'}],
              })(<Input placeholder="请输入用户名"/>)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [{required: true, message: '邮箱必须输入!'}],
              })(<Input placeholder="请输入用户名"/>)}
            </Form.Item>
            <Form.Item label="角色">
              {getFieldDecorator('role_id', {
                rules: [{required: true, message: '必须选择一个角色!'}],
                initialValue: ''
              })(
                <Select>
                  <Option value=''>请选择角色</Option>
                  {
                    this.state.roleList.map(item => {
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User