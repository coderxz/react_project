import {SAVE_PRODUCT_INFO} from '../action_types'
let initState = []
export default function test(preState=initState,action) {
  const {type,data} = action
  let newState
  switch (type){
    case SAVE_PRODUCT_INFO:
      newState = data
      return newState
    default:
      return preState
  }
}