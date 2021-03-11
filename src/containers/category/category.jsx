import React, {Component} from 'react';
import {reqCategoryList} from '../../api/index'
import {Card, Button, Icon, Table, message, Modal, Input, Form} from 'antd';
import {PAGE_SIZE} from '../../config/index'
import {reqAddCategory,reqUpDateCategory} from '../../api/'

const {Item} = Form;

@Form.create()
class Category extends Component {
  componentDidMount() {
    this.getCategoryList()
  }

  state = {
    categoryList: [],
    visible: false,
    poreType: '',
    loading: true,
    categoryName:'',
    categoryId:''
  }
  showAdd = () => {
    this.setState({
      poreType: 'add',
      visible: true,
    });
  };
  showUpData = (item) => {
    const {_id,name} = item
    this.setState({
      poreType: 'updata',
      visible: true,
      categoryName:name,
      categoryId:_id
    });
  };
  // 添加分类
  addCategory = async (values)=>{
    // 添加逻辑
    const result = await reqAddCategory(values)
    const {status, msg} = result
    if (status === 0) {
      message.success('添加分类成功!')
      await this.getCategoryList()
      this.setState({
        visible: false,
      });
      this.props.form.resetFields()
    }
    if (status === 1) {
      message.warning(msg)
    }
  }
  // 修改分类
  upDateCategory = async(values) =>{
    // 修改逻辑
    const categoryName = values.categoryName
    if (this.state.categoryName === values.categoryName){
      message.warning('分类名称未改变,请重新输入!')
      return
    }
    const result = await reqUpDateCategory(this.state.categoryId,categoryName)
    const {status,msg} = result;
    if (status === 0){
      message.success('更新分类成功!')
      await this.getCategoryList()
      this.setState({
        visible: false,
      });
      this.props.form.resetFields()
      this.setState({
        categoryName:''
      })
    }
    if (status === 1){
      message.error(msg)
    }

  }
  // 添加修改逻辑
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        const {poreType} = this.state
        if (poreType === 'updata') await this.upDateCategory(values)
        if (poreType === 'add') await this.addCategory(values)
      }else{
        message.warning('输入有误,请重新输入!')
      }
    });
  };
  //表单取消逻辑
  handleCancel = () => {
    this.setState({
      visible: false,
      categoryName:''
    });
    this.props.form.resetFields()
  };
  // 获取分类列表
  getCategoryList = async () => {
    const result = await reqCategoryList()
    const {data, status, msg} = result;
    if (status === 0) {
      this.setState({
        categoryList: data.reverse(),
        loading: false
      })
    } else {
      message.error(msg)
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const {visible, poreType} = this.state
    const dataSource = this.state.categoryList
    const {getFieldDecorator} = this.props.form;
    const columns = [
      {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'age',
        render: (item) => {return (<Button type='link' onClick={() => {this.showUpData(item)}}>修改分类</Button>)},
        width: '25%',
        align: 'center',
      },
    ];
    return (
      <div>
        <Card extra={<Button type="primary" onClick={this.showAdd}><Icon type="plus"/>添加</Button>}>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
            pagination={{pageSize: PAGE_SIZE,showQuickJumper:true}}
            loading={this.state.loading}
          />
        </Card>
        <Modal
          title={poreType === 'add' ? '添加分类' : '修改分类'}
          visible={visible}
          okText="确定"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('categoryName', {
                rules: [{required: true, message: '分类名必填!'},],
                initialValue:this.state.categoryName
              })(
                <Input
                  placeholder="分类名称"
                />,
              )}
            </Item>
          </Form>
        </Modal>
      </div>

    )
  }
}

export default Category