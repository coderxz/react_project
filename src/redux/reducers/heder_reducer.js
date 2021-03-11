import {SET_TITLE} from '../action_types'
let initState = '首页'
export default function test(preState=initState,action) {
  const {type,data} = action
  let newState
  switch (type){
    case SET_TITLE:
      newState = data
      return newState
    default:
      return preState
  }
}