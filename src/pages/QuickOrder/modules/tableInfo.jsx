import { createModel } from '@rematch/core'
import { env } from '@/config/env/'
import * as _ from 'lodash';
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import { DelErrorMsg } from '../common/components';
import {
  saveWorkOrder,
  queryWorkSetting,
  queryWorkOrder,
  queryWorkOrderNoPage,
  convertWorkProcessOrder,
  finishWorkOrder,
  queryWorkItemPage,
} from '@/services/getData'
import { message } from 'antd';
import {
  getTotal, getReceiveTotal, getNoComboTotal,
  decimalsCut, getSelectedItemsInfo, calculateTable
} from '../common/methods';
// 初始化数据
const initState = Object.freeze({
  tableLoading: false,
  editId: '',
  orderType: '', //复制工单copy 编辑工单editEo  估计单转工单 copy
  isId: '', //判断工单是否保存过
  workHoursDataSource: [  // 工时列表
    {
      key: '0',
      goodsNo: '',
      index: 0,
      workHoursNum: 1,
    },
  ],
  goodsDataSource: [ // 商品列表
    {
      key: '0',
      goodsNo: '',
      index: 0,
      workHoursNum: 1,
    },
  ],
  selectedWorkRowKeys: [], // 工项选中行id除去搜索项
  selectedGoodsRowKeys: [], // 商品选中行id
  dropDownWorkHoursTable: [], // 工时模糊查询下拉框
  dropDownGoodsTable: [], // 商品模糊查询下拉框
  selectedWorkHoursRowKeys: [], // 工项选中行id
  selectedGoodsRowKeys: [], // 商品选中行id
  selectedComboRowKeys: [], // 工项和商品的套餐id
  workModalDataSource: [], // 工项弹窗数据
  goodModalDataSource: [], // 商品弹窗数据
  fetching: false,
  fetchs: false,
  submitLoading: false,
  workHoursTotalMoney: 0, // 工时金额总计
  workHoursReceiveMoney: 0, // 工时应收金额总计
  workHoursTotalNum: 0, // 工时数量合计
  goodsTotalMoney: 0, // 商品金额总计
  goodsReceiveMoney: 0, // 商品应收金额总计
  goodsTotalNum: 0, // 商品数量合计
  decimalCount: 2, //小数点位数
  workHourdisaounts: 0, // 工时优惠价格
  isBatch: '', // 是否是折扣率批量  改变的是列表输入框的哪个值
  cusAndCarInfo: { // 主页面保存时提交的数据
    carModelId: '',
    id: '', // 主键ID,
    woNo: '', // 工单号
    workOrderType: 1, // 工单类型(1.维修工单 2.装潢工单 3.前装工单) 
    eoId: '', //估价单id
    woCreatorEmpId: '', // 制单人ID,
    woCreatorEmpName: '', // 制单人姓名,
    woCreateDate: '', // 工单创建时间,
    woStatusId: '', // 工单状态ID,
    woStatusCode: '70200000', // 工单状态编码,
    woStatusName: '新建', // 工单状态名称,
    cusId: '', // 客户ID,
    cusNo: '', // 客户编码,
    cusName: '', // 客户姓名,
    cusContactPhone: '', // 客户联系电话（手机号或座机号）,
    memberId: '', // 会员ID,
    memberNo: '', // 会员编码,
    carId: '', // 车辆ID,
    vin: '', // 车架号,
    fuelMeterScaleId: '', // 油表信息ID,
    fuelMeterScaleCode: '', // 油表信息编码,
    fuelMeterScaleName: '', // 油表信息名称,
    estimatedCarDeliveryDate: '', // 预计交车时间,
    carSenderName: '', // 送修人姓名,
    carSenderPhone: '', // 送修人电话,
    inStoreMileage: '', // 进店里程,
    scEmpId: '', // 服务接待员工ID,
    scEmpName: '', // 服务接待员工姓名,
    bizTypeId: '', // 业务类型ID,
    bizTypeCode: '', // 业务类型编码,
    bizTypeName: '', // 业务类型名称,
    oemOrderNo: '', // 厂商单号,
    workHourlyPrice: '', // 工时单价,
    cusDesc: '', // 客户描述,
    precheckResult: '', // 预检结果,
    repairAdvice: '', // 维修建议,
    cusTakeOldParts: 0, // 客户带走旧件(1-是, 0-否),
    carWash: 0, // 车辆洗车(1-是, 0-否),
    cusWait: 0, // 客户等待(1-是, 0-否),
    cusRoadTestDrive: 0, // 客户路试(1-是, 0-否)
    totalAmount: '0', // 总金额 <必传>,
    goodsAmount: '0', // 商品金额 <必传>,
    workItemAmount: '0', // 施工金额 <必传>,
    receivableAmount: '0', // 应收金额 <必传>,
    payAmount: '0', // 付费金额 <必传>
    carPlateNo: '', // 车牌号
    carModelId: '', // 车型id
    carModelName: '', // 车型名称
    carEngineeNo: '', // 发动机号,
    carColorId: '', // 车身色ID
    carInnerColorId: '', // 内饰色ID
    carColor: '', // 车身色名称,
    carPowerTypeId: '', // 车辆动力类型ID,
    carPowerTypeCode: '', // 车辆动力类型编码,
    carPowerTypeName: '', // 车辆动力类型名称,
    appointmentOrderNo: '', // 预约单号
    appointmentOrderId: '', // 预约单号id
  },
  settlementDto: {
    totalAmount: '', // 总金额,
    goodsAmount: '', // 商品金额,
    workItemAmount: '', // 施工金额,
    receivableAmount: '', // 应收金额,
    payType: '', // 付费方式(客户付费, 厂家付费, 店内付费),
    payAmount: '', // 付费金额,
    cusPayAmount: '', // 客户付费金额,
    maLingAmount: '', // 抹零金额
    oldMaLingAmount: '', // 原抹零金额
  },
  defaultTypeValue: { // 默认工时类型
    defaultWorkTypeId: '', // 默认维修类型id,
    defaultWorkTypeNo: '', // 默认维修类型编码,
    defaultWorkType: '', // 默认维修类型,
    defaultPayWayId: '', // 默认结算方式id,
    defaultPayWayNo: '', // 默认结算方式编码,
    defaultPayWay: '', // 默认结算方式,
    isAutoGoods: '10000005', //是否自动发料 是-10000000,  否-10000005
  },
  firstCarId: '',
  appointSaveState: false, //编辑页是否保存过，如果保存过则无法更改预约单号
})
export default createModel({
  name: 'tableInfo',

  state: {
    ...initState,
  },
  effects: {
    async tableReset(payload, props) {
      const { resolve, reject } = payload;
      this.TABLE_SET_STATE(payload);
      resolve()
    },

    async calculateTotal(dataSourceType, props, notJump) {
      const { workHourdisaounts, isBatch, } = props.tableInfo;
      const notJumpPage = notJump || 2; //1跳转 2非跳转
      const DataSource = _.cloneDeep(props.tableInfo[dataSourceType]);
      // 找到非套餐的金额和
      const totalAmount = Number(getNoComboTotal(DataSource, 'amount')); // 金额总计
      const workHoursDataLength = DataSource.length - 2;
      let workHoursPreReceive = 0; // 数据源的n-1项非套餐应收金额总和
      if (totalAmount < workHourdisaounts) { //优惠金额大于总金额
        message.error('套餐无法优惠，请输入小于非套餐的金额')
      }
      if (notJumpPage === 2) { //跳转页面时不需要计算表格内金额
        DataSource.forEach((item, index) => {
          item.price = item.price || 0; // 单价
          const unitPrice = Number(item.price) || 0; // 单价
          const qty = Number(item.qty) || 0; // 数量
          const unitAmount = unitPrice * qty; // 金额
          item.amount = decimalsCut({ number: unitAmount });
          let discountRow; //rowqty rowDiscountRate rowreceivableAmount discountRate receivableAmount
          if (totalAmount < workHourdisaounts) { //优惠金额大于总金额
            item.receivableAmount = item.amount;
            item.discountRate = 1.00;
            item.reduceAmount = 0;
          } else {
            if ((isBatch == 'rowdiscountRate' || isBatch == 'discountRate' || isBatch == 'rowqty') && !item.comboGoodsId) {
              //折扣率、数量  套餐不可修改应收金额、折扣率
              item.discountRate = item.discountRate;
              item.receivableAmount = decimalsCut({ number: unitPrice * qty * item.discountRate });
            } else if (isBatch == 'rowreceivableAmount' && item.amount != 0) { //明细的优惠金额
              item.discountRate = decimalsCut({ number: item.receivableAmount / item.amount });
              item.receivableAmount = item.receivableAmount;
            } else if (isBatch == 'receivableAmount' && item.amount != 0 && workHourdisaounts != 0 && !item.comboGoodsId) {
              //批量的优惠金额 套餐不可修改应收金额、折扣率
              // debugger
              /*  当前金额 100  总金额600 优惠金额50
                  应收金额 = 100-(100/600)*50 
              */
              discountRow = accMul(decimalsCut({ number: item.amount / totalAmount }), workHourdisaounts);//优惠金额
              item.receivableAmount = accSub(item.amount, discountRow);
              item.discountRate = decimalsCut({ number: item.receivableAmount / item.amount });
            } else if (isBatch == 'receivableAmount' && workHourdisaounts == 0) { //批量的优惠金额0
              item.receivableAmount = item.amount;
              item.discountRate = 1.00;
            } else if (isBatch == 'noRowChange') {
              // 保存后接口返回的数据不用计算
            } else {
              item.receivableAmount = decimalsCut({ number: unitPrice * qty * item.discountRate });
            }
            item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
            // 最后一行不是套餐、万能工项
            if (index == workHoursDataLength && item.index != 0 && item.amount != 0 && isBatch == 'receivableAmount' && !item.comboGoodsId) {
              // 只有输入优惠总金额 最后一行非套餐的数据才进行减法
              item.receivableAmount = Number(accSub(accSub(totalAmount, workHourdisaounts), workHoursPreReceive));
              item.discountRate = decimalsCut({ number: item.receivableAmount / item.amount });
              item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
            } else if (!item.comboGoodsId) {
              // 把非套餐的应收金额加起来
              workHoursPreReceive = accAdd(workHoursPreReceive, decimalsCut({ number: item.receivableAmount }));
            }
          }
        });
      }
      // console.log('DataSource',isBatch, DataSource)
      const { TotalMoney, ReceiveMoney, ReduceMoney, TotalNum } = getSelectedItemsInfo(DataSource); // 计算选中行总数
      if (dataSourceType == 'workHoursDataSource') {
        this.TABLE_SET_STATE({
          workHourdisaounts: 0,
          isBatch: 'noRowChange',
          workHoursTotalMoney: TotalMoney,
          workHoursReceiveMoney: ReceiveMoney,
          workHoursReduce: ReduceMoney,
          workHoursTotalNum: TotalNum,
          workHoursDataSource: DataSource,
        })
      } else if (dataSourceType == 'goodsDataSource') {
        this.TABLE_SET_STATE({
          workHourdisaounts: 0,
          isBatch: 'noRowChange',
          goodsTotalMoney: TotalMoney,
          goodsReceiveMoney: ReceiveMoney,
          goodsReduce: ReduceMoney,
          goodsTotalNum: TotalNum,
          goodsDataSource: DataSource,
        })
      }
      this.calculateBottomTotal();
    },

    async calculateBottomTotal(a, props) {
      let { workHoursDataSource, goodsDataSource, cusAndCarInfo } = props.tableInfo;
      this.TABLE_SET_STATE({
        cusAndCarInfo: {
          ...cusAndCarInfo,
          totalAmount: accAdd(getTotal(workHoursDataSource, 'amount'), getTotal(goodsDataSource, 'amount')), // 总金额
          goodsAmount: getTotal(goodsDataSource, 'amount'), // 商品金额
          workItemAmount: getTotal(workHoursDataSource, 'amount'), // 施工金额
          receivableAmount: accAdd(getTotal(workHoursDataSource, 'receivableAmount'), getTotal(goodsDataSource, 'receivableAmount')), // 应收金额
          payAmount: accAdd(getReceiveTotal(workHoursDataSource, 'receivableAmount'), getReceiveTotal(goodsDataSource, 'receivableAmount')), // 付费金额
        },
      })
    },
    // 第一次添加工时，拿到默认的业务类型和结算方式
    async queryWorkSetting(a, props) {
      const { defaultTypeValue, cusAndCarInfo } = props.tableInfo;
      const res = await queryWorkSetting();
      if (res.success) {
        if (res.data) {
          this.TABLE_SET_STATE({
            defaultTypeValue: {
              ...defaultTypeValue,
              defaultWorkTypeId: res.data.defaultWorkTypeId, // 默认维修类型id,
              defaultWorkTypeNo: res.data.defaultWorkTypeNo, // 默认维修类型编码,
              defaultWorkType: res.data.defaultWorkTypeName, // 默认维修类型,
              defaultPayWayId: res.data.defaultPayWayId, // 默认结算方式id,
              defaultPayWayNo: res.data.defaultPayWayNo, // 默认结算方式编码,
              defaultPayWay: res.data.defaultPayWayName, // 默认结算方式,
              isAutoGoods: res.data.isAutoGoods, //是否自动发料 是-10000000,  否-10000005
            },
            cusAndCarInfo: {
              ...cusAndCarInfo,
              bizTypeId: res.data.defaultWorkTypeId, // 默认维修类型id,
              bizTypeCode: res.data.defaultWorkTypeNo, // 默认维修类型编码,
              bizTypeName: res.data.defaultWorkTypeName, // 默认维修类型,
            },
          });
        } else {
          this.TABLE_SET_STATE({
            defaultTypeValue: {
              ...defaultTypeValue,
              defaultWorkTypeId: '', // 默认维修类型id,
              defaultWorkTypeNo: '', // 默认维修类型编码,
              defaultWorkType: '', // 默认维修类型,
              defaultPayWayId: '', // 默认结算方式id,
              defaultPayWayNo: '', // 默认结算方式编码,
              defaultPayWay: '', // 默认结算方式,
            },
          });
        }
      } else {
        DelErrorMsg(res.msg);
      }
    },

    // 工时列表
    async getWorkItemPage(data) {
      const res = await queryWorkItemPage(data);
      if (res.success) {
        if (res.data) {
          const list = res.data.items.map((item, index) => {
            item.key = item.goodsId + index;
            item.goodsUnit = '';
            return item;
          });
          this.TABLE_SET_STATE({ dropDownWorkHoursTable: list });
        }
      } else {
        DelErrorMsg(res.msg);
      }
      this.TABLE_SET_STATE({ fetching: false });
    },
    // 保存工单
    async saveWorkOrder(SaveWorkOrdeVo, props) {
      const oldCusAndCarInfo = props.tableInfo.cusAndCarInfo;
      const res = await saveWorkOrder(SaveWorkOrdeVo);
      if (res.success) {
        // console.log('res', res.data)
        message.success('保存成功');
        this.TABLE_SET_STATE({
          submitLoading: false,
          isId: res.data,
          selectedWorkHoursRowKeys: [],
          cusAndCarInfo: { ...oldCusAndCarInfo, id: res.data, eoId: '' },
        });
        this.seeQueryWorkOrder(res.data);
      } else {
        DelErrorMsg(res.msg);
        this.TABLE_SET_STATE({ isId: '', submitLoading: false, })
      }
    },

    // 工单查看
    async seeQueryWorkOrder(id, props) {
      const _th = this;
      const { cusAndCarInfo, workHoursDataSource, orderType, settlementDto } = _.cloneDeep(props.tableInfo);
      const eoId = cusAndCarInfo.eoId;
      // 工单查看接口  估价单查看接口
      const apiPage = eoId == '' ? true : false;
      const apiName = apiPage ? queryWorkOrder : queryWorkOrderNoPage;
      const workParam = {
        woId: id, // 工单id
        page: 1,
        pageSize: 1000,
      };
      const eoParam = { eoId: eoId }
      const obj = apiPage ? workParam : eoParam;
      // 判断勾选行是否先保存过了
      const selectedFlag = workHoursDataSource.some(item => {
        return item.id == '';
      })
      if (selectedFlag) { this.TABLE_SET_STATE({ selectedWorkRowKeys: [] }) }
      apiName(obj).then((res) => {
        if (res.success) {
          const mstrDto = apiPage ? res.data.mstrDto : res.data.mstrVO;
          const workItemArr = apiPage ? res.data.workItemDtos.items : res.data.listWorkItemVO;
          const goodsItemArr = apiPage ? res.data.goodsDtos.items : res.data.listGoodsVO;
          const settlement = apiPage ? res.data.settlementDto : res.data.settlementVO;
          // 是复制工单（copy）还是编辑工单 （editEo）
          const jumpTypeFlag = orderType == 'copy' ? true : false;
          const [workFront, workLast, goodFront, goodLast] = [[], [], [], []];
          // 将套餐和万能工项放到列表前面，方便计算金额
          workItemArr.forEach(item => {
            if (item.comboGoodsId || item.goodsNo == 99999999) workFront.push(item);
            else workLast.push(item);
          })
          goodsItemArr.forEach(item => {
            if (item.comboGoodsId) goodFront.push(item);
            else goodLast.push(item);
          })
          const workItemDtos = [...workFront, ...workLast]
          const goodsDtos = [...goodFront, ...goodLast]
          workItemDtos.map((item, index) => {
            item.key = apiPage ? item.id : index;
            item.workHoursNum = index + 1;
            if (item.comboGoodsId) item.combo = 2;// 非套餐1 套餐2
            else item.combo = 1;
            if (jumpTypeFlag) item.inWorkProcessQty = 0; //复制工单可以删除施工中工项
          });
          workItemDtos.push({ index: 0, workHoursNum: workItemDtos.length + 1, key: Math.random() });
          goodsDtos.map((item, index) => {
            item.key = apiPage ? item.id : index;
            item.workHoursNum = index + 1;
            if (item.comboGoodsId) item.combo = 2;// 非套餐1 套餐2
            else item.combo = 1;
            if (jumpTypeFlag) { item.issuedQty = 0; } //复制工单发料数量为0
          });
          goodsDtos.push({ index: 0, workHoursNum: goodsDtos.length + 1 });
          new Promise((resolve, reject) => {
            this.tableReset({
              orderType: orderType == 'editEo' ? 'editEo' : '',
              cusAndCarInfo: {
                ...cusAndCarInfo,
                id: jumpTypeFlag ? '' : (apiPage ? mstrDto.id : ''), // 主键ID,
                woNo: jumpTypeFlag ? '' : mstrDto.woNo, // 工单号
                woCreatorEmpId: apiPage ? mstrDto.woCreatorEmpId : mstrDto.eoCreatorEmpId, // 制单人ID,
                woCreatorEmpName: apiPage ? mstrDto.woCreatorEmpName : mstrDto.eoCreatorEmpName, // 制单人姓名,
                woCreateDate: jumpTypeFlag ? null : mstrDto.woCreateDate, // 工单创建时间,
                woStatusId: jumpTypeFlag ? '' : mstrDto.woStatusId, // 工单状态ID,
                woStatusCode: jumpTypeFlag ? '70200000' : mstrDto.woStatusCode, // 工单状态编码,
                woStatusName: jumpTypeFlag ? '新建' : mstrDto.woStatusName, // 工单状态名称,
                cusId: mstrDto.cusId, // 客户ID,
                cusNo: mstrDto.cusNo, // 客户编码,
                cusName: mstrDto.cusName, // 客户姓名,
                cusContactPhone: mstrDto.cusContactPhone, // 客户联系电话（手机号或座机号）,
                memberId: mstrDto.memberId, // 会员ID,
                memberNo: mstrDto.memberNo, // 会员编码,
                carId: mstrDto.carId, // 车辆ID,
                vin: mstrDto.vin, // 车架号,
                fuelMeterScaleId: mstrDto.fuelMeterScaleId, // 油表信息ID,
                fuelMeterScaleCode: mstrDto.fuelMeterScaleCode, // 油表信息编码,
                fuelMeterScaleName: mstrDto.fuelMeterScaleName, // 油表信息名称,
                estimatedCarDeliveryDate: mstrDto.estimatedCarDeliveryDate, // 预计交车时间,
                carSenderName: mstrDto.carSenderName, // 送修人姓名,
                carSenderPhone: mstrDto.carSenderPhone, // 送修人电话,
                inStoreMileage: mstrDto.inStoreMileage, // 进店里程,
                scEmpId: mstrDto.scEmpId, // 服务接待员工ID,
                scEmpName: mstrDto.scEmpName, // 服务接待员工姓名,
                bizTypeId: mstrDto.bizTypeId, // 业务类型ID,
                bizTypeCode: mstrDto.bizTypeCode, // 业务类型编码,
                bizTypeName: mstrDto.bizTypeName, // 业务类型名称,
                oemOrderNo: mstrDto.oemOrderNo, // 厂商单号,
                workHourlyPrice: mstrDto.workHourlyPrice, // 工时单价,
                appointmentOrderNo: jumpTypeFlag ? '' : mstrDto.appointmentOrderNo, // 预约单号,
                appointmentOrderId: jumpTypeFlag ? '' : mstrDto.appointmentOrderId, // 预约单号id,
                cusDesc: mstrDto.cusDesc, // 客户描述,
                precheckResult: mstrDto.precheckResult, // 预检结果,
                repairAdvice: mstrDto.repairAdvice, // 维修建议,
                cusTakeOldParts: mstrDto.cusTakeOldParts, // 客户带走旧件(1-是, 0-否),
                carWash: mstrDto.carWash, // 车辆洗车(1-是, 0-否),
                cusWait: mstrDto.cusWait, // 客户等待(1-是, 0-否),
                cusRoadTestDrive: mstrDto.cusRoadTestDrive, // 客户路试(1-是, 0-否)
                totalAmount: apiPage ? mstrDto.totalAmount : mstrDto.amount, // 总金额 <必传>,
                goodsAmount: apiPage ? mstrDto.goodsAmount : mstrDto.materialAmount, // 商品金额 <必传>,
                workItemAmount: mstrDto.workItemAmount, // 施工金额 <必传>,
                receivableAmount: mstrDto.receivableAmount, // 应收金额 <必传>,
                payAmount: mstrDto.payAmount, // 付费金额 <必传>
                carPlateNo: mstrDto.carPlateNo, // 车牌号
                carModelId: mstrDto.carModelId, // 车型id
                carEngineeNo: mstrDto.carEngineeNo, // 发动机号,
                carColor: mstrDto.carColorName, // 车身色名称,
                carPowerTypeName: mstrDto.carPowerTypeName, // 车辆动力类型名称,
                carModelName: mstrDto.carModelName, // 车型名称：品牌 车系 车型
                // carModelName: mstrDto.carBrandName + ' ' + mstrDto.carSeriesName + ' ' + mstrDto.carModelName, // 车型名称：品牌 车系 车型
              },
              workModalDataSource: workItemDtos.filter(item => item.index != 0),
              goodModalDataSource: goodsDtos.filter(item => item.index != 0),
              workHoursDataSource: workItemDtos,
              goodsDataSource: goodsDtos,
              settlementDto: {
                ...settlementDto,
                totalAmount: settlement.totalAmount, // 总金额,
                goodsAmount: settlement.goodsAmount, // 商品金额,
                workItemAmount: settlement.workItemAmount, // 施工金额,
                receivableAmount: settlement.receivableAmount, // 应收金额,
                payType: settlement.payType, // 付费方式(客户付费, 厂家付费, 店内付费),
                payAmount: settlement.payAmount, // 付费金额,
                cusPayAmount: settlement.payAmount, // 付费金额,
                maLingAmount: settlement.maLingAmount, // 抹零金额
                oldMaLingAmount: settlement.maLingAmount, // 原抹零金额
              },
              tableLoading: false,
              appointSaveState: mstrDto.appointmentOrderNo == '' ? false : true,
              resolve, reject
            })
          }).then(() => {
            // 调用方法计算
            _th.calculateTotal('workHoursDataSource', 1);
            _th.calculateTotal('goodsDataSource', 1);
          })
        } else {
          DelErrorMsg(res.msg);
        }
      });
    },

    //  工单转施工单
    async convertWorkProcessOrder(params, props) {
      const res = await convertWorkProcessOrder(params);
      if (res.success && res.code == 200) {
        this.seeQueryWorkOrder(props.tableInfo.cusAndCarInfo.id);
        return message.success('转施工单成功！')
      } else {
        DelErrorMsg(res.msg);
      }
    },

    // 工单完工
    async finishWorkOrder(a, props) {
      const { cusAndCarInfo } = props.tableInfo;
      const res = await finishWorkOrder({ woId: cusAndCarInfo.id });
      if (res.success && res.code == 200) {
        this.seeQueryWorkOrder(cusAndCarInfo.id);
        return message.success('工单完工成功！')
      } else {
        message.error(res.msg);
      }
    },

  },
  reducers: {
    TABLE_RESET_STATE(state, payload) {
      return { ...initState }
    },
    TABLE_SET_STATE(state, payload) {
      Object.keys(payload).forEach((key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})