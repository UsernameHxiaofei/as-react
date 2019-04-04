

import {createModel} from '@rematch/core'
import {queryWorkOrderNoPage} from '@/services/getData'
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
const initState = Object.freeze({
  mstrVO:{},
  settlementVO:[],
  listGoodsVO:[],
  listWorkItemVO :[],

    totalNum:0,
    totalMoney:0,
    YtotalMoney:0,
    YHmoney:0,

    wtotalNum:0,
    wtotalMoney:0,
    wYtotalMoney:0,
    wYHmoney:0,

})

// GET_TOTAL (arr, key) {
//   arr.reduce((sum, item) => {
//     if (item[key] && item.index != 0) {
//       return accAdd(sum, Number(item[key]));
//     }
//     return sum;
//   }, 0)
// }

export default createModel ({
    name:'viewValuationList',

    state: {
      ...initState,
    },

     effects: {
      async QueryWorkOrderNoPage (eoId) {
        const res = await queryWorkOrderNoPage({eoId})
        console.log(res)
        if (res.success) {
          let Goods = res.data.listGoodsVO

          let totalNum = 0
          let totalMoney = 0
          let YtotalMoney = 0
          let YHmoney = 0

          let wtotalNum = 0
          let wtotalMoney = 0
          let wYHmoney = 0
          let wYtotalMoney = 0
          Goods.map((item, index) => {
            item['key'] = index + 1
            totalNum += (+item.qty)*100
            totalMoney += (+item.amount)*100
            YHmoney += (+item.reduceAmount)*100
            YtotalMoney += (+item.receivableAmount)*100
          })

          let work = res.data.listWorkItemVO
          work.map((item, index) => {
            item['key'] = index + 1
            wtotalNum += (+item.qty)*100
            wtotalMoney += (+item.amount)*100
            wYHmoney += (+item.reduceAmount)*100
            wYtotalMoney += (+item.receivableAmount)*100
          })


          let list = [res.data.settlementVO]
          list.map((item, index) => {
            item['key'] = index
          })
          this.SET_STATE({
            mstrVO:res.data.mstrVO,
            settlementVO:list,
            listGoodsVO:Goods,
            listWorkItemVO:work,
            totalNum:totalNum/100,
            totalMoney:totalMoney/100,
            YtotalMoney:YtotalMoney/100,
            YHmoney:YHmoney/100,
            wtotalNum:wtotalNum/100,
            wtotalMoney:wtotalMoney/100,
            wYtotalMoney:wYtotalMoney/100,
            wYHmoney:wYHmoney/100,
          })
        }
      }
     },


     reducers: {
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
