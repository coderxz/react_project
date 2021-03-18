import {SAVE_CATEGORY_INFO} from '../action_types'
let initState = []
export default function state(preState=initState,action) {
  const {data,type} = action
  let newState
  switch (type){
    case SAVE_CATEGORY_INFO:
      newState = [...data]
      return newState
  }
return preState
}