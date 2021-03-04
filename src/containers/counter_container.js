import Counter from "../components/counter";
import {increment,decrement,asyncIncrement} from '../redux/actions/counter_action'
import {connect} from 'react-redux'
export default connect(
  state=>({count:state.count,person:state.person}),
  {
    increment,
    decrement,
    asyncIncrement
  }
)(Counter)