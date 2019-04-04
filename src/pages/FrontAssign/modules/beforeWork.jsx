import {createModel} from '@rematch/core'
import {getDicDataByCategoryCode,getBasValueByBasCategoryNo,listFrontLoadingLWorkOrder,reworkWorkOrder,finishWorkOrder} from '@/services/getData'
import {Modal,Button, Form, Select, Input, Row, Col, message} from 'antd'
const initState = Object.freeze({
    data:{
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
        currentIndex:1,
    },
    totalNumber:'',
    loading: true,
    spin:true,
    tableList:[],
    Time:[],
    endTime:[],
    stateList:[],
    yewuList:[],
    palyVisible: false, //打印
    NoUseVisible: false,// 作废
    NoUseId:'', //作废的id
    ID:'',
    NoUseLodaing:false,
    obj:{},
})

export default createModel ({
  name: 'beforeWork',

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
    async ListFrontLoadingLWorkOrder (payload) {
      const res = await listFrontLoadingLWorkOrder (payload)
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
        this.ListFrontLoadingLWorkOrder(data)
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
        this.ListFrontLoadingLWorkOrder(data)
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
