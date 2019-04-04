


import {createModel} from '@rematch/core'
import {getMdmWorkLocationForPage,getDicDataByCategoryCode} from '@/services/getData'

const initState = Object.freeze({
    data:{
      pageSize:10,
      index:1
    },
    dataSource:[],
    totalNumber:0,
    ADDVisible:false,
    id:'',
    addData:{
      id:'',
      workLocationNo:'',
      workLocationName:'',
      workLocationTypeId:'',
      workLocationTypeNo:'',
      workLocationTypeName:'',
      isEnabled:''
    },
    workList:[],
    DELVisible:false,
    SCVisible:false
})

export default createModel ({
  name: 'stationManagement',

  state: {
    ...initState
  },

  effects: {
    async GetMdmWorkLocationForPage (payload) {
      const res = await getMdmWorkLocationForPage (payload)
      if (res.success) {
        let list = res.data.items
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          dataSource:list,
          totalNumber:res.data.totalNumber,
          data:payload,
        })
      }
    },
    async GetDicDataByCategoryCode (code) {
      const res = await getDicDataByCategoryCode ({code})
      console.log(res)
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          workList:list
        })
      }
    }


  },
  reducers:{
    RESET_STATE (state, payload) {
      return { ...initState}
    },


    SET_STATE (state, payload) {
      console.log(payload)
      Object.keys(payload).forEach( (key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})
