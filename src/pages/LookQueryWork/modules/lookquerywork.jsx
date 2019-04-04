import {createModel} from '@rematch/core'
import {} from 'antd'
import {queryWorkOrder} from '@/services/getData'

const initState = Object.freeze({
    data: {
      woId:'4f08a89912be4c63ac9cab322ce4cc26',
      page:1,
      pageSize:1000
    },
    mstrDto:{},
    goodsTable:[],
    workTable:[],
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
  name: 'lookquerywork',

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
        this.SET_STATE({
          mstrDto:res.data.mstrDto,
          settlementDto:res.data.settlementDto,
          goodsTable:res.data.goodsDtos.items,
          workTable:res.data.workItemDtos.items,
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

