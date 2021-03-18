import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, Card, Icon, Form, Input, Select, message} from "antd";
import {reqCategoryList, reqAddProduct,reqDetailProduct,reqUpdateProduct} from '../../api'
import PicturesWall from "./pictrue_wall";
import RichTextEditor from "./rich_text_editor";

const {Option} = Select;

class PriceInput extends React.Component {
  handleNumberChange = e => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    this.triggerChange({number});
  };

  handleCurrencyChange = currency => {
    this.triggerChange({currency});
  };

  triggerChange = changedValue => {
    const {onChange, value} = this.props;
    if (onChange) {
      onChange({
        ...value,
        ...changedValue,
      });
    }
  };

  render() {
    const {size, value} = this.props;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={value.number}
          onChange={this.handleNumberChange}
          style={{width: '65%', marginRight: '3%'}}
        />
        <Select
          value={value.currency}
          size={size}
          style={{width: '32%'}}
          onChange={this.handleCurrencyChange}
        >
          <Option value="rmb">RMB</Option>
          <Option value="dollar">Dollar</Option>
        </Select>
      </span>
    );
  }
}

@connect(
  state => ({categoryName: state.categoryInfo,productList: state.productDetail}),
  {}
)
@Form.create()
class AddUpdate extends Component {
  state = {
    categoryName: [],
    imgs: [],
    categoryNameById:{}
  }

  componentDidMount() {
    if (this.props.categoryName.length) {
      this.setState({
        categoryName: this.props.categoryName
      })
    } else {
      this.getCategoryList()
    }
    if (this.props.match.params.id){
      if (this.props.productList.length){
        console.log('----')
        let result =  this.props.productList.find(item=>{
        return item._id === this.props.match.params.id
        })
        const {imgs,detail} = result
        this.pictureWall.setfileList(imgs)
        this.RichText.setRichText(detail)
        this.setState({
          categoryNameById:{...result}
        })
      }else{
        this.getProductNameById()
      }
    }
  }
  getProductNameById = async() =>{
    const result = await reqDetailProduct(this.props.match.params.id)
    const {data,status,msg} = result
    if (status === 0){
      if (data){
        const {imgs,name,desc,price,categoryId,detail} = data
        this.setState({
          categoryNameById:{imgs,name,desc,price,categoryId,detail}
        })
        this.pictureWall.setfileList(imgs)
        this.RichText.setRichText(detail)
      }
    }else{
      message.error(msg)
    }
  }

  //获取分类列表
  getCategoryList = async () => {
    const result = await reqCategoryList()
    const {data, status} = result
    if (status === 0) {
      this.setState({
        categoryName: data
      })
    } else message.error('失败')

  }
  checkPrice = (rule, value, callback) => {
    if (value.number > 0) {
      return callback();
    }
    callback('价格必须大于零!');
  };
  handleSubmit = e => {
    let detail = this.RichText.getRichText()
    let imgs = this.pictureWall.getimagesName()
    let _id = this.props.match.params.id
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        values.price = values.price.number
        if (!this.props.match.params.id){
          const result = await reqAddProduct({...values, imgs, detail})
          const {status,msg} = result
          console.log(result)
          if (status ===0){
            message.success('添加商品成功')
            this.props.history.replace('/admin/prod_about/product')
          }else{
            message.error(msg)
          }
        }else{
          const result = await reqUpdateProduct({...values, imgs, detail,_id})
          const {status,msg} = result
          console.log(result)
          if (status ===0){
            message.success('修改商品成功')
            this.props.history.replace('/admin/prod_about/product')
          }else{
            message.error(msg)
          }
        }
      }
    });
  };

  render() {
    const cardTitle = (
      <div>
        <Button onClick={() => {
          this.props.history.go(-1)
        }} type="link" style={{fontSize: '20px'}}><Icon type="arrow-left"/></Button>
        <span>{this.props.match.params.id?'商品修改':'商品添加'}</span>
      </div>)
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 2},
        sm: {span: 2},
      },
      wrapperCol: {
        xs: {span: 7},
        sm: {span: 7},
      },
    };
    return (
      <Card title={cardTitle}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue:this.state.categoryNameById.name||'',
              rules: [
                {
                  required: true,
                  message: '请输入商品名称!',
                },
              ],
            })(<Input placeholder="商品名称"/>)}
          </Form.Item>
          <Form.Item label="商品描述">
            {getFieldDecorator('desc', {
              initialValue:this.state.categoryNameById.desc||'',
              rules: [
                {
                  required: true,
                  message: '请输入商品描述!',
                },
              ],
            })(<Input/>)}
          </Form.Item>
          <Form.Item label="商品价格">
            {getFieldDecorator('price', {
              initialValue: {number: this.state.categoryNameById.price||0, currency: 'rmb'},
              rules: [{
                required: true,
                message: '请输入商品名称!',
              }, {validator: this.checkPrice}],
            })(<PriceInput/>)}
          </Form.Item>
          <Form.Item label="商品分类">
            {getFieldDecorator('categoryId', {
              initialValue: this.state.categoryNameById.categoryId||'',
              rules: [
                {
                  required: true,
                  message: '请选择商品分类!',
                },
              ],
            })(
              <Select>
                <Option value="">请选择分类</Option>
                {this.state.categoryName.map(item => {
                  return <Option key={item._id} value={item._id}>{item.name}</Option>
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="商品图片" wrapperCol={{span: 12}}>
            <PicturesWall ref={pictureWall => this.pictureWall = pictureWall}/>
          </Form.Item>
          <Form.Item label="商品详情" wrapperCol={{span: 18}}>
            <RichTextEditor ref={RichText => {
              this.RichText = RichText
            }}/>
          </Form.Item>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form>
      </Card>
    )
  }
}

export default AddUpdate