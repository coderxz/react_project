import {INCREMENT,DECREMENT} from '../action_type'
let initState = 0
export default function changeCount(perState=initState,state) {
  const {type,data} = state
  let newState;
  switch (type){
    case INCREMENT:
      newState = perState + data
      return newState
    case DECREMENT:
      newState = perState - data
      return newState
    default:
      return perState;
  }
}