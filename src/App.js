import React,{Component} from 'react';
import CounterContainer from './containers/counter_container'
export default class App extends Component{
  render() {
    return(
      <div>
        <CounterContainer/>
      </div>
    )
  }
}