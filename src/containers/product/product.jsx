import React, {Component} from 'react';
import {Card, Button, Icon} from 'antd';

export default class Product extends Component {
  render() {
    return (
      <div>
        <Card title={<Button>123</Button>} extra={<Button type="primary"><Icon type="plus" />添加商品</Button>}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    )
  }
}