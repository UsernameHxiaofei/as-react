import {createModel} from '@rematch/core'
import {Modal,Button, Form, Select,Table, Input, Row, Col, message,Pagination} from 'antd'
import {findListMdmWorkTeamNoPage,
        findListMdmWorkTeamEmployeeByWorkTeamId,
        getTechnicianVo,getMdmOrgDepartmentMstr,
        getMdmDutyMstr,
        batchSaveMdmWorkTeamEmployee,
        deleteListMdmWorkTeamEmployee} from '@/services/getData'

const initState = Object.freeze({
  classList:[],
  tabList:[],
  addVisible: false,
  data:{
    index:1,
    pageSize:10,
    keyWord:'',
    deptId:'',
    dutyId:''
  },
  Id:'',
  teacherList:[],
  totalNumber:0,
  deptList:[],
  WZlist:[],
  addTeacher:[],
  ids:'',
  flag:true,
  loading: false
})

export default createModel ({
  name: 'technicianTeam',

  state: {
    ...initState
  },

  effects: {

    async FindListMdmWorkTeamNoPage () {
      const res = await findListMdmWorkTeamNoPage ()
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          classList:list
        })
        // if (res.data[0].id) {
      //   this.FindListMdmWorkTeamEmployeeByWorkTeamId(res.data[0].id)
      // }
      }
    },

    async GetTechnicianVo (payload) {
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

    async GetMdmOrgDepartmentMstr () {
      const res = await getMdmOrgDepartmentMstr ()
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

    async getMdmDutyMstr () { //业务类型
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

    async FindListMdmWorkTeamEmployeeByWorkTeamId (workTeamId) { //根据id查技师
      const res = await findListMdmWorkTeamEmployeeByWorkTeamId ({workTeamId})
      if (res.success) {
        let list = res.data
        list.map((item, index) => {
          item['key'] = index
        })
        this.SET_STATE({
          tabList:list,
          loading: false
        })
      }
    },

    async BatchSaveMdmWorkTeamEmployee (obj,id, workTeamId) { //批量添加
      const res = await batchSaveMdmWorkTeamEmployee (obj)
      if  (res.success) {
        message.success('添加技师成功')
        this.SET_STATE({
          addVisible:false,
          addTeacher:[],
          data:{
            index:1,
            pageSize:10,
            keyWord:'',
            deptId:'',
            dutyId:''
          },
        })
        this.FindListMdmWorkTeamEmployeeByWorkTeamId(workTeamId)
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
          },
        })
      }
    },

    async DeleteListMdmWorkTeamEmployee (ids,id, workTeamId) { // 批量删除
      const res = await deleteListMdmWorkTeamEmployee (ids)
      if (res.success) {
        message.success('删除成功')
        // 查询
        this.FindListMdmWorkTeamEmployeeByWorkTeamId(workTeamId)
        this.SET_STATE({
          ids:[]
        })
      } else {
        message.error(res.msg)
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
