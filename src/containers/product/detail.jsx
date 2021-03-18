import React, {Component} from 'react';
import {Card, Button, Icon, List,message} from 'antd';
import {connect} from 'react-redux'
import {BASE_URL} from '../../config'
import {reqDetailProduct,reqCategoryList} from '../../api/index'
import './css/detail.less'

const {Item} = List

@connect(
  state => ({productInfo: state.productDetail,categoryList:state.categoryInfo}), {}
)
class Detail extends Component {
  componentDidMount() {
    let reduxProductList = this.props.productInfo
    const id = this.props.match.params.id
    const categoryList = this.props.categoryList
    if (reduxProductList.length){
      let arr1 = reduxProductList.find(item=>item._id === id)
      if (arr1){
        this.categoryId = arr1.categoryId
        let categoryItem = {}
        this.props.categoryList.forEach(item =>{

          if (item._id === this.state.categoryId){
            console.log(item)
            categoryItem = item
            console.log(1)
          }
        })
        console.log(categoryItem)
        this.setState({...arr1})
        this.setState({
          isLoading:false
        })
      }
    }else{
    this.getprodById(id)
    }
    if (categoryList.length){
     let result =  categoryList.find(item=>{
        return item._id === this.categoryId
      })
      this.setState({
        categoryname:result.name,
        isLoading:false,
      })
      console.log(result)
    }else{
      this.getcategorylist()
    }
    }
  getprodById = async(id) => {
   const result =  await reqDetailProduct(id)
    const {name,desc,price,imgs,detail,categoryId} = result.data
    this.categoryId = categoryId
    this.setState({
      name,
      desc,
      price,
      imgs,
      detail,
      categoryId,
    })
  }
  getcategorylist = async() => {
    const result = await reqCategoryList()
    const {data,status,msg} = result
    if (status === 0){
     let result = data.find(item=>{
        return item._id === this.categoryId
      })
      if (result){
        this.setState({
          categoryname: result.name,
          isLoading:false,
        })
      }
    }else {
      message.error(msg)
    }
  }
  state = {
    isLoading:true,
    name:'',
    desc:'',
    price:'',
    imgs:[],
    detail:'',
    categoryId:'',
    categoryname:''
  }

  render() {
    const {name,desc,price,imgs,detail} =this.state
    return (
      <div className='left-top'>
        <Card
          loading={this.state.isLoading}
          title={
            <div>
              <Button type="link" onClick={() => {
                this.props.history.go(-1)
              }}>
                <Icon style={{fontSize: '20px'}}
                      type="arrow-left"/>
              </Button>
              <span>商品详情</span>
            </div>
          }>
          <List>
            <Item>
              <div>
                <span className='detail-title'>商品名称:</span>
                <span>{name}</span>
              </div>
            </Item>
            <Item>
              <div>
                <span className='detail-title'>商品描述:</span>
                <span>{desc}</span>
              </div>
            </Item>
            <Item>
              <div>
                <span className='detail-title'>商品价格:</span>
                <span>{price}</span>
              </div>
            </Item>
            <Item>
              <div>
                <span className='detail-title'>商品分类:</span>
                <span>{this.state.categoryname}</span>
              </div>
            </Item>
            <Item>
              <div>
                <span className='detail-title'>商品图片:</span>
                {
                  imgs.map((item,index)=>{
                    return <img style={{width : '200px',height:'200px'}} key={index} src={`${BASE_URL}/upload/${item}`} alt="商品图片"/>
                  })
                }
              </div>
            </Item>
            <Item>
              <div>
                <span className='detail-title'>商品详情:</span>
                <span dangerouslySetInnerHTML={{__html:detail}}></span>
              </div>
            </Item>
          </List>
        </Card>
      </div>
    )
  }
}

export default Detail