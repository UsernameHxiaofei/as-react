import { createModel } from '@rematch/core'
import { getTotal, getChekedTotal } from '../common/methods'
import { env } from '@/config/env/'
import {

} from '@/services/getData'
import { message } from 'antd';
// 接口
import {
  listMdmWorkHourPrice,
  getHrEmpMstrByOrgId,
} from '@/services/getData'
// 初始化数据
const initState = Object.freeze({
  workHourlyPrice: [], // 工时单价
  scEmp: [], // 服务接待
})
export default createModel({
  name: 'searchForm',

  state: {
    ...initState,
  },
  effects: {
    // 工时单价
    async listMdmWorkHourPrice() {
      this.FORM_SET_STATE({
        workHourlyPrice: [],
      });
      const res = await listMdmWorkHourPrice({ pageSize: 100, currentIndex: 1 })
      if (res.success && res.data) {
        const list = res.data.items.map(item => {
          item.key = item.mdmWorkHourPriceId;
          return item;
        })
        this.FORM_SET_STATE({ workHourlyPrice: list });
      }
    },

    // 服务接待
    async getHrEmpMstrByOrgId() {
      this.FORM_SET_STATE({
        scEmp: [],
      });
      const res = await getHrEmpMstrByOrgId()
      if (res.success && res.data) {
        const list =res.data.map(item=>{
          item.key = item.empId;
          return item;
        })
        this.FORM_SET_STATE({ scEmp: list });
      }
    },
  },
  reducers: {
    FORM_RESET_STATE(state, payload) {
      return { ...initState }
    },
    FORM_SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})