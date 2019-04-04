import {createModel} from '@rematch/core'
import {getBasValueByBasCategoryNo,getDicDataByCategoryCode,listEvaluateOrder} from '@/services/getData'
// 初始化数据
const initState = Object.freeze({
  // 查询的条件
  data: {
    eoNo:'', //估计单号
    woNO:'',
    crtDateStart: '', //开单日期,
    crtDateEnd:'', //开单结束
    carPlateNo:'', //车牌号
    vin:'', //车架号
    eoStatusCode:'',//单据状态编码
    bizTypeCode:'',//业务类型编码
    pageSize:10,
    currentIndex :1
  },
  stateList:[],// 单据状态列表
  bizTypeList:[], //业务类型列表
  ZFVisible:false,//作废模态框
  ZGDVisible:false,//转工单
  dataSource:[], //表格数据
  TimeData:[],
  totalNumber:0,
  id:'',
  woNo:"",
  eoNo:'',
  carPlateNo:'',
  vin:'',
  eoNo:'', //估价单号
  DYprintVisible:false, //打印
  eoStatusName:'', //估价单状态
  spin:true
})

export default createModel({
  name:'valuationManagement',

  state: {
    ...initState,
  },
  // 异步修改数据
  effects: {
    async GetDicDataByCategoryCode (code) {
      const res = await getDicDataByCategoryCode({code})
      if (res.success) {
        if (code == '7160') {
          this.SET_STATE({
            stateList:res.data
          })
        }
      }
    },

    async GetBasValueByBasCategoryNo (categoryNo) {
      const res = await getBasValueByBasCategoryNo({categoryNo})
      if (res.success) {
        if (categoryNo == 'AS1000') {
          this.SET_STATE({
            bizTypeList:res.data
          })
        }
      }
    },

    // 获取列表的数据
    async ListEvaluateOrder (payload) {
      const res = await listEvaluateOrder(payload)
      if (res.success) {
        let list = res.data.items
        list.map((item,index) => {
          item['key'] = index
        })
        this.SET_STATE({
          dataSource: list,
          totalNumber:res.data.totalNumber,
          data:payload,
          spin: false
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
