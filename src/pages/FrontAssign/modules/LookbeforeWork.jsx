import {createModel} from '@rematch/core'
import {queryWorkOrder} from '@/services/getData'
import {Modal,Button, Form, Select, Input, Row, Col, message} from 'antd'
const initState = Object.freeze({
    Info:{},
    goodsList:[],
    worksList:[],
    settlementDto:{},
    loading:true,
    worktotalnum:'',
    worktotalmoney:'',
    workTotalYmoney:'',
    goodsNUm:'',
    goodstotalmoney:'',
    goodsTotalYmoney:''

})

export default createModel ({
  name: 'lookbeforeWork',

  state: {
    ...initState
  },

  effects: {
    async QueryWorkOrder (payload) {
      const res = await queryWorkOrder(payload)
      if (res.success) {
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        let e = 0
        let f = 0

        res.data.goodsDtos.items.map((item, index) => {
          item['key'] = index + 1
          a += (+item.qty)*10000
          b += (+item.amount)*10000
          c += (+item.receivableAmount)*10000
        })
        res.data.workItemDtos.items.map((item, index) => {
          item['key'] = index + 1
          d += (+item.qty)*10000
          e += (+item.amount)*10000
          f += (+item.receivableAmount)*10000
        })
        console.log(res.data.goodsDtos.items)
        this.SET_STATE({
          Info:res.data.mstrDto,
          settlementDto:res.data.settlementDto,
          goodsList:res.data.goodsDtos.items,
          worksList:res.data.workItemDtos.items,
          loading:false,
          worktotalnum:d,
          worktotalmoney:e,
          workTotalYmoney:f,
          goodsNUm:a,
          goodstotalmoney:b,
          goodsTotalYmoney:c
        })
      }
    }

  },

  reducers:{
    RESET_STATE (state, payload) {
      return { ...initState}
    },


    SET_STATE (state, payload) {
      Object.keys(payload).forEach( (key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})
