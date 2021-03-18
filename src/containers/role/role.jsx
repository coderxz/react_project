import React, {Component} from 'react';
import {Card, Button, Icon, Table, Modal, Input, Form, message, Tree} from 'antd';
import dayjs from 'dayjs'
import {reqRoleList, reqAddRole, reqAuthRole} from "../../api";
import {connect} from 'react-redux'
import menuList from '../../config/menu-config'

const {TreeNode} = Tree;

@connect(
  state => ({name: state.userInfo.user.username}),
  {}
)
@Form.create()
class Role extends Component {
  state = {
    addVisible: false,
    roleVisible: false,
    roleList: [],
    _id: '',
    checkedKeys: ['home'],
    menuList
  };

  componentDidMount() {
    this.getRoleList()
  }

  onCheck = checkedKeys => {
    this.setState({checkedKeys});
  };
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  getRoleList = async () => {
    const result = await reqRoleList()
    console.log(result)
    const {status, data} = result
    if (status === 0) {
      this.setState({roleList: data})
    }
  }
  // 新增角色确认按钮
  handleOk = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          addVisible: false,
        });
        const result = await reqAddRole(values.authName)
        const { status} = result
        if (status === 0) {
          message.success('添加角色成功!')
          this.getRoleList()
        }
        console.log('Received values of form: ', values);
      }
    });
  };
  // 授权确认按钮
  roleHandleOk = async () => {
    const result = await reqAuthRole({_id: this.state._id, menus: this.state.checkedKeys, auth_name: this.props.name})
    const {status, msg} = result
    console.log(result)
    if (status === 0) {
      message.success('授权成功!')
      this.getRoleList()
    } else {
      message.error(msg)
    }
    this.setState({
      roleVisible: false,
    });
  };
  // 取消按钮
  handleCancel = () => {
    this.setState({
      addVisible: false,
    });
  };
  // 授权取消按钮
  roleHandleCancel = () => {
    this.setState({
      roleVisible: false,
    });
  };
  //按钮拿_id,用于授权
  showAuth = (_id) => {
    const {roleList} = this.state
    const result = roleList.find(item => {
      return item._id === _id
    })
    this.setState({roleVisible: true, _id, checkedKeys: result.menus})
  }
  //新增权限前清空表单
  showAdd = () => {
    console.log('---')
    this.setState({
      addVisible : true
    })
    this.props.form.resetFields()

  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const dataSource = this.state.roleList
    const treeData = this.state.menuList
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) => {
          return dayjs(create_time).format('YYYY年 MM月-DD日 HH:mm:ss')
        }
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render: (auth_time) => {
          return auth_time ? dayjs(auth_time).format('YYYY年 MM月-DD日 HH:mm:ss') : ''
        }
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key: 'aaa',
        render: item => {
          return <Button type="link" onClick={() => {
            this.showAuth(item._id)
          }}>设置权限</Button>
        }
      },

    ];
    return (
      <Card title={
        <Button type="primary" onClick={() => {this.showAdd()}}>
          <span style={{marginRight: "8%"}}><Icon type="plus"/></span>
          <span>新建角色</span>
        </Button>

      }>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
          pagination={{defaultPageSize:5}}
          bordered
        />
        <Modal
          title="新增角色"
          visible={this.state.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('authName', {
                rules: [{required: true, message: '角色名不能为空'}],
              })(
                <Input
                  placeholder="请输入角色名称"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="设置权限"
          visible={this.state.roleVisible}
          onOk={this.roleHandleOk}
          onCancel={this.roleHandleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll
          >
            <TreeNode title="平台功能" key="top">
              {this.renderTreeNodes(treeData)}
            </TreeNode>

          </Tree>
        </Modal>
      </Card>
    )
  }
}

export default Role