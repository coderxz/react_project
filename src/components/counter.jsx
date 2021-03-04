import React,{Component} from 'react';
export default class Counter extends Component{
  increment = () => {
    const value = this.select.value
    this.props.increment(value*1)
  }
  asyncIncrement = () => {
    const value = this.select.value
    this.props.asyncIncrement(value*1,1000)
  }
  render() {
    return(
      <div>
        <h1>当前计数:{this.props.count}</h1>
        <select ref={select=>this.select=select}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>&nbsp;&nbsp;
        <button onClick={this.increment}>+</button>&nbsp;&nbsp;
        <button>-</button>&nbsp;&nbsp;
        <button>oddAdd</button>&nbsp;&nbsp;
        <button onClick={this.asyncIncrement}>asyncAdd</button>&nbsp;&nbsp;
      </div>
    )
  }
}