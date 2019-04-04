import {createModel} from '@rematch/core'
import {queryWorkOrder} from '@/services/getData'

const initState = Object.freeze({
  Info: {
    woNo:'',
    woStatusName: '',
    woCreatorEmpName:'',
    woCreateDate:'',
    cusName:'',
    cusContactPhone:'',
    memberNo:'',
    carPlateNo:'',
    vin:'',
    carBrandName:'',
    carSeriesName:'',
    carModelName:'',
    carEngineeNo:'',
    carColorName:'',
    carPowerTypeName:'',
    fuelMeterScaleName:'',
    estimatedCarDeliveryDate:"",
    bizTypeName:"",
    oemOrderNo:'',
    workHourlyPrice:'',
    scEmpName:"",
    precheckResult:'',
    repairAdvice:"",
    cusDesc:""
  },
  worksList:[],
  goodsList:[],
  settlementDto:{
    totalAmount:'',
    workItemAmount:'',
    goodsAmount:'',
    receivableAmount:'',
    payAmount:""
  },
  worktotalnum:'',
  worktotalmoney:'',
  workTotalYmoney:'',
  goodsNUm:'',
  goodstotalmoney:'',
  goodsTotalYmoney:'',
  loading: true,

})


export default createModel ({
  name: 'lookdecorationWorkOrderManagement',
  state: {
    ...initState
  },
  effects: {
    async QueryWorkOrder (obj) {
      const res = await queryWorkOrder (obj)
      console.log(res)
      if (res.success) {
        let worksList = res.data.workItemDtos.items
        let goodsList = res.data.goodsDtos.items
        let a = 0
        let b = 0
        let c = 0
        let d = 0
        let e = 0
        let f = 0
        worksList.map((item, index) => {
          item['key'] = index + 1
          a += (+item.qty)*10000
          b += (+item.amount)*10000
          c += (+item.receivableAmount)*10000
        })
        goodsList.map((item, index) => {
          item['key'] = index + 1
          d += (+item.qty)*10000
          e += (+item.amount)*10000
          f += (+item.receivableAmount)*10000
        })
        this.SET_STATE({
          loading: false,
          Info:{
            ...this.Info,
            woNo:res.data.mstrDto.woNo,
            woStatusName: res.data.mstrDto.woStatusName,
            woCreatorEmpName:res.data.mstrDto.woCreatorEmpName,
            woCreateDate:res.data.mstrDto.woCreateDate,
            cusName:res.data.mstrDto.cusName,
            cusContactPhone:res.data.mstrDto.cusContactPhone,
            memberNo:res.data.mstrDto.memberNo,
            carPlateNo:res.data.mstrDto.carPlateNo,
            vin:res.data.mstrDto.vin,
            carBrandName:res.data.mstrDto.carBrandName,
            carSeriesName:res.data.mstrDto.carSeriesName,
            carModelName:res.data.mstrDto.carModelName,
            carEngineeNo:res.data.mstrDto.carEngineeNo,
            carColorName:res.data.mstrDto.carColorName,
            carPowerTypeName:res.data.mstrDto.carPowerTypeName,
            fuelMeterScaleName:res.data.mstrDto.fuelMeterScaleName,
            estimatedCarDeliveryDate:res.data.mstrDto.estimatedCarDeliveryDate,
            bizTypeName:res.data.mstrDto.bizTypeName,
            oemOrderNo:res.data.mstrDto.oemOrderNo,
            workHourlyPrice:res.data.mstrDto.workHourlyPrice,
            scEmpName:res.data.mstrDto.scEmpName,
            precheckResult:res.data.mstrDto.precheckResult,
            repairAdvice:res.data.mstrDto.repairAdvice,
            cusTakeOldParts:res.data.mstrDto.cusTakeOldParts,
            carWash:res.data.mstrDto.carWash,
            carWait:res.data.mstrDto.carWait,
            cusRoadTestDrive:res.data.mstrDto.cusRoadTestDrive,
            cusDesc:res.data.mstrDto.cusDesc,
          },
          worksList:worksList,
          goodsList:goodsList,
          settlementDto:{
            totalAmount:res.data.settlementDto.totalAmount,
            workItemAmount:res.data.settlementDto.workItemAmount,
            goodsAmount:res.data.settlementDto.goodsAmount,
            receivableAmount:res.data.settlementDto.receivableAmount,
            payAmount:res.data.settlementDto.payAmount
          },
          worktotalnum:a,
          worktotalmoney:b,
          workTotalYmoney:c,
          goodsNUm:d,
          goodstotalmoney:e,
          goodsTotalYmoney:f
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
