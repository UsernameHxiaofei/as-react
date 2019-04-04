  import {createModel} from '@rematch/core'
import {getWoMaterialInfo,getHrEmpMstrByOrgId} from '@/services/getData'
import { message } from 'antd';
const initState = Object.freeze({
    Obj: {
      sendingMaterial: false,
      woId: ''
    },
    Search:{},
    showTable:[],
    editTable:[],
    loading:true,
    peoperList:[],
    length:0,
    TableList:[],
    keyArr:[]
})

export default createModel ({
   name: 'returnofworkorders',

   state: {
    ...initState
   },

    effects: {
      async GetWoMaterialInfo (obj) {
        const res = await getWoMaterialInfo (obj)
        console.log(res)
        if (res.success) {
         res.data.woMaterialVOs.map((item, index) => {
            item['key'] = index + 1
            item['deliveryNumber'] = 0
        })
        res.data.workItemInfos.map((item, index) => {
          item['key'] = index + 1
        })
        this.SET_STATE({
          Search: {
            sendingMaterialId:res.data.sendingMaterialId,
            sendingMaterialNo:res.data.sendingMaterialNo,
            carPlateNo:res.data.carPlateNo,
            vin:res.data.vin,
            cusName:res.data.cusName,
            woNo: res.data.woNo,
            woId:res.data.woId,
            scEmplyoeesName:res.data.scEmplyoeesName,
            carBrandName:res.data.carBrandName,
            carSeriesName:res.data.carSeriesName,
            carModelName:res.data.carModelName,
            createDate:res.data.createDate,
            woStatusName:res.data.woStatusName,
          },
          loading:false,
          length:res.data.woMaterialVOs.length,
          editTable: res.data.woMaterialVOs, //材料
          showTable: res.data.workItemInfos //工项
        })
        } else {
          message.error(res.msg)
        }
      },
       async GetHrEmpMstrByOrgId () {
          const res = await getHrEmpMstrByOrgId ()
          if (res.success) {
            let list = res.data
            list.map((item, index) => {
              item['key'] = index + 10
            })
            this.SET_STATE({
              peoperList:list
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

