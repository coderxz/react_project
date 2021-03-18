import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Card, Button, Icon, Select, Input, Table, message} from 'antd';
import {saveProductInfo} from '../../redux/actions/product_action'
import {reqProductList, reqUpDtaProduct, reqSearchProduct} from '../../api'
import {PAGE_SIZE} from '../../config/index'

const {Option} = Select;
@connect(
  state => ({productInfo:state.productInfo}),{
    saveProductInfo
  })
class Product extends Component {
  state = {
    productList: [],
    paginationConfig: {
      current: 1
    },
    loading: true,
    keyword: '',
    searchType: 'productName'
  }
  handleChange = (value) => {
    console.log(value)
  }
  onShowSizeChange = (current, size) => {
    console.log(current, size)
  }

  componentDidMount() {
    this.getProductList(this.state.paginationConfig.current, PAGE_SIZE)
      .then(value => value)
  }

  getProductList = async (a = 1) => {
    let result;
    if (this.isSearch) {
      const {searchType, keyword} = this.state
      result = await reqSearchProduct(a, PAGE_SIZE, searchType, keyword);
      const {data} = result
      this.props.saveProductInfo(data.list)
    } else {
      result = await reqProductList(a, PAGE_SIZE)
      const {data} = result
      this.props.saveProductInfo(data.list)
    }
    const {status, data} = result
    const {pageNum, pageSize, total} = data
    if (status === 0) {
      this.setState({
        productList: data.list,
        paginationConfig: {
          current: pageNum,
          pageSize,
          total
        },
        loading: false
      })
    }
    if (status === 1) {
      message.error('获取商品列表失败')
      this.setState({
        loading: false
      })
    }
  }

  upDataProduct = async (item) => {
    let {status, _id} = item
    if (status === 1) {
      status = 0
    } else {
      status = 1
    }
    console.log(status)
    const result = await reqUpDtaProduct(_id, status)
    console.log(result)
    const productList = [...this.state.productList]
    const res = productList.map(item => {
      if (item._id === _id) {
        item.status = status
        return item
      }
      return item
    })
    this.setState({
      productList: res
    })

    if (result.status === 0) {
      console.log(this.state.paginationConfig.current)
      message.success('更新商品状态成功!')
    }
  }
  search = async () => {
    this.isSearch = true
    await this.getProductList()
  }

  render() {
    const dataSource = this.state.productList

    const columns = [
      {
        title: '商品名称',
        width: '18%',
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
        width: '8%',
        dataIndex: 'price',
        key: 'price',
        render: price => '¥' + price
      },
      {
        title: '状态',
        width: '8%',
        align: 'center',
        key: 'status',
        render: (item) => {
          return (
            <div>
              <Button onClick={() => {
                this.upDataProduct(item)
              }}
                      type={item.status === 1 ? 'danger' : 'primary'}
              >
                {item.status === 1 ? '下架' : '上架'}
              </Button><br/>
              <span>{item.status === 1 ? '在售' : '已停售'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: '8%',
        align: 'center',
        key: 'opera',
        render: (item) => {
          return (
            <div>
              <Button type="link" onClick={() => {this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>详情</Button><br/>
              <Button type="link" onClick={() => {this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
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
              <Select defaultValue="productName" onChange={(value) => {
                this.setState({searchType: value})
              }}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
              <Input
                placeholder="请选择"
                allowClear
                style={{width: '20%', margin: '0 10px'}}
                onChange={(e) => {
                  this.setState({keyword: e.target.value})
                }}
              />
              <Button onClick={this.search}>搜索</Button>
            </div>
          }
          extra={<Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}><Icon type="plus"/>添加商品</Button>}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey='_id'
            loading={this.state.loading}
            pagination={{
              current: this.state.paginationConfig.current,
              pageSize: this.state.paginationConfig.pageSize,
              total: this.state.paginationConfig.total,
              onChange: this.getProductList,
              onShowSizeChange: this.onShowSizeChange
            }}

          />;
        </Card>
      </div>
    )
  }
}
export default Product