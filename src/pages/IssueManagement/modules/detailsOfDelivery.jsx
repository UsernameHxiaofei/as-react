
import {createModel} from '@rematch/core'

const initState = Object.freeze({
  Search:{},
  TableList:[],
  id:'',
  show:'inlineBlock',
  loading:false
})

export default createModel({

  name: 'detailsOfDelivery',

  state:{
    ...initState
  },

  effects: {

  },

reducers: {
  RESET_STATE(state, payload) {
    return { ...initState }
  },


  SET_STATE(state, payload) {
    Object.keys(payload).forEach((key) => {
      if (state[key] !== undefined && payload[key] !== undefined) {
        state[key] = payload[key]
      }
    })
  }
}
})
