
import {createModel} from '@rematch/core'
import {findListMdmWorkTeamByPage,deleteMdmWorkTeam} from '@/services/getData'
import {Modal,Button, Form, Select, Input, Row, Col, message} from 'antd'
const initState = Object.freeze({
  ADDVisible:false,
  DELVisible: false,
  SCVisible: false,
  data:{
    currentIndex:1,
    pageSize:10
  },
  totalNumber:0,
  tabList:[],
  id:'',
  AddData:{
    id:'',
    workTeamNo :'',
    workTeamName :'',
    isEnabled:''
  }
})

export default createModel ({
  name: 'team',

  state: {
    ...initState
  },

  effects: {
    async FindListMdmWorkTeamByPage (payload) {
      const res = await findListMdmWorkTeamByPage (payload)
      if (res.success) {
        let list = res.data.items
        list.map((item, index)  => {
          item['key'] = index
        })
        this.SET_STATE({
          tabList:list,
          totalNumber:res.data.totalNumber,
          data:payload
        })
      }
    },

    // 根据id删除
    async DeleteMdmWorkTeam (id) {
      console.log(id)
      const res = await deleteMdmWorkTeam({id})
      if (res.success) {
        this.FindListMdmWorkTeamByPage({ currentIndex:1,pageSize:10})
        this.SET_STATE({
          SCVisible: false
        })
        message.success('删除成功')
      } else {
        message,error('删除失败')
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
