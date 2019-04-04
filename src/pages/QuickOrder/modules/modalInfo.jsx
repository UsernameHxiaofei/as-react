import { createModel } from '@rematch/core'
import { DelErrorMsg } from '../common/components';
import {
  getGlobalMdmRegion,
  getAppointmentOrder,
  queryComboGoodsForPage,
  queryGroupGoodsForPage,
  getDicDataByCategoryCode,
  queryWorkItemPage,
  queryFastProductForPage,
  querySettlementGoodsInventory,
  listCustomer,
  workOrderIsExistByAppointmentId,
} from '@/services/getData'
import { message } from 'antd';

// 初始化数据
const initState = Object.freeze({
  addVisible: false,
  saveLoading: false,
  queryLoading: false,
  cusUpdateVisible: false,
  carUpdateVisible: false,
  historyVisible: false,
  cusUpdateLoading: false,
  comboVisible: false,
  groupVisible: false,
  workVisible: false,
  goodsVisible: false,
  calculateVisible: false,
  calculateLoading: false,
  stockVisible: false,
  appointmentVisible: false,
  cusUpdateFlag: 'save', // 客户更新 save是新建 edit是编辑
  threeLevelValue: [{ label: "", value: "" }], // 三级联动默认值
  workModalDataSource: [], // 工项弹窗数据
  goodModalDataSource: [], // 商品弹窗数据
  stockDataSource: [], // 库存不足弹窗数据
  appointmentData: [], // 预约弹窗数据
  repairPersonData: [], // 预约人
  addCarSave: { // 新增车辆保存的数据
    synchronousOwners: false, // 是否同步车主:true同步,false:不同步
    customerInfoDto: '', // 车主信息
    linkCustomerInfoDto: '', // 联系人信息
    carInfoDto: '', // 车辆信息
  },
  cusTypeNama: 0, // 0个人 1企业
  customerInfoDto: {  // 车主信息
    cusTypeId: '', // 客户类型ID,
    cusTypeCode: '', // 客户类型Code,
    cusTypeName: '', // 客户类型名称,
    cusName: '', // 客户姓名,
    cusGenderId: '', // 客户性别ID,
    cusGenderName: '', // 客户性别名称,
    cusMobileNo: '', // 联系电话,
    cusProvinceId: '', // 客户所在省份ID,
    cusProvinceName: '', // 客户所在省份名称,
    cusCityId: '', // 客户所在城市ID,
    cusCityName: '', // 客户所在城市名称,
    cusRegionId: '', // 客户所在区ID,
    cusRegionName: '', // 客户所在区名称,
    cusStreetAddress: '', // 客户所在街道地址,
    cusCertificateNo: '', // 组织架构代码
  },
  linkCustomerInfoDto: { // 联系人信息
    cusName: '', // 客户姓名,
    cusGenderId: '', // 客户性别ID,
    cusGenderName: '', // 客户性别名称,
    cusMobileNo: '', // 联系电话,
    cusProvinceId: '', // 客户所在省份ID,
    cusProvinceName: '', // 客户所在省份名称,
    cusCityId: '', // 客户所在城市ID,
    cusCityName: '', // 客户所在城市名称,
    cusRegionId: '', // 客户所在区ID,
    cusRegionName: '', // 客户所在区名称,
    cusStreetAddress: '', // 客户所在街道地址
  },
  carInfoDto: {  // 车辆信息
    vin: '', // 车架号,
    carId: '', // 车辆id,
    carPlateTypeId: '080eac26ffe74e3693739a03d4d2b9a2', // 车牌号类型ID,
    carPlateTypeCode: '10450003', // 车牌号类型编码,
    carPlateTypeName: '苏', // 车牌号类型名称,
    carPlateNo: '', // 车牌号,
    carBrandId: '', // 品牌ID,
    carBrandName: '', // 品牌名称,
    carSeriesId: '', // 车系ID,
    carSeriesName: '', // 车系名称,
    carCategoryId: '', //车款id
    carCategoryName: '', //车款名称
    carModelId: '', // 车型ID,
    carModelName: '', // 车型名称,
    carPowerTypeId: '', // 车辆动力类型ID,
    carPowerTypeCode: '', // 车辆动力类型编码,
    carPowerTypeName: '', // 车辆动力类型名称,
    carUsageId: '', // 车辆用途ID,
    carUsageCode: '', // 车辆用途编码,
    carUsageName: '', // 车辆用途名称,
    insBranchId: '', // 保险分公司ID,
    insBranchName: '', // 保险分公司名称,
    insEndDate: '', // 保险到期日期,
    qaEndDate: '', // 质保到期日期,
    qaEndMileage: '', // 质保到期里程
  },
  cusProvince: [], // 省
  cusCity: [], // 市
  cusRegion: [], // 区
  cusManCity: [], // 联系人市
  cusManRegion: [], // 联系人区
  insBranch: [], // 保险公司
  threeflag: 0,
  CarModelVoList: [], // 车型
  cusUpdateInfo: { // 更新客户
    id: '', // 客户id
    cusName: '', // 客户姓名
    cusMobileNo: '', // 客户联系电话
    cusProvinceId: '', // 省份id
    cusProvinceName: '', // 省份名
    cusCityId: '', // 市id
    cusCityName: '', // 市名
    cusRegionId: '', // 区/县id
    cusRegionName: '', // 区/县名
    cusStreetAddress: '', // 客户详细地址
  },
  carUpdateInfo: { // 更新车辆
    cusId: '', // 车主id
    cusName: '', // 车主姓名
    cusMobileNo: '', // 车主联系电话
    cusCarInfoFastlyDto: [], // 车主对应的车辆信息
  },
  historyFastlyInfo: [], // 历史信息
  comboObj: {
    index: 1,
    pageSize: 10,
    comboName: '',
    carModelId: '',
  },
  comboTabledData: [], //tabledData
  comboPageTotal: 0,
  worksPageTotal: 0,
  groupPageTotal: 0,
  groupObj: {
    carModelId: '',
    groupGoodsId: '',
    priceTypeCode: '',
    workHourlyPrice: '',
    name: ''
  },
  pagetotal: 0, // 总条数
  pagecurrent: 1, // 当前页
  comboNumber: '1', //number
  goodsLists: [],
  worksLists: [],
  infoData: [],
  priceLists: [], //价格方案
  groupSettleType: '',
  groupSettleCode: '',
  groupSettleId: '',
  groupList: {
    carModelId: '',
    groupName: '',
    index: 1,
    pageSize: 10,
  },
  groupDataSource: [],
  worksSettleType: '',
  worksSettleCode: '',
  worksSettleId: '',
  list: {
    repairCarModelId: '',
    keyWord: '',
    workHourlyPrice: '',
    page: 1,
    pageSize: 10,
  },
  workModalTable: [],
  goodsSettleWay: '',
  goodsSettleCode: '',
  goodsSettleId: '',
  goodsObj: {
    index: 1,
    pageSize: 10,
    goodsName: '',
    carModelId: '',
    priceTypeCode: '35400000', // 给个默认值
    matchSeries: 0,
    isZeroStock: 0,
  },
  goodList: [],
  tabledList: {
    key: '0',
    goodsNo: '',
    // index: 0,
    workHoursNum: 1,
    id: '', // 主键ID,
    goodsId: '', // 商品ID,
    goodsNo: '', // 商品编码,
    goodsName: '', // 商品名称,
    goodsTypeId: '', // 商品类型ID,
    goodsTypeCode: '', // 商品类型编码,
    goodsTypeName: '', // 商品类型名称（材料 or 施工）,
    bizTypeId: '', // 业务类型ID,
    bizTypeCode: '', // 业务类型编码,
    bizTypeName: '', // 业务类型名称,
    settleTypeId: '', // 结算方式ID,
    settleTypeCode: '', // 结算方式编码,
    settleTypeName: '', // 结算方式名称,
    price: '', // 单价,
    qty: 1, // 数量,
    amount: '', // 金额,
    discountRate: '', // 折扣率,
    receivableAmount: '', // 应收金额,
    technicianEmpId: '', // 技师员工ID (施工),
    technicianEmpName: '', // 技师员工姓名 (施工),
    issuedQty: 0, // 已发料数量 (材料)
  },
  queryAppointmentOrderVO: { //预约列表参数
    appointmentOrder: '', //预约单号,
    vin: '', //vin码,
    plate: '', //车牌号,
    repairPersonId: '', //预约人id,
    repairMobile: '', //预约电话
  },
  appointmentObj: { //预约人
    "index": 1,
    "pageSize": 1000,
    "keyWord": "",
    "cusTypeId": "",
    "cusTypeName": "",
    "cusFroms": [
      {
        "cusFromId": "",
        "cusFromName": ""
      }
    ],
    "bizTags": [
      {
        "tagName": "",
        "tagId": ""
      }
    ]
  },
  appointState: '', //auto是通过人车关系调客户预约接口
  radioCheckedOption: {
    appointmentNo: '', //预约人单号
    id: '', //预约人id
  },
})
export default createModel({
  name: 'modalInfo',

  state: {
    ...initState,
  },
  effects: {
    async modalReset(payload) {
      const { resolve, reject } = payload;
      this.MODAL_SET_STATE(payload);
      resolve()
    },
    // 省市区
    async getGlobalMdmRegion(obj, props, type) {
      const res = await getGlobalMdmRegion({ parentNo: obj })
      this.MODAL_SET_STATE({ queryLoading: true, });
      if (res.success) {
        if (res.data.length > 0) {
          const list = res.data.map((item, i) => {
            item.key = item.regionNo;
            item.code = item.regionNo;
            item.name = item.regionName;
            return item;
          });
          this.MODAL_SET_STATE({ [type]: list });
        }
      } else {
        message.error(res.msg);
      }
      this.MODAL_SET_STATE({ queryLoading: false });
    },
    // 保险公司
    async querySupplierTypeByID() {
      this.MODAL_SET_STATE({
        insBranch: [],
      });
      const res = await querySupplierTypeByID({ tagId: 30000015 });
      if (res.success) {
        if (res.data) {
          const list = res.data.map((item, i) => {
            item.key = item.cusId;
            // item.code = item.cusId;
            // item.name = item.cusName;
            return item;
          });
          this.MODAL_SET_STATE({ insBranch: list });
        }
      }
    },

    // 获取预约列表
    async getAppointmentOrder(params, props, resolve) {
      const QueryAppointmentOrderVO = params || props.modalInfo.queryAppointmentOrderVO;
      const appointState = props.modalInfo.appointState;
      this.MODAL_SET_STATE({ queryLoading: true });
      const res = await getAppointmentOrder(QueryAppointmentOrderVO);
      // console.log(appointState, props, res);
      if (res.success && res.code == 200) {
        this.MODAL_SET_STATE({ queryLoading: false });
        if (appointState == 'auto' && res.data.length == 0) { //通过人车关系查询
          this.MODAL_SET_STATE({
            queryAppointmentOrderVO: {
              ...props.modalInfo.queryAppointmentOrderVO,
              appointmentOrder: '', //预约单号,
              vin: '', //vin码,
              plate: '', //车牌号,
              repairMobile: '', //预约电话
            },
          })
        } else { //点击预约按钮查询
          const list = res.data.map((item, index) => {
            item.key = item.id;
            return item;
          })
          this.MODAL_SET_STATE({
            appointmentVisible: true,
            appointmentData: list
          })
        }
      } else {
        message.error(res.msg)
      }
      this.MODAL_SET_STATE({ queryLoading: false, appointState: '' });
      if (resolve) resolve();
    },

    async searchTable(obj) {
      queryComboGoodsForPage(obj).then((res) => {
        if (res.success) {
          const comboTabledData = res.data.items.map((item, index) => {
            item.key = index + Math.random;
            return item;
          });
          this.MODAL_SET_STATE({
            comboTabledData,
            comboPageTotal: res.data.totalNumber,
          });
        }
      });
    },
    // 价格方案
    async getDicDataByCategoryCode() {
      const res = await getDicDataByCategoryCode({ code: '3540' });
      if (res.success) {
        const list = res.data.map((item, index) => {
          item.key = index;
          return item;
        });
        this.MODAL_SET_STATE({ priceLists: list, });
      }
    },
    // 组合列表
    async QueryGroupGoodsForPage(data) {
      queryGroupGoodsForPage(data).then((res) => {
        if (res.success) {
          const groupDataSource = res.data.items.map((item, index) => {
            item.key = index;
            return item;
          });
          this.MODAL_SET_STATE({
            groupDataSource,
            groupPageTotal: res.data.totalNumber,
          });
        }
      });
    },
    // 工时列表
    async QueryWorkItemPage(data) {
      const res = await queryWorkItemPage(data);
      if (res.success) {
        const workModalTable = res.data.items.map((item, index) => {
          item.key = index;
          return item;
        });
        this.MODAL_SET_STATE({
          workModalTable,
          worksPageTotal: res.data.totalNumber,
        });
      } else {
        message.error(res.msg)
      }
    },
    // 商品列表
    async QueryFastProductForPage(data) {
      const res = await queryFastProductForPage(data);
      // console.log(res)
      if (res.success) {
        const goodList = res.data.items.map((item, index) => {
          item.key = index;
          return item;
        });
        this.MODAL_SET_STATE({
          goodList: goodList,
          worksPageTotal: res.data.totalNumber,
        });
      } else {
        message.error(res.msg)
      }
    },

    // 自动发料查库存
    async querySettlementGoodsInventory(param) {
      const res = await querySettlementGoodsInventory(param);
      if (res.success && res.data.length > 0) {  // 库存不足
        res.data.map((item, index) => {
          item.key = item.goodsId + index;
        });
        this.MODAL_SET_STATE({ stockVisible: true, stockDataSource: res.data });
      } else if (res.success && res.code == 200 && res.data.length == 0) {  // 正常结算
        this.MODAL_SET_STATE({ calculateVisible: true, queryLoading: true });
      } else {
        DelErrorMsg(res.msg);
        this.MODAL_SET_STATE({ queryLoading: false })
      }
    },
    /* 预约人 */
    async listCustomer(param, props) {
      this.MODAL_SET_STATE({ queryLoading: true })
      const params = param || props.modalInfo.appointmentObj;
      const res = await listCustomer(params);
      if (res.success && res.code == 200) {
        res.data.items.forEach((item, index) => {
          item.key = item.cusId;
          item.text = item.cusName + '-' + item.cusTelephoneNo;
        });
        this.MODAL_SET_STATE({ repairPersonData: res.data.items });
      } else {
        DelErrorMsg(res.msg);
      }
      this.MODAL_SET_STATE({ queryLoading: false })
    },
    /* 预约单反查 */
    async checkAppointment(param, props) {
      this.MODAL_SET_STATE({ queryLoading: true })
      const appointmentOrderId = props.modalInfo.radioCheckedOption.id;
      const res = await workOrderIsExistByAppointmentId({ appointmentOrderId });
      if (res.success && res.code == 200) {
        message.success('添加成功！');
        this.MODAL_SET_STATE({ appointmentVisible: false })
      } else {
        DelErrorMsg(res.msg);
      }
      this.MODAL_SET_STATE({ queryLoading: false })
    },

  },
  reducers: {
    MODAL_RESET_STATE(state, payload) {
      return { ...initState }
    },
    MODAL_SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})