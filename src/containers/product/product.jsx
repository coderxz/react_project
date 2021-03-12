import React, {Component} from 'react';
import {Card, Button, Icon, Select, Input, Table,message} from 'antd';
import {reqProductList} from '../../api'
import {PAGE_SIZE} from '../../config/index'

const {Option} = Select;

export default class Product extends Component {
  state = {
    productList:[],
    paginationConfig:{
      current:1
    },
    loading:true
  }
  handleChange = (value) => {
    console.log(value)
  }
  onShowSizeChange =(current, size) =>{
    console.log(current, size)
  }
  componentDidMount() {
    this.getProductList(this.state.paginationConfig.current,PAGE_SIZE)
      .then(value => value)
  }
   getProductList = async(a) => {
   const result = await  reqProductList(a,PAGE_SIZE)
     const {status,data,msg} = result
     const {pageNum,pageSize,total} = data
     if (status === 0){
       this.setState({
         productList:data.list,
         paginationConfig:{current:pageNum
           ,pageSize,total},
         loading:false
       })
     }
     if (status ===1){
       message.error(msg)
       this.setState({
         loading:false
       })
     }
  }
  render() {
    const dataSource = this.state.productList

    const columns = [
      {
        title: '商品名称',
        width:'18%',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        align: 'center',
        width:'8%',
        dataIndex: 'price',
        key: 'price',
        render: price => '¥' + price
      },
      {
        title: '状态',
        width:'8%',
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          return (
            <div>
              <Button>{status===1 ? '下架':'上架'}</Button><br/>
              <span>{status===1 ? '在售':'下架'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width:'8%',
        align: 'center',
        dataIndex: 'opera',
        key: 'opera',
        render: () => {
          return (
            <div>
              <Button type="link">详情</Button><br/>
              <Button type="link">修改</Button>
            </div>
          )
        }
      },
    ];
    return (
      <div>
        <Card
          title={
            <div>
              <Select defaultValue="name" onChange={this.handleChange}>
                <Option value="name">按名称搜索</Option>
                <Option value="2">按描述搜索</Option>
              </Select>
              <Input placeholder="请选择" allowClear style={{width: '20%', margin: '0 10px'}}/>
              <Button>搜索</Button>
            </div>
          }
          extra={<Button type="primary"><Icon type="plus"/>添加商品</Button>}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey='_id'
            loading={this.state.loading}
            pagination={{
              current:this.state.paginationConfig.current,
              pageSize:this.state.paginationConfig.pageSize,
              total:this.state.paginationConfig.total,
              onChange:this.getProductList,
              onShowSizeChange:this.onShowSizeChange
            }}

          />;
        </Card>
      </div>
    )
  }
}