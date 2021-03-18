import {SAVE_CATEGORY_INFO} from "../action_types";

export const saveCategoryInfo = value => {
  return {type:SAVE_CATEGORY_INFO,data:value}
}