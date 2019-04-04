import {createModel} from '@rematch/core'
import {getDicDataByCategoryCode,getWorkOrderDeposit, getBasValueByBasCategoryNo,finishWorkOrder,reworkWorkOrder,listDecorationLWorkOrder} from '@/services/getData'
import {message} from 'antd'
const initState = Object.freeze({
  data: {
    workOrderStartDate:'',
    workOrderEndDate:'',
    settleateStartDate:'',
    settleateEndDate:'',
    bizTypeCode:'',
    woStatusCode:'',
    woNo:'',
    refWoNo:'',
    vin:'',
    pageSize:10,
    currentIndex:1
  },
  Time:[],
  endTime:[],
  loading: false,
  stateList:[],
  yewuList:[],
  tableList:[],
  totalNumber:'',
  spin: true,
  ID:'',
// 定金的推送
  moneyVisible: false,
  DJconfirmLoading: false,
  basemoney:'',//已收定金
  obj:{},
  object: {
    woId:'',
    deposit:'',
  },
// 作废
  NoUseLodaing: false,
  NoUseVisible: false,
  NoUseId:'',
  option:{},

  // 打印
  palyVisible: false,
  // 取消结算
  Mathvisible: false,
  MathTruevisible: false,
  OPt:{},
})

export default createModel ({
  name: 'decorationWorkOrderManagement',

  state: {
    ...initState
  },

  effects: {
    async GetDicDataByCategoryCode(code) {
      const res = await getDicDataByCategoryCode({code})
      if (res.success) {
        if (code == '7020') {
          let list = res.data
          list.map((item, index) => {
            item['key'] = index
          })
          this.SET_STATE({
            stateList:list
          })
        }
      }
    },

     // 获取列表数据
     async ListDecorationLWorkOrder (payload) {
      const res = await listDecorationLWorkOrder (payload)
      if (res.success) {
        let list = res.data.items
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          tableList:list,
          totalNumber:res.data.totalNumber,
          spin:false,
          data:payload,
          loading: false
        })
      }
    },

    //完工
    async FinishWorkOrder (woId,n,data) {
      const res = await finishWorkOrder({woId})
      if (res.success) {
        message.success('完工成功')
        // 重新查一遍
        this.ListDecorationLWorkOrder(data)
      } else {
        message.error(res.msg)
      }
    },

    // 返工
    async FeworkWorkOrder (woId,n,data) {
      const res = await reworkWorkOrder({woId})
      if (res.success) {
        message.success('返工成功')
        // 重新查一遍
        this.ListDecorationLWorkOrder(data)
      } else {
        message.error(res.msg)
      }
    },

    async GetWorkOrderDeposit (woId) {
      const res = await getWorkOrderDeposit ({woId})
      if (res.success) {
        this.SET_STATE({
          basemoney: res.data || 0
        })
      } else {
        message.error(res.msg)
      }
    },


    async GetBasValueByBasCategoryNo(categoryNo) {
      const res = await getBasValueByBasCategoryNo({categoryNo})
      if (res.success) {
        if (categoryNo == 'AS1000') {
          let list = res.data
          list.map((item, index) => {
            item['key'] = index
          })
          this.SET_STATE({
            yewuList:list
          })
        }
      }
      },



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
