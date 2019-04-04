
import  {createModel} from '@rematch/core'
import {getBasValueByBasCategoryNo,getDicDataByCategoryCode,findMdmWorkTeamAndLocationByEmpId,findListMdmWorkTeamEmployee,listWorkProcessOrder,getStationList,findListMdmWorkTeamNoPage,getHrEmpMstrByOrgId,getTechnicianVo, findListMdmWorkTeamEmployeeByWorkTeamId} from '@/services/getData'
const initState = Object.freeze({
  data: {
    procNo:"", //施工单号,
    woNO : "", //工单号,
    crtDateStart : '',// 开单日期
    crtDateEnd:'', //开单结束日期
    carPlateNo: '', // 车牌号
    vin:'', //VIN码
    procStatusCode:'', //施工单状态码
    bizTypeCode:'', //业务类型
    pageSize:10, //每页的记录页
    currentIndex:1, //当前页
  },
  Time:[],
  SGVisible:false, //派工
  YSVisible: false, //验收
  CKVisible: false, //查看
  DYVisible: false, //打印
  CXVisible: false, //撤销
  stateList:[],
  yewuList:[],
  TabList:[],
  totalNumber:0,
  spin:true,
  id:'',
  // 查看的字段
  lookObj:{
    procNo:'',
    procStatusName:'',
    createEmpName:'',
    createDate:'',
    cusName:'',
    carPlateNo:'', //车牌号
    vin:'',
    carModelName:'',
    memberNo:'',
    woNo:'',
    cusDesc:'',
    repairAdvice:'',
    precheckResult:'',
    totalWorkHour :'',
    estimatedCarDeliveryDate:'',
    estimateFinishDate:''
  },
  lookList:[],
  result:[],
  type: '', //撤销类型
  procNo:'',
  carPlateNo :'',
  vin:'',
  workList:[], //工位数据
  classList:[], //班组列表
  workVlaue:'',
  classVlue:'',
  YSdata:{
    procId:'',
    checkResultId :'4e1996aea03c4e639d6b28d80eeb9138',
    checkResultCode :'71750000',
    checkResultName :'首验合格',
    checkRemark :'',
    checkEmpId :'',
    checkEmpName:''
  },
  peoperList:[],
  PGobj:{ //派工的请求参数
    procId:'',
    estimateFinishDate:''
  },
  dispatchingItems:[],
  Obj:{
    workProcessOrderDetId:'',
    workLocationId: "",
    workLocationNo: "",
    workLocationName: "",
    workTeamId: "",
    workTeamNo: "",
    workTeamName:"",
    workTechnicianId:"",
    workTechnicianNo: "",
    workTechnicianName: "",
    workHour: ""
  },
  object:{},
  name:'',
  ID:'',
  list:[],
})



export default createModel ({
  name: 'constructionordermanagement',

  state: {
    ...initState
  },

  effects: {
    async GetDicDataByCategoryCode(code) {
      const res = await getDicDataByCategoryCode({code})
      if (res.success) {
        if (code == '7175') {
          this.SET_STATE({
            result:res.data
          })
        }
        if (code == '7165') {
          this.SET_STATE({
            stateList:res.data
          })
        }
        // if (code == '7140') {
        //   this.SET_STATE({
        //     yewuList :res.data
        //   })
        // }
      }
    },


    async GetBasValueByBasCategoryNo(categoryNo) {
      const res = await getBasValueByBasCategoryNo({categoryNo})
        if (categoryNo == 'AS1000') {
          this.SET_STATE({
            yewuList :res.data
          })
        }
      },





    async ListWorkProcessOrder(payload) {
      const  res = await listWorkProcessOrder (payload)
      if (res.success) {
        let list = res.data.items
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          TabList:list,
          totalNumber:res.data.totalNumber,
          data:payload,
          spin:false
        })
      }
    },

    // 工位下拉选择
    async GetStationList () {
      const res = await getStationList()
      if (res.success) {
        let list =  res.data
        list.map((item,index) => {
          item['key'] = index
        })
        this.SET_STATE({
          workList: list
        })
      }
    },

async GetHrEmpMstrByOrgId () {
const res = await getHrEmpMstrByOrgId ()
if (res.success) {
  let list = res.data
  list.map((item, index) => {
    item['key'] = index
  })
  this.SET_STATE({
    list
  })
}
},




  // async GetTechnicianVo (obj) { //技师下拉
  //     const res = await getTechnicianVo(obj)
  //   if (res.success) {
  //     res.data.items.map((item, index) => {
  //       item['key'] = index
  //     })
  //     this.SET_STATE({
  //       peoperList:res.data.items
  //     })
  //   }
  // },




  async FindListMdmWorkTeamEmployee () { //技师的下拉选择
      const res = await findListMdmWorkTeamEmployee ()
      if (res.success) {
        let list = res.data
        list.map((item,index) => {
          item['key'] = index
        })
        this.SET_STATE({
          peoperList:list
        })
      }
  },

  async FindListMdmWorkTeamEmployeeByWorkTeamId (workTeamId) {
    const res = await findListMdmWorkTeamEmployeeByWorkTeamId ({workTeamId})
    if (res.success) {
      let list = res.data
      list.map((item, index) => {
        item['key'] = index
      })
      this.SET_STATE({
        peoperList:list
      })
    }
  },

    // 班组下拉选择
    async FindListMdmWorkTeamNoPage () {
      const res = await findListMdmWorkTeamNoPage()
      if (res.success) {
        let list = res.data
        list.map((item,index) => {
          item['key'] = index
        })
        this.SET_STATE({
          classList:list
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
