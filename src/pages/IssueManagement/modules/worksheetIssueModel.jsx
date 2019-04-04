import { createModel } from '@rematch/core'
import { getTotal, getChekedTotal } from '../common/components'
import { env } from '@/config/env/'
const { REDIRECTION_URL: { WorksheetIssue }, HOST } = env
import {
  getWoMaterialInfo, queryFastProduct, getDicDataByCategoryCode, queryWorkSetting,
  queryFastProductForPage, getHrEmpMstrByOrgId, saveWorkOrderMaterial, woMaterialDelivery,
  getBasValueByBasCategoryNo, findIssuedWarehouseByGoodsDet
} from '@/services/getData'
import { message } from 'antd';
// 初始化数据
const initState = Object.freeze({
  issuseLoading: false,
  fetching: false,
  materialVisible: false,
  materialLoading: false,
  saveLoading: false,
  outLoading: false,
  defaultTypeValue: {}, //售后系统设置
  WoMaterialInfoVO: {
    woId: '', //: 工单Id,
    sendingMaterialId: '', // 发料单Id,
    sendingMaterialNo: '', // 发料单号,
    woNo: '', //: 工单号,
    carPlateNo: '', // 车牌号,
    vin: '', // 车架号,
    cusName: '', // 客户姓名,
    scEmplyoeesName: '', // 服务接待,
    carBrandId: '', // 品牌ID,
    carBrandName: '', // 品牌名称,
    carSeriesId: '', // 车系ID,
    carSeriesName: '', // 车系名称,
    carModelId: '', //: 车型ID,
    carModelName: '', // 车型名称,
    createDate: '', // 创建时间,
  }, //工单基本信息
  woIsId: '', //判断发料单是否保存的id
  workItemInfos: [], //工单明细(施工-工项)
  woMaterialVOs: [], //工单明细(材料-商品)
  selectedRowKeys: [], //材料选中行id集合
  dropDownTable: [], //材料下拉框
  workBizType: [], //业务类型
  priceWay: [], //价格方案
  settleType: [], //结算方式
  materialModalArr: [], //材料列表
  materialsArr: [], //出库列表
  materialsOutArr: [], //出库提交列表
  scEmp: [], //领料人
  issuedArr: [], //无需发料的材料
  data: { //查询材料参数
    index: 1,
    pageSize: 10,
    isZeroStock: 0, //展示零库存(0:不展示;1:展示)
    matchSeries: 0, //匹配车型(0:不匹配;1:匹配)
    priceTypeCode: '35400000', //价格方案
    carModelId: '', //车型细分ID
    goodsName: '', //商品名称
    type: 'issued',
  },
  materialNumber: 1, //弹窗中的默认数量
  materialListPage: {}, //列表页码
  paidWay: { //结算方式
    settleTypeId: '', // 结算方式ID,
    settleTypeCode: '', // 结算方式编码,
    settleTypeName: '', // 结算方式名称,
  },
  materialDto: { //保存要提交的数据
    woId: '',// 工单ID <必传>,
    issuerName: '', // 领料人,
    goods: [], // 材料明细
  },
  issuerId: '', // 领料人id,
  outWarehourseTotal: 0, //本次出库合计
  preWarehourseTotal: 0, //本次实际出库合计
  woId: '', //工单id
  outSuc: false,
})

export default createModel({
  name: 'WorksheetIssueCreate',

  state: {
    ...initState,
  },
  // 异步修改数据
  effects: {
    // 获取发料明细
    async getWoMaterialInfo(id, props) {
      const { WoMaterialInfoVO, materialDto, data } = props.WorksheetIssueCreate;
      this.SET_STATE({ issuseLoading: true })
      const res = await getWoMaterialInfo({ woId: id, sendingMaterial: true });
      if (res.success) {
        if (res.data) {
          const datas = res.data;
          const workItems = datas.workItemInfos.map((item, index) => {
            item.key = item.id + index;
            item.sortNum = ++index;
            return item;
          })
          datas.woMaterialVOs.forEach((item, index) => {
            item.key = item.materialId + index;
            item.sortNum = ++index;
            item.notIssuedQty = item.qty - item.issuedQty;
            item.goodsId = item.materialId; //材料id
            item.goodsNo = item.materialNo; //材料编码
            item.goodsName = item.materialName; //材料名称 
            item.preIssuedQty = 1; //本次发料数量 
            item.checked = false;
          })
          const woMaterials = datas.woMaterialVOs.filter(item => item.goodsIssueNeeded == 1); //需要发料的
          const issuesArr = datas.woMaterialVOs.filter(item => item.goodsIssueNeeded != 1); //不需要发料的
          woMaterials.forEach((item, index) => item.sortNum = ++index)
          this.SET_STATE({
            woIsId: datas.woId, //: 工单Id,
            WoMaterialInfoVO: {
              ...WoMaterialInfoVO,
              woId: datas.woId, //: 工单Id,
              sendingMaterialId: datas.sendingMaterialId, // 发料单Id,
              sendingMaterialNo: datas.sendingMaterialNo, // 发料单号,
              woNo: datas.woNo, //: 工单号,
              carPlateNo: datas.carPlateNo, // 车牌号,
              vin: datas.vin, // 车架号,
              cusName: datas.cusName, // 客户姓名,
              scEmplyoeesName: datas.scEmplyoeesName, // 服务接待,
              carBrandId: datas.carBrandId, // 品牌ID,
              carBrandName: datas.carBrandName, // 品牌名称,
              carSeriesId: datas.carSeriesId, // 车系ID,
              carSeriesName: datas.carSeriesName, // 车系名称,
              carModelId: datas.carModelId, //: 车型ID,
              carModelName: datas.carModelName, // 车型名称,
              createDate: datas.createDate, // 创建时间,
            },
            data: {
              ...data,
              carModelId: datas.carModelId, //: 车型ID,
            },
            materialDto: {
              ...materialDto,
              woId: datas.woId
            },
            issuedArr: issuesArr, //存放不需要发料的材料，保存时需要提交给后台
            workItemInfos: workItems, //工项
            woMaterialVOs: woMaterials, //材料
          })
          const newSearchConditions = { ...data, carModelId: datas.carModelId };
          this.queryFastProductForPage(newSearchConditions);
        }
        this.SET_STATE({ issuseLoading: false })
      } else {
        this.SET_STATE({ issuseLoading: false })
        return message.error(res.msg)
      }
    },
    // 材料搜索下拉框
    async materialsSearch(value) {
      if (value == '') return false;
      this.SET_STATE({ dropDownTable: [], fetching: true });
      const res = await queryFastProduct({ goodsName: value, type: 'issued', })
      if (res.success) {
        this.SET_STATE({ fetching: false });
        if (res.data) {
          const list = res.data.map((item, index) => {
            item.key = item.goodsId + index;
            item.id = item.goodsId;
            return item;
          });
          this.SET_STATE({ dropDownTable: list });
        }
      }
    },
    // 调用数据字典
    async getDicDataesByCategoryCode(params, props, arrName, ) {
      this.SET_STATE({
        [arrName]: [],
      });
      const res = await getDicDataByCategoryCode(params)
      if (res.success && res.data) {
        const list = res.data.map((item, i) => {
          item.key = item.id;
          return item;
        });
        this.SET_STATE({ [arrName]: list, });
      }
    },

    // 调用基础数值
    async getBasValueByBasCategoryNo(params, props, arrName, ) {
      this.SET_STATE({
        [arrName]: [],
      });
      const res = await getBasValueByBasCategoryNo(params)
      if (res.success && res.data) {
        const list = res.data.map((item, i) => {
          item.key = item.id;
          return item;
        });
        this.SET_STATE({ [arrName]: list, });
      }
    },

    // 领料人
    async getHrEmpMstrByOrgId() {
      const res = await getHrEmpMstrByOrgId();
      if (res.success) {
        if (res.data) {
          const list = [];
          res.data.map((item, i) => {
            item.key = item.empId;
            list.push(item);
          });
          this.SET_STATE({ scEmp: res.data });
        }
      }
    },
    // 售后系统设置的业务类型和结算方式
    async queryWorkSetting() {
      const res = await queryWorkSetting();
      if (res.success && res.data) {
        this.SET_STATE({
          defaultTypeValue: {
            defaultWorkTypeId: res.data.defaultWorkTypeId, // 默认维修类型id,
            defaultWorkTypeNo: res.data.defaultWorkTypeNo, // 默认维修类型编码,
            defaultWorkType: res.data.defaultWorkTypeName, // 默认维修类型,
            defaultPayWayId: res.data.defaultPayWayId, // 默认结算方式id,
            defaultPayWayNo: res.data.defaultPayWayNo, // 默认结算方式编码,
            defaultPayWay: res.data.defaultPayWayName, // 默认结算方式,
          },
          paidWay: {
            settleTypeId: res.data.defaultPayWayId, // 结算方式ID,
            settleTypeCode: res.data.defaultPayWayNo, // 结算方式编码,
            settleTypeName: res.data.defaultPayWayName, // 结算方式名称,
          }
        });
      }
    },
    // 查询材料
    async queryFastProductForPage(obj, props) {
      this.SET_STATE({ materialLoading: true })
      const param = obj || props.WorksheetIssueCreate.data;
      const res = await queryFastProductForPage(param);
      if (res.success) {
        // console.log(res)
        const list = res.data.items.map((item, index) => {
          item.key = item.goodsId + index;
          return item;
        });
        this.SET_STATE({
          materialModalArr: list,
          materialLoading: false,
          materialListPage: {
            currentIndex: res.data.currentIndex,
            totalNumber: res.data.totalNumber,
          }
        })
      }
    },
    // 保存工单发料
    async saveWorkOrderMaterial(a, props) {
      const { materialDto, woMaterialVOs, issuedArr } = props.WorksheetIssueCreate;
      if (woMaterialVOs.length == 0) {
        return message.error('请添加材料！');
      }
      this.SET_STATE({ saveLoading: true })
      let params = {
        woId: materialDto.woId,// 工单ID <必传>,
        issuerName: materialDto.issuerName, // 领料人,
        goods: [...woMaterialVOs, ...issuedArr], // 材料明细
      }
      const res = await saveWorkOrderMaterial(params);
      const keysArr = []; //选中id的集合
      // console.log(res)
      if (res.success) {
        if (res.data) {
          res.data.forEach((item, index) => {
            item.key = item.id;
            // item.sortNum = ++index;
            item.materialNo = item.goodsNo;
            item.materialName = item.goodsName;
            if (item.checked) keysArr.push(item.id)
          });
          const list = res.data.filter(item => item.goodsIssueNeeded == 1)
          const issuedsArr = res.data.filter(item => item.goodsIssueNeeded != 1)
          list.forEach((item, index) => item.sortNum = ++index)
          this.SET_STATE({
            woMaterialVOs: list, //材料
            woIsId: materialDto.woId,
            saveLoading: false,
            outWarehourseTotal: getChekedTotal(list, 'preIssuedQty'),
            selectedRowKeys: keysArr,
            issuedArr: issuedsArr,
          })
          message.success('保存成功！');
        }
      } else {
        this.SET_STATE({ saveLoading: false, })
        return message.error(res.msg)
      }
    },
    // 出库查看
    async findIssuedWarehouseByGoodsDet(materialsArr, props) {
      const IssuedGoodsDetList = {
        queryIssuedGoodsDetDTOList: materialsArr
      }
      const res = await findIssuedWarehouseByGoodsDet(IssuedGoodsDetList);
      // console.log(materialsArr, res);
      if (res.success) {
        if (res.data) {
          const list = res.data.map((item, index) => {
            item.key = item.id + index;
            item.sortNum = ++index;
            return item;
          });
          this.SET_STATE({
            materialsArr: list,
            preWarehourseTotal: getTotal(res.data, 'preIssuedQty')
          })
        }
      } else {
        return message.error(res.msg)
      }
    },

    // 保存发料出库
    async woMaterialDelivery(a, props) {
      const { materialDto, materialsOutArr, issuerId, materialsArr } = props.WorksheetIssueCreate;
      if (materialsOutArr.length == 0 || materialsArr.length == 0) {
        this.SET_STATE({ outSuc: true })
        return message.error('库存不足，请重新添加材料！');
      }
      this.SET_STATE({ outLoading: true })
      let params = {
        woId: materialDto.woId,// 工单ID <必传>,
        deliveryUserId: issuerId, // 发货人Id,
        deliveryUserName: materialDto.issuerName, // 发货人姓名,
        materialDeliveryVOs: materialsOutArr, // 材料明细
      }
      const res = await woMaterialDelivery(params);
      if (res.success && res.data) {
        this.SET_STATE({ outLoading: false, outSuc: true })
        message.success('出库成功！');
      } else {
        this.SET_STATE({ outLoading: false, })
        return message.error(res.msg)
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
