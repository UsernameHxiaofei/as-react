import {createModel} from '@rematch/core'
import {Modal,Button, Form, Select,Table, Input, Row, Col, message,Pagination} from 'antd'
import {saveWorkLocationEmployee,getMdmOrgDepartmentMstr, getMdmDutyMstr, getStationLists,getEmployeeByWorkLocation,deleteWorkLocationEmployee,getTechnicianVo} from '@/services/getData'

const initState = Object.freeze({
  workList:[],
  Id:'',
  TabList:[],
  ids:[],
  deptList:[],
  addTeacher:[],
  totalNumber:0,
  teacherList:[],
  WZlist:[],
  addVisible:false,
  data:{
    index:1,
    pageSize:10,
    keyWord:'',
    deptId:'',
    dutyId:''
  },
  flag:true,
  spinning: false
})

export default createModel ({
  name: 'technicianStation',

  state: {
    ...initState
  },

  effects: {
    async GetStationList () { //查询工位
      const res = await getStationLists ()
      if (res.success) {
      let list = res.data
      list.map((item, index) => {
        item['key'] = index
      })
      this.SET_STATE({
        workList:list
      })
      // if (res.data[0].id) {
      //   this.GetEmployeeByWorkLocation(res.data[0].id)
      // }
      }
    },

    async GetEmployeeByWorkLocation (workLocationId) { //根据id查技师
      const res = await getEmployeeByWorkLocation ({workLocationId})
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          TabList:list,
          spinning:false,
        })
      }
    },

    async GetTechnicianVo (payload) { //所有的技师
      const res = await getTechnicianVo (payload)
      if (res.success) {
        let list = res.data.items
        list.map((item, index)  => {
          item['key'] = index
        })
        this.SET_STATE({
          teacherList:list,
          totalNumber:res.data.totalNumber,
          data:payload
        })
      }
    },


    async GetMdmOrgDepartmentMstr () { //部门
      const res = await getMdmOrgDepartmentMstr ()
      console.log(res)
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          deptList:list,
        })
      }
    },

    async GetMdmDutyMstr () { //职位
      const res = await getMdmDutyMstr ()
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          WZlist:list,
        })
      }
    },

    async DeleteWorkLocationEmployee (arr,id,workLocationId) { //删除
      console.log('workLocationId',workLocationId)
      const res = await deleteWorkLocationEmployee (arr)
      if (res.success) {
        message.success('删除成功')
        // 重新查询表格
        this.GetEmployeeByWorkLocation(workLocationId)
        this.SET_STATE({
          ids:[]
        })
      } else {
        message.error(res.msg)
      }
    },

    async SaveWorkLocationEmployee (obj,id,workLocationId) {
      const res = await saveWorkLocationEmployee (obj)
      if  (res.success) {
        message.success('添加成功')
        this.SET_STATE({
          addVisible:false,
          addTeacher:[],
          data:{
            index:1,
            pageSize:10,
            keyWord:'',
            deptId:'',
            dutyId:''
          }
        })
        // 重新查询表格
        this.GetEmployeeByWorkLocation(workLocationId)
      } else {
        // message.error(res.msg)
        let arr = res.msg.split(',')
        console.log(arr)
        arr.map((item, index) => {
            message.error(item)
        })
        this.SET_STATE({
          addVisible:false,
          addTeacher:[],
          data:{
            index:1,
            pageSize:10,
            keyWord:'',
            deptId:'',
            dutyId:''
          }
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
