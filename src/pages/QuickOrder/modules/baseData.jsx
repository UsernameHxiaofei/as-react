import { createModel } from '@rematch/core'
import {
  getDicDataByCategoryCode,
  getBasValueByBasCategoryNo,
} from '@/services/getData'
// 初始化数据
const initState = Object.freeze({
  listLoading: false,
  fuelMeterScale: [], // 油表
  workBizType: [], // 工单的业务类型
  settleType: [], // 结算方式
  scEmp: [], // 服务接待
  goodsArr: [], //万能工项商品
  cusType: [], // 客户类型
  carPre: [], // 车牌前缀
  cusGender: [], // 性别
  carPowerType: [], // 动力类型
  carUsage: [], // 用途
})
export default createModel({
  name: 'baseData',

  state: {
    ...initState,
  },
  effects: {
    async baseReset(payload, props) {
      const { resolve, reject } = payload;
      this.SET_STATE(payload);
      resolve()
    },
    // 调用数据字典
    async getDicDataesByCategoryCode(params, props, arrName, ) {
      this.SET_STATE({
        [arrName]: [],
        listLoading: true,
      });
      const res = await getDicDataByCategoryCode(params)
      if (res.success && res.data) {
        const list = res.data.map((item, i) => {
          item.key = item.id;
          // item.code = item.dicCode;
          // item.name = item.dicValue;
          return item;
        });
        this.SET_STATE({ [arrName]: list, listLoading: false, });
      } else {
        this.SET_STATE({ listLoading: false, })
      }
    },

    // 调用基础数值接口
    async getBasValueByBasCategoryNo(params, props, arrName) {
      this.SET_STATE({
        [arrName]: [],
        listLoading: true,
      })
      const res = await getBasValueByBasCategoryNo(params);
      if (res.success) {
        if (res.data) {
          const list = res.data.map((item, i) => {
            item.key = item.id;
            // item.code = item.basCode;
            // item.name = item.basText;
            return item;
          });
          this.SET_STATE({ [arrName]: list, listLoading: false, })
        }
      } else {
        this.SET_STATE({ listLoading: false, })
      }
    },

    // 服务接待
    async getHrEmpMstrByOrgId() {
      this.SET_STATE({
        scEmp: [],
        listLoading: true,
      });
      const res = await getHrEmpMstrByOrgId();
      if (res.success) {
        if (res.data) {
          const list = res.data.map((item, i) => {
            item.key = item.empId;
            // item.code = item.empNo;
            // item.name = item.empName;
            return item;
          });
          this.SET_STATE({ scEmp: list, listLoading: false, });
        }
      } else {
        this.SET_STATE({ listLoading: false, })
      }
    },
  },
  reducers: {
    RESET_STATE(state, payload) {
      return { ...initState }
    },
    SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})