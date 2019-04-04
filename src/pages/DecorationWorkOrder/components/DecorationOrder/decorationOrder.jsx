/*
 create By wwj 2018-11-01
 */
import React, { Component } from 'react';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import styled, { ThemeProvider, consolidateStreamedStyles } from 'styled-components';
// import NestedTable from './NestedTable '
import SoCarModelsSelect from '@/components/SoCarSelect';
import {
  queryWorkOrderNoPage,
  getDicDataByCategoryCode,
  listMdmWorkHourPrice,
  getHrEmpMstrByOrgId,
  saveCustomerCar,
  getGlobalMdmRegion,
  getCarModelVo,
  querySupplierTypeByID,
  findCustomerById,
  updateCustomerById,
  findCusCarInfoFastlyByCusId,
  listWorkOrderHistoryFastlyByCusId,
  findCusLinkCarInfoByCusIdAndVin,
  updateCustomerCar,
  queryWorkItem,
  queryWorkSetting,
  queryComboGoodsForPage,
  queryComboGoodsDet,
  queryWorkItemPage,
  queryFastProduct,
  queryGroupGoodsForPage,
  queryGroupGoodsDet,
  queryFastProductForPage,
  queryWorkOrder,
  getCarInfoBykeywords,
  settlementConfirm,
  saveWorkOrder,
  queryUnifiedSocialCreditCode,
  getPersonalCustomerByMobileNo,
  querySettlementGoodsInventory,
  convertWorkProcessOrder,
  finishWorkOrder,
  getBasValueByBasCategoryNo,
} from '@/services/getData';
import {
  Table,
  Divider,
  Select,
  Modal,
  Spin,
  LocaleProvider,
  DatePicker,
  message,
  InputNumber,
  Pagination,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Checkbox,
  Popconfirm,
  showQuickJumper,
  Anchor,
  Cascader,
  Radio,
} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { PersonAndCar } from '@/components/Common';
import { EditableTable, SelectTableMenu } from '@/components/BlksEditableTable';
import * as _ from 'lodash';
import { env } from '@/config/env/';
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式

const {
  REDIRECTION_URL: { QuickOrder, MaintenanceHistory },
  HOST,
} = env;
moment.locale('zh-cn');
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const Root = styled.div`
  padding-top: 40px;
  padding: 0;
  .sou_tit {
    margin-right: 10px;
  }
  .textRight {
    text-align: right;
  }
  .textLeft {
    text-align: left;
  }
  .marginBottom {
    margin-bottom: 3px;
  }
  .baragin-form {
    padding-left: 10px;
    padding-right: 10px;
  }
  .pr20 {
    padding-right: 20px;
  }
  .mr20 {
    margin-right: 20px;
  }
  .mb16 {
    margin-bottom: 16px;
  }
  .ant-form-item {
    margin-bottom: 8px;
  }
  .footer-toolbar {
    width: 260px;
    margin: 0 auto;
  }
  .antd-pro-footer-toolbar-toolbar .antd-pro-footer-toolbar-right {
    float: none;
  }
`;

const getTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0) {
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);
const getReceiveTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0 && item.settleTypeCode == '70050000') { //计算客户付费
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);
const getComboTotal = (arr, key) =>
  arr.reduce((sum, item) => {
    if (item[key] && item.index != 0 && !item.comboGoodsId) { //计算非套餐
      return accAdd(sum, Number(item[key]));
    }
    return sum;
  }, 0);
const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 16 },
  },
};
class DecorationOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queryLoading: false,
      listLoading: false,
      addVisible: false,
      addLoading: false,
      saveLoading: false,
      cusUpdateVisible: false,
      cusUpdateLoading: false,
      historyVisible: false,
      submitLoading: false,
      calculateVisible: false,
      calculateLoading: false,
      stockVisible: false,
      pageSize: 10,
      cusUpdateFlag: 'save', // 客户更新 save是新建 edit是编辑
      fetching: false,
      fetchs: false,
      selectedWorkHoursRowKeys: [], // 工项选中行id
      selectedWorkRowKeys: [], // 工项选中行id除去搜索项
      selectedGoodsRowKeys: [], // 商品选中行id
      workHoursTotalMoney: 0, // 工时金额总计
      workHoursReceiveMoney: 0, // 工时应收金额总计
      workHoursTotalNum: 0, // 工时数量合计
      goodsTotalMoney: 0, // 商品金额总计
      goodsReceiveMoney: 0, // 商品应收金额总计
      goodsTotalNum: 0, // 商品数量合计
      decimalCount: 2,
      provinceOptions: [],
      dropDownWorkHoursTable: [], // 工时模糊查询下拉框
      dropDownGoodsTable: [], // 商品模糊查询下拉框
      fuelMeterScale: [], // 油表
      bizType: [], // 业务类型
      workBizType: [], // 工单的业务类型
      settleType: [], // 结算方式
      scEmp: [], // 服务接待
      workHourlyPrice: [], // 工时单价
      cusType: [], // 客户类型
      cusGender: [], // 性别
      cusProvince: [], // 省
      cusCity: [], // 市
      cusRegion: [], // 区
      cusManCity: [], // 联系人市
      cusManRegion: [], // 联系人区
      carUsage: [], // 用途
      carPowerType: [], // 动力类型
      insBranch: [], // 保险公司
      CarModelVoList: [], // 车型
      threeflag: 0,
      carColorList: [], // 车身色
      carInnerColorList: [], // 内饰色
      carPre: [], // 车牌前缀
      threeLevelValue: [{ label: "", value: "" }], // 三级联动默认值
      workModalDataSource: [], // 工项弹窗数据
      goodModalDataSource: [], // 商品弹窗数据
      stockDataSource: [], // 库存不足弹窗数据
      selectedComboRowKeys: [], // 工项和商品的套餐id
      cusAndCarInfo: {
        // 主页面保存时提交的数据
        carModelId: '',
        id: '', // 主键ID,
        woNo: '', // 工单号
        workOrderType: 2, // 工单类型(1.维修工单 2.装潢工单 3.前装工单)
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
      },
      workHoursDataSource: [
        // 工时列表
        {
          key: '0',
          goodsNo: '',
          index: 0,
          workHoursNum: 1,
        },
      ],
      goodsDataSource: [
        // 商品列表
        {
          key: '0',
          goodsNo: '',
          index: 0,
          workHoursNum: 1,
        },
      ],
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
      addCarSave: {
        // 新增车辆保存的数据
        synchronousOwners: false, // 是否同步车主:true同步,false:不同步
        customerInfoDto: '', // 车主信息
        linkCustomerInfoDto: '', // 联系人信息
        carInfoDto: '', // 车辆信息
      },
      cusTypeNama: 0, // 0个人 1企业
      customerInfoDto: {
        // 车主信息
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
      linkCustomerInfoDto: {
        // 联系人信息
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
      carInfoDto: {
        // 车辆信息
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
      cusUpdateInfo: {
        // 更新客户
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
      carUpdateInfo: {
        // 更新车辆
        cusId: '', // 车主id
        cusName: '', // 车主姓名
        cusMobileNo: '', // 车主联系电话
        cusCarInfoFastlyDto: [], // 车主对应的车辆信息
      },
      historyFastlyInfo: [], // 历史信息
      defaultTypeValue: {
        // 默认工时类型
        defaultWorkTypeId: '', // 默认维修类型id,
        defaultWorkTypeNo: '', // 默认维修类型编码,
        defaultWorkType: '', // 默认维修类型,
        defaultPayWayId: '', // 默认结算方式id,
        defaultPayWayNo: '', // 默认结算方式编码,
        defaultPayWay: '', // 默认结算方式,
        isAutoGoods: '10000005', //是否自动发料 是-10000000,  否-10000005
      },
      workHourdisaounts: 0, // 工时优惠价格
      isBatch: '', // 是否是折扣率批量  改变的是列表输入框的哪个值

      //hjf start\
      goodsObj: {
        index: 1,
        pageSize: 10,
        goodsName: '',
        carModelId: '',
        priceTypeCode: '35400000', // 给个默认值
        matchSeries: 0,
        isZeroStock: 0,
      },
      worksSettleType: '',
      worksSettleCode: '',
      worksSettleId: '',
      goodsSettleWay: '',
      goodsSettleCode: '',
      goodsSettleId: '',
      groupSettleType: '',
      groupSettleCode: '',
      groupSettleId: '',
      goodList: [],
      worksModalList: [],
      goodsModalList: [],
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
      priceLists: [],
      groupDataSource: [],
      editId: '',
      orderType: '', //判断是不是复制工单 /* ---- */
      carInfoId: '',
      comboVisible: false,
      workVisible: false,
      groupVisible: false,
      goodsVisible: false,
      // TCvalue:'',
      number: '1',
      obj: {
        index: 1,
        pageSize: 10,
        comboName: '',
        carModelId: '',
      },
      pagetotal: 0, // 总条数数
      pagecurrent: 1, // 当前页
      tabledData: [],
      infoData: [],
      list: {
        repairCarModelId: '',
        keyWord: '',
        workHourlyPrice: '',
        page: 1,
        pageSize: 10,
      },
      workModalTable: [],
      groupList: {
        carModelId: '',
        groupName: '',
        index: 1,
        pageSize: 10,
      },
      tabledList: {
        key: '0',
        goodsNo: '',
        index: 0,
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
        qty: '', // 数量,
        amount: '', // 金额,
        discountRate: '', // 折扣率,
        receivableAmount: '', // 应收金额,
        technicianEmpId: '', // 技师员工ID (施工),
        technicianEmpName: '', // 技师员工姓名 (施工),
        issuedQty: 0, // 已发料数量 (材料)
      },
      goodsLists: [],
      worksLists: [],
      expandedRowKeys: [],
      jy: false,
      wnwokr: [],
      printVisible: false

      // hjf end
    };
  }

  componentDidMount = () => {
    // 只在组件渲染完后调用
    getDicDataByCategoryCode({ code: '9999' }).then(res => {
      if (res.success) {
        this.setState({
          wnwokr: res.data
        })
      }
    })
    // this.seeQueryWorkOrder('527e6173581445c8b5eabff9dc77de6b')/* ---- */
    const _th = this;
    const cusAndCarInfo = _th.state.cusAndCarInfo;
    // 跳转页面的逻辑
    // window.addEventListener('message', (e) => {
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     _th.setState({
    //       editId: data.id,
    //       orderType: data.type,
    //       jy: data.jy || false,
    //       cusAndCarInfo: Object.assign({}, cusAndCarInfo, { eoId: data.eoId || '' })
    //     }, () => {
    //       // 其他页面跳转过来渲染页面
    //       _th.seeQueryWorkOrder(_th.state.editId);
    //     });
    //   }
    // });

    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        _th.setState({
          editId: data.id,
          orderType: data.type,
          jy: data.jy || false,
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, { eoId: data.eoId || '' })
        }, () => {
          // 其他页面跳转过来渲染页面
          _th.seeQueryWorkOrder(_th.state.editId);
        });
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          _th.setState({
            editId: data.id,
            orderType: data.type,
            jy: data.jy || false,
            cusAndCarInfo: Object.assign({}, cusAndCarInfo, { eoId: data.eoId || '' })
          }, () => {
            // 其他页面跳转过来渲染页面
            _th.seeQueryWorkOrder(_th.state.editId);
          });
        }
      });
    }


    if (localStorage.getItem('loginInfo')) {
      const _data = JSON.parse(localStorage.getItem('loginInfo')).login;
      _th.setState({
        cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
          woCreatorEmpName: _data.empName || '',
        }),
      });
      _th.getQueryDicValue(); // 调用基础数据
      _th.getGlobalMdmRegion('', 'cusProvince'); // 获取省
    }
  };

  DelErrorMsg = (msg) => {
    // 错误提示
    Modal.error({
      title: msg,
      okText: '确认',
    });
    this.setState({
      listLoading: false,
      queryLoading: false,
      cusUpdateLoading: false,
      saveLoading: false,
      submitLoading: false,
      calculateLoading: false,
      isId: '',
    });
  };

  getQueryDicValue = () => {
    // 调用数据字典、基础数值接口
    getBasValueByBasCategoryNo({ categoryNo: 'AS1000' }).then(res => { //获取工单的业务类型
      // console.log('获取工单的业务类型', res)
      this.setState({
        workBizType: []
      })
      if (res.success) {
        if (res.data) {
          let list = res.data;
          list.map((item, i) => {
            item.key = item.id;
            item.code = item.basCode;
            item.name = item.basText;
          });
          this.setState({ workBizType: list })
        }
      }
    })
    this.getDicDataesByCategoryCode({ code: '7000' }, 'fuelMeterScale'); // 获取油表信息
    this.getDicDataesByCategoryCode({ code: '7005' }, 'settleType'); // 获取结算方式
    this.getDicDataesByCategoryCode({ code: '3005' }, 'cusType'); // 获取客户类型
    this.getDicDataesByCategoryCode({ code: '1015' }, 'cusGender'); // 获取性别
    this.getDicDataesByCategoryCode({ code: '1055' }, 'carPowerType'); // 获取动力类型
    this.getDicDataesByCategoryCode({ code: '1050' }, 'carUsage'); // 获取用途
    this.getDicDataesByCategoryCode({ code: '1045' }, 'carPre'); // 获取车牌前缀
    // this.getDicDataesByCategoryCode({ code: '7140' }, 'workBizType'); // 获取工单的业务类型

    // 服务接待
    getHrEmpMstrByOrgId().then((res) => {
      this.setState({
        scEmp: [],
        listLoading: true,
      });
      if (res.success) {
        if (res.data) {
          const list = [];
          res.data.map((item, i) => {
            item.key = item.empId;
            item.code = item.empNo;
            item.name = item.empName;
            list.push(item);
          });
          this.setState({ scEmp: list, listLoading: false });
        }
      }
    });

    // 保险公司
    querySupplierTypeByID({ tagId: 30000015 }).then((res) => {
      this.setState({
        insBranch: [],
      });
      if (res.success) {
        if (res.data) {
          const list = [];
          res.data.map((item, i) => {
            item.key = item.cusId;
            item.code = item.cusId;
            item.name = item.cusName;
            list.push(item);
          });
          this.setState({ insBranch: list });
        }
      }
    });

    // 第一次添加工时，拿到默认的业务类型和结算方式
    queryWorkSetting().then((res) => {
      const { defaultTypeValue, cusAndCarInfo } = this.state;
      if (res.success) {
        if (res.data) {
          this.setState({
            defaultTypeValue: Object.assign({}, defaultTypeValue, {
              defaultWorkTypeId: res.data.defaultWorkTypeId, // 默认维修类型id,
              defaultWorkTypeNo: res.data.defaultWorkTypeNo, // 默认维修类型编码,
              defaultWorkType: res.data.defaultWorkTypeName, // 默认维修类型,
              defaultPayWayId: res.data.defaultPayWayId, // 默认结算方式id,
              defaultPayWayNo: res.data.defaultPayWayNo, // 默认结算方式编码,
              defaultPayWay: res.data.defaultPayWayName, // 默认结算方式,
              isAutoGoods: res.data.isAutoGoods, //是否自动发料 是-10000000,  否-10000005
            }),
            cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
              bizTypeId: res.data.defaultWorkTypeId, // 默认维修类型id,
              bizTypeCode: res.data.defaultWorkTypeNo, // 默认维修类型编码,
              bizTypeName: res.data.defaultWorkTypeName, // 默认维修类型,
            }),
          });
        } else {
          this.setState({
            defaultTypeValue: Object.assign({}, defaultTypeValue, {
              defaultWorkTypeId: '', // 默认维修类型id,
              defaultWorkTypeNo: '', // 默认维修类型编码,
              defaultWorkType: '', // 默认维修类型,
              defaultPayWayId: '', // 默认结算方式id,
              defaultPayWayNo: '', // 默认结算方式编码,
              defaultPayWay: '', // 默认结算方式,
            }),
          });
        }
      } else {
        this.DelErrorMsg(res.msg);
      }
    });

    // 工时单价
    listMdmWorkHourPrice({ pageSize: 10, currentIndex: 1 }).then((res) => {
      this.setState({
        workHourlyPrice: [],
        listLoading: true,
      });
      if (res.success) {
        if (res.data) {
          const list = [];
          res.data.items.map((item, i) => {
            item.key = item.mdmWorkHourPriceId;
            item.code = item.mdmWorkHourPriceId;
            item.name = item.workHourPrice;
            list.push(item);
          });
          this.setState({ workHourlyPrice: list, listLoading: false });
        }
      }
    });
  };

  // 调用数据字典
  getDicDataesByCategoryCode = (params, arrName) => {
    getDicDataByCategoryCode(params).then((res) => {
      this.setState({
        [arrName]: [],
        listLoading: true,
      });
      if (res.success) {
        if (res.data) {
          const list = [];
          res.data.map((item, i) => {
            item.key = item.id;
            item.code = item.dicCode;
            item.name = item.dicValue;
            list.push(item);
          });
          this.setState({ [arrName]: list, listLoading: false });
        }
      }
    });
  };

  // 省市区
  getGlobalMdmRegion = (obj, type) => {
    getGlobalMdmRegion({ parentNo: obj }).then((res) => {
      this.setState({
        queryLoading: true,
      });
      if (res.success) {
        this.setState({ queryLoading: false });
        if (res.data.length > 0) {
          const list = [];
          res.data.map((item, i) => {
            item.key = item.regionNo;
            item.code = item.regionNo;
            item.name = item.regionName;
            list.push(item);
          });
          this.setState({ [type]: list });
        }
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };

  GetCarModelVo = (obj) => {
    // 获取品牌
    this.setState({ CarModelVoList: [], queryLoading: true, threeLevelValue: [] });
    getCarModelVo(obj).then((res) => {
      if (res.success) {
        if (res.data) {
          const list = res.data;
          list.map((item) => {
            item.key = item.id;
            item.value = item.id;
            item.label = item.name;
            item.isLeaf = false;
          });
          this.setState({ CarModelVoList: list, queryLoading: false });
        }
      }
    });
  };

  // 获取默认品牌
  GetCarModelEditVo = (ids) => {
    const _th = this;
    let threeLevel;
    this.setState({ queryLoading: true });
    const getCarModelVoes = (obj, resolve) => {
      getCarModelVo({ id: obj }).then((res) => {
        if (res.success) {
          const list = res.data;
          if (res.data) {
            list.map((item) => {
              item.key = item.id;
              item.value = item.id;
              item.label = item.name;
            });
          }
          resolve(list);
        }
      });
    };
    new Promise((resolve, reject) => {
      getCarModelVoes(ids[0], resolve);
    })
      .then((res) => {
        // 一级
        threeLevel = res;
        new Promise((resolve, reject) => {
          getCarModelVoes(ids[1], resolve);
        }).then((res) => {
          // 二级
          const options = threeLevel.find(item => item.value == ids[1]);
          options.children = res;
          new Promise((resolve, reject) => {
            getCarModelVoes(ids[2], resolve);
          }).then((res) => {
            // 三级
            const options = threeLevel
              .find(item => item.value == ids[1])
              .children.find(item => item.value == ids[2]);
            options.children = res;
            _th.setState({ CarModelVoList: threeLevel, queryLoading: false });
          });
        });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  // 获取车型,车系
  GetCarModelVoChildren = (obj, targetOption, isLeaf) => {
    const _th = this;
    targetOption.loading = true;
    getCarModelVo(obj).then((res) => {
      targetOption.loading = false;
      if (res.success) {
        if (res.data) {
          const list = res.data;
          list.map((item) => {
            item.key = item.id;
            item.value = item.id;
            item.label = item.name;
            if (isLeaf < 2) {
              item.isLeaf = false;
            }
          });
          targetOption.children = list;
          _th.setState({ CarModelVoList: [..._th.state.CarModelVoList] });
        }
      }
    });
  };

  loadData = (selectedOptions) => {
    // console.log(766)
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption) {
      if (selectedOptions.length < 3) {
        this.GetCarModelVoChildren({ id: targetOption.id }, targetOption, selectedOptions.length);
      }
    }
  };
  // 页面第一次下拉时请求车型的一级数据
  threeDefault = () => {
    // console.log(898)
    if (!this.state.threeflag) {
      this.GetCarModelVo({ id: '' });
      this.setState({ threeflag: 1 });
    }
  };
  // 车型选择
  onCarModelChange = (...args) => {
    const brand = args[1].valueListTree[0];
    const series = brand.children[0];
    const category = series.children[0];
    const modal = category.children[0];
    const carInfoDto = this.state.carInfoDto;
    if (args[0].length <= 0) {
      this.setState({
        carInfoDto: Object.assign({}, carInfoDto, {
          carBrandId: '',
          carBrandName: '',
          carSeriesId: '',
          carSeriesName: '',
          carCategoryId: '', //车款id
          carCategoryName: '', //车款名称
          carModelId: '',
          carModelName: '',
        }),
      });
    } else {
      this.setState({
        carInfoDto: Object.assign({}, carInfoDto, {
          carBrandId: brand.value,
          carBrandName: brand.label,
          carCategoryId: category.value,
          carCategoryName: category.label,
          carSeriesId: series.value,
          carSeriesName: series.label,
          carModelId: modal.value,
          carModelName: modal.label,
        }),
      });
    }
  };

  singleDateChange = (type, date, dateString) => {
    const { carInfoDto, cusAndCarInfo } = this.state;
    if (type == 'insEndDate') {
      if (dateString) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, { insEndDate: dateString }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, { insEndDate: '' }),
        });
      }
    }
    if (type == 'qaEndDate') {
      if (dateString) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, { qaEndDate: dateString }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, { qaEndDate: '' }),
        });
      }
    }
    if (type == 'estimatedCarDeliveryDate') {
      if (dateString) {
        this.props.form.setFieldsValue({ estimatedCarDeliveryDate: dateString });
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, { estimatedCarDeliveryDate: dateString }),
        });
      } else {
        this.props.form.setFieldsValue({ estimatedCarDeliveryDate: '' });
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, { estimatedCarDeliveryDate: '' }),
        });
      }
    }
  };
  queryChange = (type, event) => {
    const { cusAndCarInfo } = this.state;
    if (type == 'inStoreMileage') {
      this.setState({ cusAndCarInfo: Object.assign({}, cusAndCarInfo, { inStoreMileage: event }) });
    } else {
      this.setState({
        cusAndCarInfo: Object.assign({}, cusAndCarInfo, { [type]: Trim(event.target.value, 'g') }),
      });
    }
  };

  modalChange = (type, event) => {
    const { settlementDto } = this.state;
    if (event < 0) return message.error('抹零金额必须大于0');
    if (event > settlementDto.cusPayAmount) return message.error('抹零金额必须小于客户付费');
    this.setState({
      settlementDto: Object.assign({}, settlementDto, {
        maLingAmount: event,
        payAmount: accSub(settlementDto.cusPayAmount, event),
      }),
    });
  };

  statesChange = (type, code, e) => {
    // console.log('下拉框修改', code, e)
    const {
      cusAndCarInfo,
      customerInfoDto,
      linkCustomerInfoDto,
      carInfoDto,
      cusUpdateInfo,
    } = this.state;
    // 油表信息
    if (type == 'fuelMeterScaleName') {
      if (code) {
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            fuelMeterScaleId: e.key,
            fuelMeterScaleCode: code,
            fuelMeterScaleName: e.props.name,
          }),
        });
      } else {
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            fuelMeterScaleId: '',
            fuelMeterScaleCode: '',
            fuelMeterScaleName: '',
          }),
        });
      }
    }
    // 服务接待
    if (type == 'scEmpName' && code) {
      if (code) {
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            scEmpId: e.key,
            scEmpName: e.props.name,
          }),
        });
      } else {
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, { scEmpId: '', scEmpName: '' }),
        });
      }
    }
    // 业务类型
    if (type == 'bizTypeName') {
      if (code) {
        this.setState({
          cusAndCarInfo: Object.assign({}, this.state.cusAndCarInfo, {
            bizTypeId: e.key,
            bizTypeCode: code,
            bizTypeName: e.props.name,
          }),
        });
      } else {
        this.setState({
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            bizTypeId: '',
            bizTypeCode: '',
            bizTypeName: '',
          }),
        });
      }
    }
    // 客户类型
    if (type == 'cusTypeName') {
      if (code) {
        if (code == 30050005) {
          // 企业
          this.setState({ cusTypeNama: 1 }, () => {
            if (customerInfoDto.cusName != '') { this.CreditCodeBlur() }
          });

        } else if (code == 30050000) {
          // 个人
          this.setState({ cusTypeNama: 0 });
        }
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusTypeId: e.key,
            cusTypeCode: code,
            cusTypeName: e.props.name,
          }),
        });
      } else {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, { cusTypeId: '', cusTypeName: '' }),
        });
      }
    }
    // 性别
    if (type == 'cusGenderName') {
      if (code) {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusGenderId: e.key,
            cusGenderName: e.props.name,
          }),
        });
      } else {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusGenderId: '',
            cusGenderName: '',
          }),
        });
      }
    }
    // 车主省份
    if (type == 'cusProvinceName') {
      if (code) {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusProvinceId: e.key,
            cusProvinceName: e.props.children,
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
        this.getGlobalMdmRegion(code, 'cusCity');
      } else {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusProvinceId: '',
            cusProvinceName: '',
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 联系人省份
    if (type == 'manProvinceName') {
      if (code) {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusProvinceId: e.key,
            cusProvinceName: e.props.children,
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
        this.getGlobalMdmRegion(code, 'cusManCity');
      } else {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusProvinceId: '',
            cusProvinceName: '',
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 车主城市
    if (type == 'cusCityName') {
      if (code) {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusCityId: e.key,
            cusCityName: e.props.children,
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
        this.getGlobalMdmRegion(code, 'cusRegion');
      } else {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 联系人城市
    if (type == 'manCityName') {
      if (code) {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusCityId: e.key,
            cusCityName: e.props.children,
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
        this.getGlobalMdmRegion(code, 'cusManRegion');
      } else {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 车主区县
    if (type == 'cusRegionName') {
      if (code) {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusRegionId: e.key,
            cusRegionName: e.props.children,
          }),
        });
      } else {
        this.setState({
          customerInfoDto: Object.assign({}, customerInfoDto, {
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 联系人区县
    if (type == 'manRegionName') {
      if (code) {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusRegionId: e.key,
            cusRegionName: e.props.children,
          }),
        });
      } else {
        this.setState({
          linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
    // 动力类型
    if (type == 'carPowerTypeName') {
      if (code) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carPowerTypeId: e.key,
            carPowerTypeCode: code,
            carPowerTypeName: e.props.name,
          }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carPowerTypeId: '',
            carPowerTypeCode: '',
            carPowerTypeName: '',
          }),
        });
      }
    }
    // 保险公司
    if (type == 'insBranchName') {
      if (code) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            insBranchId: e.key,
            insBranchName: e.props.name,
          }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            insBranchId: '',
            insBranchName: '',
          }),
        });
      }
    }
    // 用途
    if (type == 'carUsageName') {
      if (code) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carUsageId: e.key,
            carUsageCode: code,
            carUsageName: e.props.name,
          }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carUsageId: '',
            carUsageCode: '',
            carUsageName: '',
          }),
        });
      }
    }
    // 车牌号
    if (type == 'prefix') {
      const { carInfoDto } = this.state;
      if (code) {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carPlateTypeId: e.key,
            carPlateTypeCode: code,
            carPlateTypeName: e.props.name,
          }),
        });
      } else {
        this.setState({
          carInfoDto: Object.assign({}, carInfoDto, {
            carPlateTypeId: '',
            carPlateTypeCode: '',
            carPlateTypeName: '',
          }),
        });
      }
    }

    // 更新用户省
    if (type == 'upProvinceName') {
      if (code) {
        this.props.form.setFieldsValue({ upProvinceName: e.props.children, upCityName: '', upRegionName: '' });
        this.setState(
          {
            cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
              cusProvinceId: e.key,
              cusProvinceName: e.props.children,
              cusCityId: '',
              cusCityName: '',
              cusRegionId: '',
              cusRegionName: '',
            }),
          },
          () => {
            this.getGlobalMdmRegion(code, 'cusCity');
          },
        );
      } else {
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusProvinceId: '',
            cusProvinceName: '',
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }

    // 更新用户县
    if (type == 'upRegionName') {
      if (code) {
        this.props.form.setFieldsValue({ upRegionName: e.props.children });
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusRegionId: e.key,
            cusRegionName: e.props.children,
          }),
        });
      } else {
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }

    // 更新用户城市
    if (type == 'upCityName') {
      if (code) {
        this.props.form.setFieldsValue({ upCityName: e.props.children, upRegionName: '' });
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusCityId: e.key,
            cusCityName: e.props.children,
            cusRegionId: '',
            cusRegionName: '',
          }),
        }, () => {
          this.getGlobalMdmRegion(code, 'cusRegion');
        },
        );
      } else {
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusCityId: '',
            cusCityName: '',
            cusRegionId: '',
            cusRegionName: '',
          }),
        });
      }
    }
  };

  // 改变工时单价计算价格
  changeStdPrice = (code, e) => {
    let { workHoursDataSource, dropDownWorkHoursTable } = this.state;
    if (code) {
      let stdPrice = e.props.name;
      this.setState({
        cusAndCarInfo: Object.assign({}, this.state.cusAndCarInfo, {
          workHourlyPrice: stdPrice,
        }),
      });
      // 计算工项中的单价
      workHoursDataSource.map(item => {
        // 套餐和万能工时的单价不会改变
        if (item.workNeeded != 1 && item.combo != 2 && item.index != 0) {
          item.price = accMul(item.stdWorkHour, stdPrice);
          item.amount = this.decimalsCut(item.price * item.qty, 2, 'down');
          item.receivableAmount = this.decimalsCut(item.amount * item.discountRate, 2, 'down');
        }
      })
      // 计算工项下拉框中的单价
      dropDownWorkHoursTable.map(item => { item.price = accMul(item.stdWorkHour, stdPrice); })
      this.setState({ workHoursDataSource, dropDownWorkHoursTable, }, () => {
        this.calculateTotal('workHoursDataSource');
      })
    } else {
      this.setState({
        cusAndCarInfo: Object.assign({}, cusAndCarInfo, { workHourlyPrice: '' }),
      });
    }
  }
  // 车主信息修改
  cusAddChange = (type, event) => {
    const { customerInfoDto } = this.state;
    this.setState({
      customerInfoDto: Object.assign({}, customerInfoDto, {
        [type]: Trim(event.target.value, 'g'),
      }),
    });
  };

  // 联系人信息修改
  manAddChange = (type, event) => {
    const { linkCustomerInfoDto } = this.state;
    this.setState({
      linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
        [type]: Trim(event.target.value, 'g'),
      }),
    });
  };
  // 车辆信息修改
  carAddChange = (type, event) => {
    const { carInfoDto } = this.state;
    if (type == 'qaEndMileage') {
      this.setState({ carInfoDto: Object.assign({}, carInfoDto, { qaEndMileage: event }) });
    } else {
      this.setState({
        carInfoDto: Object.assign({}, carInfoDto, { [type]: Trim(event.target.value, 'g') }),
      });
    }
  };

  // 更新车主信息
  cusUpChange = (type, event) => {
    const { cusUpdateInfo } = this.state;
    this.setState({
      cusUpdateInfo: Object.assign({}, cusUpdateInfo, { [type]: Trim(event.target.value, 'g') }),
    });
  };

  // 车牌、vin码校验
  keyWordCheck = (type, event) => {
    const { carInfoDto } = this.state;
    const keyWord =
      type == 'carPlateNo' ? carInfoDto.carPlateTypeName + event.target.value : event.target.value;
    getCarInfoBykeywords({ keywords: keyWord }).then((res) => {
      if (res.success) {
      } else this.DelErrorMsg(res.msg);
    });
  };
  // 同步车主
  onManCheckChange = (event) => {
    const { addCarSave, customerInfoDto, linkCustomerInfoDto, cusCity, cusRegion } = this.state;
    const flag = !event.target.value;
    this.setState({
      addCarSave: Object.assign({}, addCarSave, {
        synchronousOwners: flag,
      }),
    });
    if (flag == 1) {
      this.props.form.resetFields(['cusName', 'cuMobileNo']);
      this.setState({
        linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
          cusName: this.state.customerInfoDto.cusName, // 客户姓名,
          cusGenderId: customerInfoDto.cusGenderId, // 客户性别ID,
          cusGenderName: customerInfoDto.cusGenderName, // 客户性别名称,
          cusMobileNo: customerInfoDto.cusMobileNo, // 联系电话,
          cusProvinceId: customerInfoDto.cusProvinceId, // 客户所在省份ID,
          cusProvinceName: customerInfoDto.cusProvinceName, // 客户所在省份名称,
          cusCityId: customerInfoDto.cusCityId, // 客户所在城市ID,
          cusCityName: customerInfoDto.cusCityName, // 客户所在城市名称,
          cusRegionId: customerInfoDto.cusRegionId, // 客户所在区ID,
          cusRegionName: customerInfoDto.cusRegionName, // 客户所在区名称,
          cusStreetAddress: customerInfoDto.cusStreetAddress, // 客户所在街道地址
        }),
        cusManCity: cusCity,//联系人城市与车主城市一致
        cusManRegion: cusRegion,//联系人区县与车主区县一致
      });
    }
  };

  onCheckChange = (type, event) => {
    const { cusAndCarInfo } = this.state;
    const flag = event.target.value == 0 ? 1 : 0;
    this.setState({ cusAndCarInfo: Object.assign({}, cusAndCarInfo, { [type]: flag }) });
  };

  // 人车关系
  carOwnerCusNameChange = (value) => {
    // console.log('已修改', value);
    const { cusAndCarInfo, cusUpdateInfo } = this.state;
    this.props.form.setFieldsValue({ cusNama: value.cusName });
    this.setState({
      cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
        carId: value.id, // 车辆id
        cusId: value.cusId, // 车主Id,
        cusNo: value.cusNo, // 客户编码
        cusName: value.cusName, // 车主姓名,
        carPlateNo: value.carPlateTypeName + value.carPlateNo, // 车牌号,111
        vin: value.vin, //
        cusContactPhone: value.cusContactNo, // 客户联系方式（手机号/座机号）
        carModelId: value.carModelId, // 车型ID,
        carModelName: value.carModelName, // 车型名称：品牌 车系 车型
        // carModelName: value.carBrandName + ' ' + value.carSeriesName + ' ' + value.carModelName, // 车型名称：品牌 车系 车型
        carEngineeNo: value.carEngineeNo, // 发动机号,
        carColorId: value.carColorId, // 车身色ID,
        carInnerColorId: value.carInnerColorId, // 内饰色ID,
        carColor: `${value.carColorName} ${value.carInnerColorName}`, // 车辆颜色
        carPowerTypeId: value.carPowerTypeId, // 车辆动力类型ID,
        carPowerTypeCode: value.carPowerTypeCode, // 车辆动力类型编码,
        carPowerTypeName: value.carPowerTypeName, // 车辆动力类型名称,
      }),
      cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
        id: value.cusId,
      }),
    });
  };

  CreditCodeBlur = (e) => {
    let { customerInfoDto } = this.state;
    if (this.state.cusTypeNama == 1 && customerInfoDto.cusName) {
      this.setState({ queryLoading: true })
      queryUnifiedSocialCreditCode({ supplierName: customerInfoDto.cusName }).then(res => {
        if (res.success && res.data) {
          this.setState({ queryLoading: false, customerInfoDto: Object.assign({}, customerInfoDto, { cusCertificateNo: res.data }) })
        } else {
          this.setState({ customerInfoDto: Object.assign({}, customerInfoDto, { cusCertificateNo: '' }) })
          this.DelErrorMsg(res.msg)
        }
      })
    }
  }
  // 新增车主
  addCarAndMan = () => {
    const { addCarSave } = this.state;
    this.setState({
      addVisible: true,
      cusUpdateFlag: 'save',
      threeLevelValue: [],
      addCarSave: Object.assign({}, addCarSave, {
        synchronousOwners: false,
      }),
    });
  };

  addSubmitOk = (event) => {
    event.preventDefault();
    const { cusUpdateFlag } = this.state;
    let formValidatorNames = [];
    if (cusUpdateFlag == 'save' && this.state.cusTypeNama == 0) { //客户类型个人 不用校验组织架构代码
      formValidatorNames = [
        'cusNam',
        'cusTypeName',
        'cusMobileNo',
        'cusGenderName',
        'cusStreetAddresss',
        'cusName',
        'cuMobileNo',
        'cusStreetAddress',
        'carPlateNo',
        'carPowerTypeName',
        'insBranchName',
        'insEndDate',
        'vin',
        'carUsageName',
        'qaEndMileage',
        'qaEndDate',
        'carModelName',
      ];
    } else if (cusUpdateFlag == 'edit') {
      formValidatorNames = ['carPlateNo', 'vin', 'carModelName'];
    }
    this.props.form.validateFieldsAndScroll(formValidatorNames, (err, values) => {
      if (!err) {
        const {
          addCarSave, customerInfoDto, linkCustomerInfoDto, carInfoDto, cusAndCarInfo,
        } = this.state;
        this.setState({
          addCarSave: Object.assign({}, addCarSave, {
            customerInfoDto,
            linkCustomerInfoDto,
            carInfoDto,
          }),
          saveLoading: true,
        }, () => {
          if (cusUpdateFlag == 'save') {
            saveCustomerCar(this.state.addCarSave).then((res) => {
              if (res.success && res.code == 200) {
                message.success('保存成功');
                this.setState({
                  saveLoading: false,
                  addVisible: false,
                });
                this.addCancel()
              } else {
                this.DelErrorMsg(res.msg);
              }
            });
          } else if (cusUpdateFlag == 'edit') {
            let { carInfoDto } = this.state;
            updateCustomerCar(carInfoDto).then((res) => {
              if (res.success && res.code == 200) {
                message.success('保存成功');
                this.setState({
                  saveLoading: false,
                  addVisible: false,
                  cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
                    vin: carInfoDto.vin, // 车架号,
                    carPlateNo: carInfoDto.carPlateTypeName + carInfoDto.carPlateNo, // 车牌号
                    carPowerTypeId: carInfoDto.carPowerTypeId, // 车辆动力类型ID,
                    carPowerTypeCode: carInfoDto.carPowerTypeCode, // 车辆动力类型编码,
                    carPowerTypeName: carInfoDto.carPowerTypeName, // 车辆动力类型名称,
                    carModelId: carInfoDto.carModelId, // 车型id
                    carModelName: carInfoDto.carBrandName + ' ' + carInfoDto.carSeriesName + ' ' + carInfoDto.carModelName, // 车型名称
                  })
                });
                this.addCancel()
              } else {
                this.DelErrorMsg(res.msg);
              }
            });
          }
        },
        );
      }
    });
  };

  addCancel = () => {
    const { customerInfoDto, linkCustomerInfoDto, carInfoDto, cusAndCarInfo } = this.state;
    this.props.form.resetFields();
    this.setState({
      addVisible: false,
      cusUpdateVisible: false,
      carUpdateVisible: false,
      historyVisible: false,
      calculateVisible: false,
      stockVisible: false,
      customerInfoDto: Object.assign({}, customerInfoDto, {
        cusTypeId: '', // 客户类型ID,
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
      }),
      linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
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
      }),
      carInfoDto: Object.assign({}, carInfoDto, {
        vin: '', // 车架号,
        carId: '', // 车辆id,
        carPlateTypeId: '', // 车牌号类型ID,
        carPlateTypeCode: '', // 车牌号类型编码,
        carPlateTypeName: '', // 车牌号类型名称,
        carPlateNo: '', // 车牌号,
        carBrandId: '', // 品牌ID,
        carBrandName: '', // 品牌名称,
        carSeriesId: '', // 车系ID,
        carSeriesName: '', // 车系名称,
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
      }),
      // cusAndCarInfo: Object.assign({}, cusAndCarInfo, { id: '' })
    });
  };

  // 客户更新
  cusUpdateClick = () => {
    if (this.state.jy == true) {
      return false
    }
    const cusId = this.state.cusAndCarInfo.cusId;
    const cusUpdateInfo = this.state.cusUpdateInfo;
    this.setState({
      cusUpdateVisible: true,
      queryLoading: true,
    });
    findCustomerById({ cusId }).then((res) => {
      if (res.success) {
        this.setState({ queryLoading: false });
        if (res.data) {
          // 调用对应的市区
          this.getGlobalMdmRegion(res.data.cusProvinceId, 'cusCity')
          this.getGlobalMdmRegion(res.data.cusCityId, 'cusRegion')
          this.setState({
            cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
              id: res.data.id, // 客户id
              cusName: res.data.cusName, // 客户姓名
              cusMobileNo: res.data.cusMobileNo, // 客户联系电话
              cusProvinceId: res.data.cusProvinceId, // 省份id
              cusProvinceName: res.data.cusProvinceName, // 省份名
              cusCityId: res.data.cusCityId, // 市id
              cusCityName: res.data.cusCityName, // 市名
              cusRegionId: res.data.cusRegionId, // 区/县id
              cusRegionName: res.data.cusRegionName, // 区/县名
              cusStreetAddress: res.data.cusStreetAddress, // 客户详细地址
            }),
          });
        }
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };

  cusUpdateOk = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ['upMobileNo', 'upProvinceName', 'cusCityName', 'upRegionName', 'upStreetAddress'],
      (err, values) => {
        if (!err) {
          let { cusUpdateInfo, cusAndCarInfo } = this.state;
          this.setState({
            cusUpdateLoading: true,
          });
          updateCustomerById(cusUpdateInfo).then((res) => {
            if (res.success && res.code == 200) {
              this.setState({
                cusUpdateVisible: false,
                cusUpdateLoading: false,
                cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
                  cusContactPhone: cusUpdateInfo.cusMobileNo
                })
              });
              message.success('更新成功');
            } else {
              this.DelErrorMsg(res.msg);
            }
          });
        }
      },
    );
  };

  // 更新车辆
  carUpdateClick = () => {
    if (this.state.jy == true) {
      return false
    }
    this.setState({
      carUpdateVisible: true,
      queryLoading: true,
    });
    this.findCusCarInfoFastlyByCusId(this.state.cusAndCarInfo.cusId);
  };

  findCusCarInfoFastlyByCusId = (id) => {
    const carUpdateInfo = this.state.carUpdateInfo;
    findCusCarInfoFastlyByCusId({ cusId: id }).then((res) => {
      if (res.success) {
        this.setState({ queryLoading: false });
        if (res.data) {
          const datas = res.data;
          datas.cusCarInfoFastlyDto.forEach((item, index) => {
            (item.key = item.id + index), (item.carPlateNo = item.carPlateTypeName + item.carPlateNo);
          });
          this.setState({
            carUpdateInfo: Object.assign({}, carUpdateInfo, {
              cusId: datas.cusId,
              cusName: datas.cusName,
              cusMobileNo: datas.cusMobileNo,
              cusCarInfoFastlyDto: datas.cusCarInfoFastlyDto,
            }),
          });
        }
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };

  carUpdateAdd = () => {
    this.setState(
      {
        carUpdateVisible: false,
      },
      () => {
        setTimeout(() => {
          this.setState({ addVisible: true, cusUpdateFlag: 'save', threeLevelValue: [] });
        }, 300);
      },
    );
  };

  carUpdateEdit = (record) => {
    const {
      addCarSave, customerInfoDto, linkCustomerInfoDto, carInfoDto,
    } = this.state;
    this.setState({
      carUpdateVisible: false,
    }, () => {
      setTimeout(() => {
        this.setState({ addVisible: true, cusUpdateFlag: 'edit' });
        findCusLinkCarInfoByCusIdAndVin({ cusId: this.state.cusAndCarInfo.cusId, vin: record.vin }).then((res) => {
          const datas = res.data;
          if (res.success && datas) {
            if (!datas.updateCustomerInfoDTO) datas.updateCustomerInfoDTO = {};
            if (!datas.linkUpdateCustomerInfoDTO) datas.linkUpdateCustomerInfoDTO = {};
            if (!datas.updateCarInfoAndOrgDubboDTO) datas.updateCarInfoAndOrgDubboDTO = {};
            this.setState({
              threeflag: 0,
              threeLevelValue: [{
                label: datas.updateCarInfoAndOrgDubboDTO.carModelName,
                value: datas.updateCarInfoAndOrgDubboDTO.carModelId
              }],
              // threeLevelValue: ["85e7cd40-adc9-11e8-80fa-7cd30adaaf2c", "87a14ccf-adc9-11e8-80fa-7cd30adaaf2c", "8992a017-adc9-11e8-80fa-7cd30adaaf2c"],
              addCarSave: Object.assign({}, addCarSave, {
                synchronousOwners: datas.synchronousOwners,
              }),
              customerInfoDto: Object.assign({}, customerInfoDto, {
                cusTypeId: datas.updateCustomerInfoDTO.cusTypeId, // 客户类型ID,
                cusTypeName: datas.updateCustomerInfoDTO.cusTypeName, // 客户类型名称,
                cusName: datas.updateCustomerInfoDTO.cusName, // 客户姓名,
                cusGenderId: datas.updateCustomerInfoDTO.cusGenderId, // 客户性别ID,
                cusGenderName: datas.updateCustomerInfoDTO.cusGenderName, // 客户性别名称,
                cusMobileNo: datas.updateCustomerInfoDTO.cusMobileNo, // 联系电话,
                cusProvinceId: datas.updateCustomerInfoDTO.cusProvinceId, // 客户所在省份ID,
                cusProvinceName: datas.updateCustomerInfoDTO.cusProvinceName, // 客户所在省份名称,
                cusCityId: datas.updateCustomerInfoDTO.cusCityId, // 客户所在城市ID,
                cusCityName: datas.updateCustomerInfoDTO.cusCityName, // 客户所在城市名称,
                cusRegionId: datas.updateCustomerInfoDTO.cusRegionId, // 客户所在区ID,
                cusRegionName: datas.updateCustomerInfoDTO.cusRegionName, // 客户所在区名称,
                cusStreetAddress: datas.updateCustomerInfoDTO.cusStreetAddress, // 客户所在街道地址,
                cusCertificateNo: datas.updateCustomerInfoDTO.cusCertificateNo, // 组织架构代码
              }),
              linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
                cusName: datas.linkUpdateCustomerInfoDTO.cusName, // 客户姓名,
                cusGenderId: datas.linkUpdateCustomerInfoDTO.cusGenderId, // 客户性别ID,
                cusGenderName: datas.linkUpdateCustomerInfoDTO.cusGenderName, // 客户性别名称,
                cusMobileNo: datas.linkUpdateCustomerInfoDTO.cusMobileNo, // 联系电话,
                cusProvinceId: datas.linkUpdateCustomerInfoDTO.cusProvinceId, // 客户所在省份ID,
                cusProvinceName: datas.linkUpdateCustomerInfoDTO.cusProvinceName, // 客户所在省份名称,
                cusCityId: datas.linkUpdateCustomerInfoDTO.cusCityId, // 客户所在城市ID,
                cusCityName: datas.linkUpdateCustomerInfoDTO.cusCityName, // 客户所在城市名称,
                cusRegionId: datas.linkUpdateCustomerInfoDTO.cusRegionId, // 客户所在区ID,
                cusRegionName: datas.linkUpdateCustomerInfoDTO.cusRegionName, // 客户所在区名称,
                cusStreetAddress: datas.linkUpdateCustomerInfoDTO.cusStreetAddress, // 客户所在街道地址
              }),
              carInfoDto: Object.assign({}, carInfoDto, {
                vin: datas.updateCarInfoAndOrgDubboDTO.vin, // 车架号,
                carId: datas.updateCarInfoAndOrgDubboDTO.carId, // 车辆id,
                carPlateTypeId: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeId, // 车牌号类型ID,
                carPlateTypeCode: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeCode, // 车牌号类型编码,
                carPlateTypeName: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeName, // 车牌号类型名称,
                carPlateNo: datas.updateCarInfoAndOrgDubboDTO.carPlateNo, // 车牌号,
                carBrandId: datas.updateCarInfoAndOrgDubboDTO.carBrandId, // 品牌ID,
                carBrandName: datas.updateCarInfoAndOrgDubboDTO.carBrandName, // 品牌名称,
                carSeriesId: datas.updateCarInfoAndOrgDubboDTO.carSeriesId, // 车系ID,
                carSeriesName: datas.updateCarInfoAndOrgDubboDTO.carSeriesName, // 车系名称,
                carModelId: datas.updateCarInfoAndOrgDubboDTO.carModelId, // 车型ID,
                carModelName: datas.updateCarInfoAndOrgDubboDTO.carModelName, // 车型名称,
                carPowerTypeId: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeId, // 车辆动力类型ID,
                carPowerTypeCode: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeCode, // 车辆动力类型编码,
                carPowerTypeName: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeName, // 车辆动力类型名称,
                carUsageId: datas.updateCarInfoAndOrgDubboDTO.carUsageId, // 车辆用途ID,
                carUsageCode: datas.updateCarInfoAndOrgDubboDTO.carUsageCode, // 车辆用途编码,
                carUsageName: datas.updateCarInfoAndOrgDubboDTO.carUsageName, // 车辆用途名称,
                insBranchId: datas.updateCarInfoAndOrgDubboDTO.insBranchId, // 保险分公司ID,
                insBranchName: datas.updateCarInfoAndOrgDubboDTO.insBranchName, // 保险分公司名称,
                insEndDate: datas.updateCarInfoAndOrgDubboDTO.insEndDate, // 保险到期日期,
                qaEndDate: datas.updateCarInfoAndOrgDubboDTO.qaEndDate, // 质保到期日期,
                qaEndMileage: datas.updateCarInfoAndOrgDubboDTO.qaEndMileage, // 质保到期里程
              }),
            });
            // this.GetCarModelEditVo([
            //   '',
            //   datas.updateCarInfoAndOrgDubboDTO.carBrandId,
            //   datas.updateCarInfoAndOrgDubboDTO.carSeriesId,
            // ]); // 车型
            // this.GetCarModelEditVo(['', "85e7cd40-adc9-11e8-80fa-7cd30adaaf2c", "87a14ccf-adc9-11e8-80fa-7cd30adaaf2c"]); //车型
          } else {
            this.DelErrorMsg(res.msg);
          }
        });
      }, 300);
    },
    );
  };

  // 维修历史
  historyUpdateClick = () => {
    // 查看状态就让它点击无效
    if (this.state.jy == true) {
      return false
    }
    this.setState({
      historyVisible: true,
    });
    this.getWorkOrderHistoryFastlyByCusId();
  };

  // 获取历史信息
  getWorkOrderHistoryFastlyByCusId = () => {
    this.setState({ queryLoading: true, historyFastlyInfo: [] });
    listWorkOrderHistoryFastlyByCusId({ vin: this.state.cusAndCarInfo.vin }).then((res) => {
      if (res.success) {
        const list = res.data || [];
        if (res.data) {
          list.map((item) => {
            item.key = item.id;
            item.settleDate = item.settleDate ? moment(item.settleDate).format('YYYY-MM-DD') : '';
          });
        }
        this.setState({
          queryLoading: false,
          historyFastlyInfo: list,
        });
      }
    });
  };
  // 查看维修历史
  historyUpdateSee = (record) => {
    // 点击工单号跳转到维修开单的页面将共代号也传过去
    const data = {
      id: record.id,
      jumpFlag: true,
      type: 'looked',
      woNo: record.vin,
    };
    // const _data = JSON.stringify(data);
    // const autoMessage = {
    //   name: '查看维修历史',
    //   index: `looked${record.id}`,
    //   url: 'MaintenanceHistory',
    //   resId: 'lookedOrder',
    //   infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST);

    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/MaintenanceHistory', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(MaintenanceHistory, data, { title: '查看维修历史' });
      });
    }
  };

  /** 保存工单 */
  handleSaveTable = () => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll(
      [
        'cusNama',
        'fuelMeterScaleName',
        'estimatedCarDeliveryDate',
        'scEmpName',
        'bizTypeName',
        'workHourlyPrice',
      ],
      (err, values) => {
        if (!err) {
          const { cusAndCarInfo, orderType } = this.state;
          const ids = cusAndCarInfo.id;
          this.setState({
            submitLoading: true,
            cusAndCarInfo: Object.assign({}, cusAndCarInfo, { id: orderType == 'copy' ? '' : ids })
          }, () => {
            const workDataSource = _.cloneDeep(this.state.workHoursDataSource);
            const goodDataSource = _.cloneDeep(this.state.goodsDataSource);
            workDataSource.splice(workDataSource.length - 1, 1);
            goodDataSource.splice(goodDataSource.length - 1, 1);
            const SaveWorkOrdeVo = {
              mstrVo: this.state.cusAndCarInfo,
              workItemsDetVos: workDataSource,
              goodsDetVos: goodDataSource,
            };
            saveWorkOrder(SaveWorkOrdeVo).then((res) => {
              if (res.success) {
                // console.log('res', res.data)
                message.success('保存成功');
                this.setState({
                  submitLoading: false,
                  isId: res.data,
                  selectedWorkHoursRowKeys: [],
                  cusAndCarInfo: Object.assign({}, cusAndCarInfo, { id: res.data, eoId: '' }),
                });
                this.seeQueryWorkOrder(res.data);
              } else {
                this.DelErrorMsg(res.msg);
              }
            });
          },
          );
        }
      },
    );
  };

  /** 提交工单 */
  handleSubmitTable = () => {
    const { cusAndCarInfo, isId, defaultTypeValue: { isAutoGoods } } = this.state;
    if (isAutoGoods == '10000000') { //自动发料需要查库存
      querySettlementGoodsInventory({ woId: cusAndCarInfo.id }).then(res => {
        if (res.success && res.data.length > 0) {
          // 库存不足
          res.data.map((item, index) => {
            item.key = item.goodsId + index;
          });
          this.setState({ stockVisible: true, stockDataSource: res.data });
        } else if (res.success && res.code == 200 && res.data.length == 0) {
          // 正常结算
          this.setState({ isId: '', calculateVisible: true, queryLoading: true });
          this.seeQueryWorkOrder(cusAndCarInfo.id);
        } else {
          this.DelErrorMsg(res.msg);
        }
      })
    } else {
      // 正常结算
      this.setState({ isId: '', calculateVisible: true, queryLoading: true });
      this.seeQueryWorkOrder(cusAndCarInfo.id);
    }

  };
  // 工单转施工单
  handleChangeTable = () => {
    const { cusAndCarInfo, isId, selectedWorkRowKeys, workHoursDataSource } = this.state;
    // 判断勾选行是否先保存过了
    const selectedFlag = workHoursDataSource.some(item => {
      return item.id == '';
    })
    if (!isId || selectedFlag) {
      message.error('请先保存工单');
      return false;
    }
    // 必须先选工时才能转施工单
    if (selectedWorkRowKeys.length == 0) {
      return message.error('请选择工时');
    } else {
      convertWorkProcessOrder({ woId: cusAndCarInfo.id, workItemIds: selectedWorkRowKeys }).then(res => {
        if (res.success && res.code == 200) {
          return message.success('转施工单成功！')
        } else {
          this.DelErrorMsg(res.msg);
        }
      })
      this.seeQueryWorkOrder(cusAndCarInfo.id);
    }
  };
  // 工单完工
  handleCompleteTable = () => {
    const { cusAndCarInfo, isId } = this.state;
    if (!isId) {
      message.error('请先保存工单');
      return false;
    }
    finishWorkOrder({ woId: cusAndCarInfo.id }).then(res => {
      if (res.success && res.code == 200) {
        this.seeQueryWorkOrder(cusAndCarInfo.id);
        return message.success('工单完工成功！')
      } else {
        message.error(res.msg);
      }
    })
  }

  // 工单查看
  seeQueryWorkOrder = (id) => {
    const _th = this;
    const { cusAndCarInfo, workHoursDataSource, orderType } = this.state;
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
    if (selectedFlag) { this.setState({ selectedWorkRowKeys: [] }) }
    apiName(obj).then((res) => {
      if (res.success) {
        const mstrDto = apiPage ? res.data.mstrDto : res.data.mstrVO;
        const workItemArr = apiPage ? res.data.workItemDtos.items : res.data.listWorkItemVO;
        const goodsItemArr = apiPage ? res.data.goodsDtos.items : res.data.listGoodsVO;
        const settlementDto = apiPage ? res.data.settlementDto : res.data.settlementVO;
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
        this.setState({
          queryLoading: false,
          orderType: orderType == 'editEo' ? 'editEo' : '',
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            id: jumpTypeFlag ? '' : mstrDto.id, // 主键ID,
            woNo: jumpTypeFlag ? '' : mstrDto.woNo, // 工单号
            eoId: '',
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
          }),
          workModalDataSource: workItemDtos.filter(item => item.index != 0),
          goodModalDataSource: goodsDtos.filter(item => item.index != 0),
          workHoursDataSource: workItemDtos,
          goodsDataSource: goodsDtos,
          settlementDto: Object.assign({}, settlementDto, {
            totalAmount: settlementDto.totalAmount, // 总金额,
            goodsAmount: settlementDto.goodsAmount, // 商品金额,
            workItemAmount: settlementDto.workItemAmount, // 施工金额,
            receivableAmount: settlementDto.receivableAmount, // 应收金额,
            payType: settlementDto.payType, // 付费方式(客户付费, 厂家付费, 店内付费),
            payAmount: settlementDto.payAmount, // 付费金额,
            cusPayAmount: settlementDto.payAmount, // 付费金额,
            maLingAmount: settlementDto.maLingAmount, // 抹零金额
            oldMaLingAmount: settlementDto.maLingAmount, // 原抹零金额
          }),
        }, () => {
          this.props.form.setFieldsValue({ estimatedCarDeliveryDate: mstrDto.estimatedCarDeliveryDate });
          // 调用方法计算
          _th.calculateTotal('workHoursDataSource',1);
          _th.calculateTotal('goodsDataSource',1);
        },
        );
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };


  /** 确认提交工单 */
  calculateOk = () => {
    this.setState({ calculateLoading: true });
    const SettlementConfirmVo = {
      woId: this.state.cusAndCarInfo.id, // 工单ID,
      oldMaLingAmount: this.state.settlementDto.oldMaLingAmount, // 原抹零金额,
      newMaLingAmount: this.state.settlementDto.maLingAmount, // 现抹零金额
    };
    settlementConfirm(SettlementConfirmVo).then((res) => {
      if (res.success && res.code == 200) {
        message.success('结算成功');
        this.setState({ calculateLoading: false, calculateVisible: false });
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };

  // table操作
  /** 下拉框搜索回调 */
  workHoursSearch = (value) => {
    const { carModelId, carModelName, workHourlyPrice } = this.state.cusAndCarInfo;
    if (!carModelId) {
      message.error('请先填写车主姓名和工时单价！');
    } else if (!workHourlyPrice) {
      message.error('请先选择工时单价！');
    } else {
      this.setState({ dropDownWorkHoursTable: [], fetching: true });
      const obj = {
        repairCarModelId: carModelId,
        keyWord: value,
        workHourlyPrice,
        page: 1,
        pageSize: 5,
      };
      queryWorkItemPage(obj).then((res) => {
        if (res.success) {
          this.setState({ fetching: false });
          if (res.data) {
            const list = [];
            res.data.items.map((item, index) => {
              item.key = item.goodsId + index;
              item.goodsUnit = '';
              list.push(item);
            });
            this.setState({ dropDownWorkHoursTable: list });
          }
        } else {
          this.DelErrorMsg(res.msg);
        }
      });
    }
  };

  goodsSearch = (value) => {
    if (value == '') return false;
    this.setState({ dropDownGoodsTable: [], fetchs: true });
    const obj = {
      goodsName: value,
    };
    queryFastProduct(obj).then((res) => {
      if (res.success) {
        this.setState({ fetchs: false });
        if (res.data) {
          const list = [];
          res.data.map((item, index) => {
            item.key = item.goodsId + index;
            item.goodsUnit = item.goodsUnit;
            list.push(item);
          });
          this.setState({ dropDownGoodsTable: list });
        }
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };

  /** 增加一行数据  */
  handleAdd = (row, sourseType) => {
    const {
      defaultWorkTypeId,
      defaultWorkTypeNo,
      defaultWorkType,
      defaultPayWayId,
      defaultPayWayNo,
      defaultPayWay,
    } = this.state.defaultTypeValue;
    let dataSource = this.state[sourseType]; // 根据调用的不同获取工时/商品
    // 添加万能工时
    if (row.workNeeded == 1) {
      let Boolean = this.state.workHoursDataSource.some(item => item.goodsNo == 99999999)
      if (!Boolean) {
        // 添加万能工项
        const workTime = {
          key: Math.random() + 1000,
          id: '', // 主键ID,
          workNeeded: 1, // 1表示万能工时
          combo: 1,
          goodsId: this.state.wnwokr[0].id, // 商品ID,
          goodsNo: this.state.wnwokr[0].dicCode, // 商品编码,
          goodsName: '万能工项', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: defaultWorkTypeId, // 业务类型ID,
          bizTypeCode: defaultWorkTypeNo, // 业务类型编码,
          bizTypeName: defaultWorkType, // 业务类型名称,
          settleTypeId: defaultPayWayId, // 结算方式ID,
          settleTypeCode: defaultPayWayNo, // 结算方式编码,
          settleTypeName: defaultPayWay, // 结算方式名称,
          price: 0, // 单价,
          qty: 1, // 数量,
          amount: 0, // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
        }
        this.state.workHoursDataSource.unshift(workTime)
        this.state.workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
      }
    }
    if (dataSource.length == 1) {
      // 添加第一条数据
      row.bizTypeId = defaultWorkTypeId;
      row.bizTypeCode = defaultWorkTypeNo;
      row.bizTypeName = defaultWorkType;
      row.settleTypeId = defaultPayWayId;
      row.settleTypeCode = defaultPayWayNo;
      row.settleTypeName = defaultPayWay;
      row.technicianEmpId = '';
      row.technicianEmpName = '';
      row.comboGoodsId = ''; // 套餐id
      row.combo = 1; // 非套餐1 套餐2
      row.workNeeded = row.workNeeded || 0; // 1万能工时  0非万能工时
      row.discountRate = 1.0;
      row.qty = 1;
      row.amount = row.qty * row.price || 0;
      row.receivableAmount = row.amount;
      row.id = ''; // 新增时id为空
      if (sourseType == 'workHoursDataSource') row.inWorkProcessQty = 0; // 转施工数量
      else if (sourseType == 'goodsDataSource') row.issuedQty = 0; // 发料数量
      dataSource = [row, ...dataSource];
    } else {
      row.bizTypeId = dataSource[dataSource.length - 2].bizTypeId;
      row.bizTypeCode = dataSource[dataSource.length - 2].bizTypeCode;
      row.bizTypeName = dataSource[dataSource.length - 2].bizTypeName;
      row.settleTypeId = dataSource[dataSource.length - 2].settleTypeId;
      row.settleTypeCode = dataSource[dataSource.length - 2].settleTypeCode;
      row.settleTypeName = dataSource[dataSource.length - 2].settleTypeName;
      row.technicianEmpId = dataSource[dataSource.length - 2].technicianEmpId;
      row.technicianEmpName = dataSource[dataSource.length - 2].technicianEmpName;
      row.comboGoodsId = ''; // 套餐id
      row.combo = 1; // 非套餐1 套餐2
      row.workNeeded = row.workNeeded || 0; // 1万能工时  0非万能工时
      row.discountRate = 1.0;
      row.qty = 1;
      row.amount = row.qty * row.price || 0;
      row.receivableAmount = row.amount;
      row.id = ''; // 新增时id为空
      if (sourseType == 'workHoursDataSource') row.inWorkProcessQty = 0; // 转施工数量
      else if (sourseType == 'goodsDataSource') row.issuedQty = 0; // 发料数量
      dataSource.splice(dataSource.length - 1, 0, row);
    }
    dataSource.map((item, index) => {
      if (item.index == 0) {
        item.workHoursNum = index + 1; // 序号
        item.amount = '';
      } else {
        item.key = item.goodsId + index; // 唯一标识码
        item.workHoursNum = index + 1; // 序号
      }
    });
    this.setState(
      {
        [sourseType]: dataSource,
      }, () => {
        sourseType == 'workHoursDataSource' ? this.calculateTotal('workHoursDataSource') : this.calculateTotal('goodsDataSource');
      }
    );
  };

  workHourAdd = (row) => {
    this.handleAdd(row, 'workHoursDataSource');
  };
  goodsAdd = (row) => {
    this.handleAdd(row, 'goodsDataSource');
  };

  /** 删除多行数据  */
  deleteRows = (type, e) => {
    const { workHoursDataSource, goodsDataSource, } = this.state;
    if (type == 'workHoursDataSource') {
      this.setState({ selectedWorkHoursRowKeys: [], selectedWorkRowKeys: [] });
    } else if (type == 'goodsDataSource') {
      this.setState({ selectedGoodsRowKeys: [] });
    }
    // 已转施工单的工项不能删除和修改数量
    const newWorkHoursDataSource = workHoursDataSource.filter(item => !item.checked || (item.checked && item.inWorkProcessQty > 0));
    const newGoodsDataSource = goodsDataSource.filter(item => !item.checked || (item.checked && item.issuedQty > 0));
    const option = newGoodsDataSource.find(item => item.workNeeded == 1) //找到所有的万能工项
    const processed = newWorkHoursDataSource.find(item => item.checked && item.inWorkProcessQty > 0); //已转施工
    const hadProcessed = newGoodsDataSource.find(item => item.checked && item.issuedQty > 0); //已发料
    if (processed) message.error('该工项已经转施工，不能删除该工项');
    if (hadProcessed) message.error('该商品已发料，不能删除该商品');
    if (!option) {
      let data = newWorkHoursDataSource.filter(item => item.workNeeded != 1);
      this.setState({
        workHoursDataSource: data,
        goodsDataSource: newGoodsDataSource
      }, () => {
        this.calculateTotal('workHoursDataSource');
        this.calculateTotal('goodsDataSource');
        this.state.workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
        this.state.goodsDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
      })
      return
    } else {
      this.setState({
        workHoursDataSource: newWorkHoursDataSource,
        goodsDataSource: newGoodsDataSource
      }, () => {
        this.state.workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
        this.state.goodsDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
        this.calculateTotal('workHoursDataSource');
        this.calculateTotal('goodsDataSource');
      })
    }
  };



  /** 批量操作：通过key来判断对那一列做逻辑 */
  handleBatchSubmit = (value, key, type) => {
    // console.log(value, key);
    const DataSource = this.state[type];
    const disaounts = key == 'receivableAmount' ? Number(value) : this.state.workHourdisaounts;
    const newData = DataSource.map((item) => {
      if ((key == 'discountRate' || key == 'receivableAmount') && item.combo == 2) { item[key] = item[key]; return item; } // 套餐的折扣率、应收金额不能修改
      item[key] = value; return item;
    });
    this.setState({ [type]: newData, workHourdisaounts: disaounts, isBatch: key }, () => {
      this.calculateTotal(type);
    });
  };

  /** 表格内表单值变化回调  */
  workHoursRowValue = (row, key) => {
    this.handleChangeRowValue(row, 'workHoursDataSource', key);
  };
  goodsRowValue = (row, key) => {
    this.handleChangeRowValue(row, 'goodsDataSource', key);
  };
  handleChangeRowValue = (row, dataSource, key) => {
    // console.log(11222, row, key)
    if (row && key !== 'bizTypeName' && key !== 'settleTypeName' && key !== 'technicianEmpName') {
      const newData = this.state[dataSource];
      const index = newData.findIndex(item => row.key === item.key);
      const changeKey = `row${key}`;
      row.amount = row.price * row.qty;
      newData.splice(index, 1, row);

      this.setState({ [dataSource]: newData, isBatch: changeKey }, () => {
        this.calculateTotal(dataSource);
      });
    }
  };

  /** 点击 表格checkbox 触发选择行为回调  */
  workHoursSelectRow = (record, selected, selectedRows) => {
    this.selectedRow(record, selected, 'workHoursDataSource');
  };
  goodsSelectRow = (record, selected, selectedRows) => {
    this.selectedRow(record, selected, 'goodsDataSource');
  };
  selectedRow = (record, selected, type) => {
    const {
      goodsDataSource,
      selectedGoodsRowKeys,
      workHoursDataSource,
      selectedWorkHoursRowKeys,
      selectedComboRowKeys,
    } = this.state;
    if (type == 'workHoursDataSource' && record.combo == 1) {
      const keyNum = selectedWorkHoursRowKeys.indexOf(record.key);
      keyNum == -1 ? selectedWorkHoursRowKeys.push(record.key) : null; // 非套餐的勾选
      keyNum > -1 ? selectedWorkHoursRowKeys.splice(keyNum, 1) : null; // 非套餐的不勾选
    } else if ((type = 'goodsDataSource' && record.combo == 1)) {
      const keyNum = selectedGoodsRowKeys.indexOf(record.key);
      keyNum == -1 ? selectedGoodsRowKeys.push(record.key) : null; // 非套餐的勾选
      keyNum > -1 ? selectedGoodsRowKeys.splice(keyNum, 1) : null; // 非套餐的不勾选
    }
    if (record.combo == 2) {
      workHoursDataSource.map((item) => { // 工项
        const num = selectedWorkHoursRowKeys.indexOf(item.key);
        if (record.comboGoodsId == item.comboGoodsId &&
          item.combo == 2 &&
          !item.checked &&
          selected &&
          num == -1) { // 套餐中勾选一个，其他都勾选
          selectedWorkHoursRowKeys.push(item.key);
          selectedComboRowKeys.push(item.key);
        }
        if (record.comboGoodsId == item.comboGoodsId &&
          item.combo == 2 &&
          item.checked &&
          !selected &&
          num > -1) {// 套餐中一个未勾选，其他都不勾选
          selectedWorkHoursRowKeys.splice(num, 1);
          selectedComboRowKeys.splice(num, 1);
        }
      });
      goodsDataSource.map((item) => {
        // 商品
        const num = selectedGoodsRowKeys.indexOf(item.key);
        if (
          record.comboGoodsId == item.comboGoodsId &&
          item.combo == 2 &&
          !item.checked &&
          selected &&
          num == -1
        ) {
          // 套餐中勾选一个，其他都勾选
          selectedGoodsRowKeys.push(item.key);
          selectedComboRowKeys.push(item.key);
        }
        if (
          record.comboGoodsId == item.comboGoodsId &&
          item.combo == 2 &&
          item.checked &&
          !selected &&
          num > -1
        ) {
          // 套餐中一个未勾选，其他都不勾选
          selectedGoodsRowKeys.splice(num, 1);
          selectedComboRowKeys.splice(num, 1);
        }
      });
    }
    this.setState({ selectedGoodsRowKeys, selectedWorkHoursRowKeys, selectedComboRowKeys, selectedWorkRowKeys: selectedWorkHoursRowKeys }, () => {
      this.handleSelectRow(selectedWorkHoursRowKeys, 'workHoursDataSource');
      this.handleSelectRow(selectedGoodsRowKeys, 'goodsDataSource');
    });
  };
  //点击表格 全选
  selectAllRow = (selected, selectedRows, type) => {
    // console.log(selected, selectedRows)
    let { workHoursDataSource, goodsDataSource } = this.state;
    let worksRowKeys = [];
    let goodsRowKeys = [];
    if (!selected) {
      // 全不选
      this.setState({ selectedWorkHoursRowKeys: [], });
    } else {
      const worksKeys = [];
      let goodsKeys = [];
      let newWorkIdsArr = [];
      let newGoodIdsArr = [];
      workHoursDataSource.map((item) => {
        worksKeys.push(item.key);
        newWorkIdsArr.push(item.comboGoodsId)
      });
      goodsDataSource.map((item) => {
        goodsKeys.push(item.key);
        newGoodIdsArr.push(item.comboGoodsId)
      });
      if (type == 'workHoursDataSource') {
        worksRowKeys = worksKeys;
        goodsDataSource.map((item) => {
          // 找到商品中与工时同一套餐的明细
          item.index != 0 && item.comboGoodsId && item.comboGoodsId.indexOf(newWorkIdsArr) > -1 ? goodsRowKeys.push(item.key) : null;
        });
      }
      if (type == 'goodsDataSource') {
        goodsRowKeys = goodsKeys;
        workHoursDataSource.map((item) => {
          // 找到工时中与商品同一套餐的明细
          item.index != 0 && item.comboGoodsId && item.comboGoodsId.includes(newGoodIdsArr) ? worksRowKeys.push(item.key) : null;
        });
      }
      // console.log(selected, worksKeys, worksRowKeys, goodsRowKeys, workHoursDataSource, goodsDataSource)
      this.setState({ selectedWorkHoursRowKeys: worksRowKeys, selectedGoodsRowKeys: goodsRowKeys, });
      this.handleSelectRow(worksRowKeys, 'workHoursDataSource');
      this.handleSelectRow(goodsRowKeys, 'goodsDataSource');
    }
  };
  workHoursSelectAll = (selected, selectedRows) => {
    if (!selected) {
      // 全不选
      this.setState({ selectedWorkHoursRowKeys: [], selectedWorkRowKeys: [] });
    } else {
      let RowKeys = [];
      let WorkRowKeys = [];
      selectedRows.map((item) => {
        RowKeys.push(item.key);
        if (item.index != 0) { WorkRowKeys.push(item.key) } //选中转施工单的id
      });
      this.setState({ selectedWorkHoursRowKeys: RowKeys, selectedWorkRowKeys: WorkRowKeys });
      this.handleSelectRow(RowKeys, 'workHoursDataSource');
    }
  }
  goodsSelectAll = (selected, selectedRows, changeRows) => {
    if (!selected) {
      // 全不选
      this.setState({ selectedGoodsRowKeys: [] });
    } else {
      let RowKeys = [];
      selectedRows.map((item) => {
        RowKeys.push(item.key);
      });
      this.setState({ selectedGoodsRowKeys: RowKeys });
      this.handleSelectRow(RowKeys, 'goodsDataSource');
    }
  };

  handleSelectRow = (selectedRowKeys, type) => { //添加勾选属性
    const dataSource = this.state[type];
    dataSource.forEach((item) => {
      item.checked = selectedRowKeys.indexOf(item.key) > -1 && item.index != 0;
    });
    this.setState({ [type]: dataSource }, this.calculateTotal(type));
  };

  /** 计算总数和总价格  */
  calculateTotal = (dataSourceType, notJump) => {
    const {
      decimalCount, workHourdisaounts, isBatch,
    } = this.state;
    const notJumpPage = notJump || 2; //1跳转 2非跳转
    const DataSource = this.state[dataSourceType];
    // 找到最后一行的套餐长度
    const totalAmount = Number(getComboTotal(DataSource, 'amount')); // 金额总计
    const workHoursDataLength = DataSource.length - 2;
    let workHoursPreReceive = 0; // 数据源的n-1项非套餐应收金额总和
    if (totalAmount < workHourdisaounts) { //优惠金额大于总金额
      message.error('套餐无法优惠，请输入小于非套餐的金额')
    }
    // console.log('DataSource',DataSource)
    if (notJumpPage === 2) { //跳转页面时不需要计算表格内金额
      DataSource.forEach((item, index) => {
        item.price = item.price || 0; // 单价
        const unitPrice = Number(item.price) || 0; // 单价
        const qty = Number(item.qty) || 0; // 数量
        const unitAmount = unitPrice * qty; // 金额
        item.amount = this.decimalsCut(unitAmount, decimalCount, 'down');
        let discountRow; //rowqty rowDiscountRate rowreceivableAmount discountRate receivableAmount
        if (totalAmount < workHourdisaounts) { //优惠金额大于总金额
          item.receivableAmount = item.amount;
          item.discountRate = 1.00;
          item.reduceAmount = 0;
        } else {
          if ((isBatch == 'rowdiscountRate' || isBatch == 'discountRate' || isBatch == 'rowqty') && !item.comboGoodsId) {
            //折扣率、数量  套餐不可修改应收金额、折扣率
            item.discountRate = item.discountRate;
            item.receivableAmount = this.decimalsCut(unitPrice * qty * item.discountRate, decimalCount, 'down');
          } else if (isBatch == 'rowreceivableAmount' && item.amount != 0) { //明细的优惠金额
            item.discountRate = this.decimalsCut(Number(item.receivableAmount / item.amount), decimalCount, 'down');
            item.receivableAmount = item.receivableAmount;
          } else if (isBatch == 'receivableAmount' && item.amount != 0 && workHourdisaounts != 0 && !item.comboGoodsId) {
            //批量的优惠金额 套餐不可修改应收金额、折扣率
            if (workHoursPreReceive < accSub(totalAmount, workHourdisaounts)) {
              discountRow = this.decimalsCut(accMul(Number(item.amount / totalAmount), workHourdisaounts), decimalCount, 'down');//优惠金额
              item.receivableAmount = accSub(item.amount, discountRow);
              item.discountRate = Number(item.receivableAmount / item.amount).toFixed(decimalCount);
            } else {
              // 前n项应收金额达到优惠后的总额,剩下的明细都为0
              item.receivableAmount = 0;
              item.discountRate = 0;
            }
          } else if (isBatch == 'receivableAmount' && workHourdisaounts == 0) { //批量的优惠金额0
            item.receivableAmount = item.amount;
            item.discountRate = 1.00;
          } else if (isBatch == 'noRowChange') {
            // 保存后接口返回的数据不用计算
          } else {
            item.receivableAmount = this.decimalsCut(unitPrice * qty * item.discountRate, decimalCount, 'down');
          }
          item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
          // 最后一行不是套餐、万能工项
          if (index == workHoursDataLength && item.index != 0 && item.amount != 0 && isBatch == 'receivableAmount' && !item.comboGoodsId) {
            // 只有输入优惠总金额 最后一行非套餐的数据才进行减法
            item.receivableAmount = Number(accSub(accSub(totalAmount, workHourdisaounts), workHoursPreReceive));
            item.discountRate = item.receivableAmount == 0 ? 0 : Number(item.receivableAmount / item.amount).toFixed(decimalCount);
            item.reduceAmount = accSub(item.amount, item.receivableAmount);//优惠金额
          } else if (!item.comboGoodsId) {
            // 把非套餐的应收金额加起来
            workHoursPreReceive = accAdd(workHoursPreReceive, this.decimalsCut(item.receivableAmount, decimalCount, 'down'));
          }
        }
      });
    }
    const { TotalMoney, ReceiveMoney, ReduceMoney, TotalNum } = this.getSelectedItemsInfo(DataSource); // 计算选中行总数
    if (dataSourceType == 'workHoursDataSource') {
      this.setState({
        workHoursTotalMoney: TotalMoney,
        workHoursReceiveMoney: ReceiveMoney,
        workHoursReduce: ReduceMoney,
        workHoursTotalNum: TotalNum,
        workHoursDataSource: DataSource,
      }, () => { this.calculateBottomTotal() });
    } else if (dataSourceType == 'goodsDataSource') {
      this.setState({
        goodsTotalMoney: TotalMoney,
        goodsReceiveMoney: ReceiveMoney,
        goodsReduce: ReduceMoney,
        goodsTotalNum: TotalNum,
        goodsDataSource: DataSource,
      }, () => { this.calculateBottomTotal() });
    }
  };
  /* 计算底部一系列金额 */
  calculateBottomTotal = () => {
    let { workHoursDataSource, goodsDataSource, cusAndCarInfo } = this.state;
    this.setState({
      workHourdisaounts: 0,
      isBatch: 'noRowChange',
      cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
        totalAmount: accAdd(getTotal(workHoursDataSource, 'amount'), getTotal(goodsDataSource, 'amount')), // 总金额
        goodsAmount: getTotal(goodsDataSource, 'amount'), // 商品金额
        workItemAmount: getTotal(workHoursDataSource, 'amount'), // 施工金额
        receivableAmount: accAdd(getTotal(workHoursDataSource, 'receivableAmount'), getTotal(goodsDataSource, 'receivableAmount')), // 应收金额
        payAmount: accAdd(getReceiveTotal(workHoursDataSource, 'receivableAmount'), getReceiveTotal(goodsDataSource, 'receivableAmount')), // 付费金额
      }),
    })
  }



  // 四舍不入
  decimalsCut = (number, n, type) => {
    if (type == 'down') { //只舍不入
      let digit = Math.pow(10, n);
      return Number(Math.floor(number * digit) / digit);
    }
    if (type == 'up') { //只入不舍

    }
  }

  /** 获取表格所有选中项信息及统计数据  */
  getSelectedItemsInfo = (data) => {
    let selectRows = data.filter(item => item.checked);
    // 对所有行进行计算，有勾选行则计算勾选行
    if (selectRows.length == 0) selectRows = data.filter(item => item.index != 0);
    // 验证每行的表单，如果有错误，则无法获取选中数据
    // const isFormInValid = selectRows.some(item =>
    //   (item.formValidatorError ? item.formValidatorError.length > 0 : item.formValidatorError));
    // if (isFormInValid) return false;

    const TotalMoney = getTotal(selectRows, 'amount');
    const ReceiveMoney = getTotal(selectRows, 'receivableAmount');
    const TotalNum = getTotal(selectRows, 'qty');
    return {
      selectRows,
      TotalMoney,
      ReceiveMoney,
      TotalNum,
    };
  };

  inputChange = (type, index, event) => {
    const workHoursDataSource = this.state.workHoursDataSource;
    const option = workHoursDataSource.find(Item => Item.key == index.key);
    option.goodsName = event.target.value;
    this.setState({ workHoursDataSource });
  };

  getOptionRender = (arr, { key = '', code = '', name = '' }) =>
    (Array.isArray(arr)
      ? arr.map(item => (
        <Option key={item[key]} value={item[code]}>
          {item[name]}
        </Option>
      ))
      : null);
  // 下拉框更改
  handleSelectChange = (row, option, key, type) => {
    // console.log(999, row, option, key, type)
    const { workHoursDataSource, goodsDataSource } = this.state;
    const comboId = row.comboGoodsId;
    workHoursDataSource.map((item) => {
      if (item.combo == 2 && item.comboGoodsId == comboId && option) {
        // 找到当前套餐的所有工项
        if (key == 'bizTypeName') { //option.props.value
          // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') {
          // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {
          // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      } else if (item.key == row.key && option) {
        if (key == 'bizTypeName') {
          // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') {
          // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {
          // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      }
    });
    goodsDataSource.map((item) => {
      if (item.combo == 2 && item.comboGoodsId == comboId && option) {
        // 找到当前套餐的所有工项
        if (key == 'bizTypeName') {
          // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') {
          // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {
          // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      } else if (item.key == row.key && option) {
        if (key == 'bizTypeName') {
          // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') {
          // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {
          // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      }
    });
    this.setState({ workHoursDataSource, goodsDataSource }, () => {
      this.calculateBottomTotal(); //计算客户付费
    });
  };
  // 批量下拉框更改
  handleHeadSelectChange = (row, option, key, type) => {
    const dataSourse = this.state[type];
    let selectRows = dataSourse.filter(item => item.checked);
    // 对所有行进行计算，有勾选行则计算勾选行
    if (selectRows.length == 0) selectRows = dataSourse.filter(item => item.index != 0);
    // 验证每行的表单，如果有错误，则无法获取选中数据
    const isFormInValid = selectRows.some(item =>
      (item.formValidatorError ? item.formValidatorError.length > 0 : item.formValidatorError));
    if (isFormInValid) return false;
    selectRows.forEach((item) => {
      if (key == 'bizTypeName') {
        // 业务类型
        item.bizTypeId = option.key;
        item.bizTypeCode = option.props.value;
        item.bizTypeName = option.props.children;
      }
      if (key == 'settleTypeName') {
        // 结算方式
        item.settleTypeId = option.key;
        item.settleTypeCode = option.props.value;
        item.settleTypeName = option.props.children;
      }
      if (key == 'technicianEmpName') {
        // 技师
        item.technicianEmpId = option.key;
        item.technicianEmpName = option.props.children;
      }
    });
    this.setState({ [type]: dataSourse }, () => {
      this.calculateBottomTotal(); //计算客户付费
    });
  };

  /** 获取表格尾部渲染信息  */
  getTableFooterRender = (TotalMoney, TotalNum, ReceiveMoney) => {
    const FooterRender = (
      <Row style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.85)' }}>
        <Col sm={{ span: 6 }}>
          <FormItem {...formItemLayout} label='数量合计'>
            {TotalNum || 0}
          </FormItem>
        </Col>
        <Col sm={{ span: 9, push: 2 }}>
          <FormItem {...formItemLayout} label='金额总计'>
            {TotalMoney ? TotalMoney.toFixed(2) : 0}
          </FormItem>
        </Col>
        <Col sm={{ span: 9 }}>
          <FormItem {...formItemLayout} label='应收金额总计'>
            {ReceiveMoney ? ReceiveMoney.toFixed(2) : 0}
          </FormItem>
        </Col>
      </Row>
    );
    return FooterRender;
  };

  getTableHeaderRender = (type) => {
    const HeaderRender = (
      <Row style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.85)' }}>
        <Button
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.deleteRows.bind(event, 'workHoursDataSource')}
          disabled={this.state.jy}
        >
          删除
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          disabled={this.state.jy}
          onClick={this.addT}
        >
          套餐
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.cp}
          disabled={this.state.jy}
        >
          组合
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.workHouse}
          disabled={this.state.jy}
        >
          工时
        </Button>
        <Button
          className='mr20'
          style={{ display: type == 'goods' ? 'inline-block' : 'none' }}
          onClick={this.deleteRows.bind(event, 'goodsDataSource')}
          disabled={this.state.jy}
        >
          删除
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'goods' ? 'inline-block' : 'none' }}
          onClick={this.goods}
          disabled={this.state.jy}
        >
          商品
        </Button>
      </Row>
    );
    return HeaderRender;
  };

  onExpand = (expanded, record) => {
    if (this.state.expandedRowKeys.length > 0) {
      this.state.expandedRowKeys = [];
    }
    const comboGoodsId = record.id;
    this.state.expandedRowKeys.push(comboGoodsId);
    this.setState({
      expandedRowKeys: this.state.expandedRowKeys,
    });
    // 发送请求获取数据
    queryComboGoodsDet({ comboGoodsId }).then((res) => {
      if (res.success) {
        // console.log(res)
        const infoData = [
          ...res.data.additionList,
          ...res.data.competitiveList,
          ...res.data.spareList,
          ...res.data.workList,
        ];
        this.state.infoData.map((item, index) => {
          item.key = index;
        });
        this.setState({
          infoData,
          goodsLists: [
            ...res.data.additionList,
            ...res.data.competitiveList,
            ...res.data.spareList,
          ],
          worksLists: [...res.data.workList],
        });
      }
    });
  };

  searchTable = (obj) => {
    queryComboGoodsForPage(obj).then((res) => {
      if (res.success) {
        const tabledData = res.data.items;
        tabledData.map((item, index) => {
          item.key = index + Math.random;
        });
        this.setState({
          tabledData,
          comboPageTotal: res.data.totalNumber,
        });
      }
    });
  };

  // 套餐显示
  addT = () => {
    const _th = this;
    if (this.state.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
      return false;
    }
    const carModelId = this.state.cusAndCarInfo.carModelId;
    const obj = this.state.obj;
    this.setState(
      {
        comboVisible: true,
        obj: Object.assign({}, obj, { carModelId }),
      },
      () => {
        // 发送请求
        _th.searchTable(this.state.obj);
      },
    );
  };

  TCchange = (e) => {
    const value = e.target.value;
    const obj = this.state.obj;
    this.setState({
      obj: Object.assign({}, obj, { comboName: value }),
    });
  };

  // 套餐回车事件
  enterSearch = (e) => {
    const _th = this;
    const value = e.target.value;
    const obj = this.state.obj;
    this.setState(
      {
        obj: Object.assign({}, obj, { comboName: value, index: 1 }),
      },
      () => {
        // 发送请求获取数据
        _th.searchTable(this.state.obj);
      },
    );
  };

  // 查询套餐的分页
  onCurrentPages = (current) => {
    const _th = this;
    const obj = this.state.obj;
    this.setState(
      {
        pagecurrent: current,
        obj: Object.assign({}, obj, { index: current }),
      },
      () => {
        _th.searchTable(this.state.obj);
      },
    );
  };

  // 套餐添加到表格
  AddTableds = (record) => {
    const _th = this;
    const ID = record.id;
    queryComboGoodsDet({ comboGoodsId: ID }).then((res) => {
      // console.log('添加套餐', res)
      if (res.success) {
        const infoData = [
          ...res.data.additionList,
          ...res.data.competitiveList,
          ...res.data.spareList,
          ...res.data.workList,
        ];
        this.setState({
          infoData,
          goodsLists: [
            ...res.data.additionList,
            ...res.data.competitiveList,
            ...res.data.spareList,
          ],
          worksLists: [...res.data.workList],
        }, () => {
          // 如果这两个数组的length都为0
          if (this.state.goodsLists.length == 0 && this.state.worksLists.length == 0) {
            // 提示用户这个组合中没有商品了
            message.error('这个套餐中没有商品请选择别的套餐');
            return false;
          }
          this.state.infoData.map((item, index) => {
            item.key = index;
          });
          // 将商品的添加到商品或者工项
          const workArr = [];
          const goodsArr = [];
          this.state.goodsLists.map((item, index) => {
            item.qty = this.state.number;
            const tabledList = {
              key: item.goodsId + index,
              goodsNo: '',
              combo: 2, // 非套餐1 套餐2
              index: item.goodsId,
              workHoursNum: 1,
              id: '', // 主键ID,
              goodsId: item.goodsId, // 商品ID,
              goodsNo: item.goodsNo, // 商品编码,
              goodsName: item.goodsName, // 商品名称,
              comboGoodsId: item.comboGoodsId,
              goodsTypeId: '', // 商品类型ID,
              goodsTypeCode: '', // 商品类型编码,
              goodsTypeName: '', // 商品类型名称（材料 or 施工）,
              bizTypeId: '', // 业务类型ID,
              bizTypeCode: '', // 业务类型编码,
              bizTypeName: '', // 业务类型名称,
              settleTypeId: '', // 结算方式ID,
              settleTypeCode: '', // 结算方式编码,
              settleTypeName: '', // 结算方式名称,
              price: item.price, // 单价,
              qty: +this.state.number, // 数量,
              amount: '', // 金额,
              discountRate: '', // 折扣率,
              receivableAmount: '', // 应收金额,
              technicianEmpId: '', // 技师员工ID (施工),
              technicianEmpName: '', // 技师员工姓名 (施工),
              issuedQty: 0, // 已发料数量 (材料)
              workNeeded: item.workNeeded,//是否添加万能工项
              mfgGoodsNo: item.mfgGoodsNo,
              oemGoodsNo: item.oemGoodsNo,
              goodsUnit: '件',
              goodsIssueNeeded: item.goodsIssueNeeded,
            };
            goodsArr.push(tabledList);
          });
          this.state.worksLists.map((item, index) => {
            item.qty = this.state.number;
            const tabledListss = {
              key: item.goodsId + index,
              goodsNo: '',
              combo: 2, // 非套餐1 套餐2
              index: item.goodsId,
              id: '', // 主键ID,
              workNeeded: 0,
              goodsId: item.goodsId, // 商品ID,
              goodsNo: item.goodsNo, // 商品编码,
              goodsName: item.goodsName, // 商品名称,
              comboGoodsId: item.comboGoodsId,
              goodsTypeId: '', // 商品类型ID,
              goodsTypeCode: '', // 商品类型编码,
              goodsTypeName: '', // 商品类型名称（材料 or 施工）,
              bizTypeId: '', // 业务类型ID,
              bizTypeCode: '', // 业务类型编码,
              bizTypeName: '', // 业务类型名称,
              settleTypeId: '', // 结算方式ID,
              settleTypeCode: '', // 结算方式编码,
              settleTypeName: '', // 结算方式名称,
              price: item.price, // 单价,
              qty: +this.state.number, // 数量,
              amount: '', // 金额,
              discountRate: '', // 折扣率,
              receivableAmount: '', // 应收金额,
              technicianEmpId: '', // 技师员工ID (施工),
              technicianEmpName: '', // 技师员工姓名 (施工),
              issuedQty: 0, // 已发料数量 (材料)
              stdWorkHour: item.stdWorkHour,
            };
            workArr.push(tabledListss);
          });
          let workHoursDataSource = this.state.workHoursDataSource;
          let goodsDataSource = this.state.goodsDataSource;
          const Wlength = workHoursDataSource.length;
          const Glength = goodsDataSource.length;
          const {
            defaultWorkTypeId,
            defaultWorkTypeNo,
            defaultWorkType,
            defaultPayWayId,
            defaultPayWayNo,
            defaultPayWay,
          } = this.state.defaultTypeValue;
          if (Wlength == 1) {
            // 添加第一条数据
            workArr.map((item) => {
              item.bizTypeId = defaultWorkTypeId;
              item.bizTypeCode = defaultWorkTypeNo;
              item.bizTypeName = defaultWorkType;
              item.settleTypeId = defaultPayWayId;
              item.settleTypeCode = defaultPayWayNo;
              item.settleTypeName = defaultPayWay;
              item.discountRate = 1.0;
              item.qty = +this.state.number;
              item.amount = +this.state.number * item.price || 0;
              item.receivableAmount = +this.state.number * item.price || 0;
            });
            workHoursDataSource = [...workArr, ...workHoursDataSource];
          } else {
            workArr.map((item) => {
              item.bizTypeId = workHoursDataSource[workHoursDataSource.length - 2].bizTypeId;
              item.bizTypeCode = workHoursDataSource[workHoursDataSource.length - 2].bizTypeCode;
              item.bizTypeName = workHoursDataSource[workHoursDataSource.length - 2].bizTypeName;
              item.settleTypeId = workHoursDataSource[workHoursDataSource.length - 2].settleTypeId;
              item.settleTypeCode = workHoursDataSource[workHoursDataSource.length - 2].settleTypeCode;
              item.settleTypeName = workHoursDataSource[workHoursDataSource.length - 2].settleTypeName;
              item.discountRate = 1.0;
              item.qty = +this.state.number;
              item.amount = +this.state.number * item.price || 0;
              item.receivableAmount = +this.state.number * item.price || 0;
            });
            workHoursDataSource = [...workArr, ...workHoursDataSource];
          }
          if (Glength == 1) {
            // 添加第一条数据
            goodsArr.map((item) => {
              item.bizTypeId = defaultWorkTypeId;
              item.bizTypeCode = defaultWorkTypeNo;
              item.bizTypeName = defaultWorkType;
              item.settleTypeId = defaultPayWayId;
              item.settleTypeCode = defaultPayWayNo;
              item.settleTypeName = defaultPayWay;
              item.discountRate = 1.0;
              item.qty = +this.state.number;
              item.amount = +this.state.number * item.price || 0;
              item.receivableAmount = +this.state.number * item.price || 0;
            });
            goodsDataSource = [...goodsArr, ...goodsDataSource];
          } else {
            goodsArr.map((item) => {
              item.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
              item.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
              item.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
              item.settleTypeId = goodsDataSource[goodsDataSource.length - 2].settleTypeId;
              item.settleTypeCode = goodsDataSource[goodsDataSource.length - 2].settleTypeCode;
              item.settleTypeName = goodsDataSource[goodsDataSource.length - 2].settleTypeName;
              item.discountRate = 1.0;
              item.qty = +this.state.number;
              item.amount = +this.state.number * item.price || 0;
              item.receivableAmount = +this.state.number * item.price || 0;
            });
            goodsDataSource = [...goodsArr, ...goodsDataSource];
          }
          workHoursDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
            item.issuedQty = 0; // 发料数量
          });
          goodsDataSource.map((item, index) => {
            item.issuedQty = 0; // 发料数量
            if (item.index == 0) {
              item.workHoursNum = index + 1;
            } else {
              item.workHoursNum = index + 1;
            }
          });
          this.setState(
            {
              workHoursDataSource,
              goodsDataSource,
              number: 1, // 清空字段
              comboVisible: false,
            },
            () => {
              // 个arr设置key值
              this.state.workHoursDataSource.map((item, index) => {
                item.key = index + Math.random();
              });
              this.state.goodsDataSource.map((item, index) => {
                item.key = index + Math.random();
              });
              _th.calculateTotal('workHoursDataSource');
              _th.calculateTotal('goodsDataSource');
            },
          );
        },
        );
      } else {
        this.DelErrorMsg(res.msg);
      }
    });
  };
  // 工时的分页查询
  onwsCurrentPage = (current) => {
    const _th = this;
    const list = this.state.list;
    this.setState(
      {
        pagecurrent: current,
        list: Object.assign({}, list, { page: current }),
      },
      () => {
        _th.QueryWorkItemPage(this.state.list);
      },
    );
  };

  showTotal = total => `共 ${total} 条`;

  QueryGroupGoodsForPage = (data) => {
    queryGroupGoodsForPage(data).then((res) => {
      if (res.success) {
        // console.log(res.data.items)
        const groupDataSource = res.data.items;
        groupDataSource.map((item, index) => {
          item.key = index;
        });
        this.setState({
          groupDataSource,
          groupPageTotal: res.data.totalNumber,
        });
      }
    });
  };

  onCpCurrentPage = (current) => {
    const _th = this;
    const groupList = this.state.groupList;
    this.setState(
      {
        pagecurrent: current,
        groupList: Object.assign({}, groupList, { index: current }),
      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.groupList);
      },
    );
  };

  // 价格方案改变事件
  priceWay = (value, Option) => {
    const groupObj = this.state.groupObj;
    if (value == undefined || Option.props == undefined) {
      this.setState({
        groupObj: Object.assign({}, groupObj, { priceTypeCode: '', name: '' }),
      });
    } else {
      this.setState({
        groupObj: Object.assign({}, groupObj, { priceTypeCode: value, name: Option.props.children }),
      });
    }
  };

  // 组合添加到表格
  adddWHG = (record) => {
    const _th = this;
    if (this.state.groupObj.priceTypeCode == '') {
      message.error('请选择价格方案');
    }
    const groupObj = this.state.groupObj;
    const workHourlyPrice = this.state.cusAndCarInfo.workHourlyPrice;
    const carModelId = this.state.cusAndCarInfo.carModelId;
    this.setState({
      groupObj: Object.assign({}, groupObj, {
        carModelId,
        groupGoodsId: record.id,
        workHourlyPrice,
      }),
    }, () => {
      queryGroupGoodsDet(this.state.groupObj).then((res) => {
        if (res.success) {
          this.setState({
            goodsModalList: [...res.data.additionList, ...res.data.competitiveList, ...res.data.spareList],
            worksModalList: res.data.workList,
          }, () => {
            // 如果这两个数组的length都为0
            if (this.state.goodsModalList.length == 0 && this.state.worksModalList.length == 0) {
              // 提示用户这个组合中没有商品了
              message.error('这个组合中没有商品请选择别的组合');
              return false;
            }
            if (res.data.noPriceList.length != 0) {
              let str = '';
              res.data.noPriceList.map((item, index) => {
                str += `${item},`;
              });
              let price = `${_th.state.groupObj.name}`
              message.error(`这个组合中${str}这项未维护${price}不能添加到工单`);
            }
            if (res.data.noPriceWork.length != 0) {
              let str = '';
              res.data.noPriceWork.map((item, index) => {
                str += `${item},`;
              });
              message.error(`这个组合中${str}没有设置标准工时不能添加到工单`);
            }
            // 再将商品添加到表格
            const workArr = [];
            const goodsArr = [];
            this.state.goodsModalList.map((item) => {
              item.qty = + this.state.number;
              const tabledList = {
                combo: 1,
                key: item.goodsId,
                workNeeded: 0,
                index: item.goodsId,
                workHoursNum: 1,
                id: '', // 主键ID,
                goodsId: item.goodsId, // 商品ID,
                goodsNo: item.goodsNo, // 商品编码,
                goodsName: item.goodsName, // 商品名称,
                comboGoodsId: item.comboGoodsId,
                goodsTypeId: '', // 商品类型ID,
                goodsTypeCode: '', // 商品类型编码,
                goodsTypeName: '', // 商品类型名称（材料 or 施工）,
                bizTypeId: '', // 业务类型ID,
                bizTypeCode: '', // 业务类型编码,
                bizTypeName: '', // 业务类型名称,
                settleTypeId: this.state.groupSettleId, // 结算方式ID,
                settleTypeCode: this.state.groupSettleCode, // 结算方式编码,
                settleTypeName: this.state.groupSettleType, // 结算方式名称,
                price: item.price, // 单价,
                qty: + this.state.number, // 数量,
                amount: '', // 金额,
                discountRate: '', // 折扣率,
                receivableAmount: '', // 应收金额,
                technicianEmpId: '', // 技师员工ID (施工),
                technicianEmpName: '', // 技师员工姓名 (施工),
                issuedQty: 0, // 已发料数量 (材料)
                mfgGoodsNo: item.mfgGoodsNo,
                oemGoodsNo: item.oemGoodsNo,
                goodsUnit: '件',
                goodsIssueNeeded: item.goodsIssueNeeded,
                // workNeeded:item.workNeeded
              };
              goodsArr.push(tabledList); // 商品
            });
            this.state.worksModalList.map((item) => {
              item.qty = + this.state.number;
              const tabledListss = {
                combo: 1,
                key: item.goodsId,
                workNeeded: 0,
                goodsNo: '',
                index: item.goodsId,
                workHoursNum: 1,
                id: '', // 主键ID,
                goodsId: item.goodsId, // 商品ID,
                goodsNo: item.goodsNo, // 商品编码,
                goodsName: item.goodsName, // 商品名称,
                goodsTypeId: '', // 商品类型ID,
                goodsTypeCode: '', // 商品类型编码,
                goodsTypeName: '', // 商品类型名称（材料 or 施工）,
                bizTypeId: '', // 业务类型ID,
                bizTypeCode: '', // 业务类型编码,
                bizTypeName: '', // 业务类型名称,
                settleTypeId: this.state.groupSettleId, // 结算方式ID,
                settleTypeCode: this.state.groupSettleCode, // 结算方式编码,
                settleTypeName: this.state.groupSettleType, // 结算方式名称,
                price: item.price, // 单价,
                qty: + this.state.number, // 数量,
                amount: '', // 金额,
                discountRate: 1, // 折扣率,
                receivableAmount: '', // 应收金额,
                technicianEmpId: '', // 技师员工ID (施工),
                technicianEmpName: '', // 技师员工姓名 (施工),
                issuedQty: 0, // 已发料数量 (材料)
                stdWorkHour: item.stdWorkHour
              };
              workArr.push(tabledListss);
            });
            let workHoursDataSource = this.state.workHoursDataSource;
            let goodsDataSource = this.state.goodsDataSource;
            const Wlength = workHoursDataSource.length;
            const Glength = goodsDataSource.length;
            const {
              defaultWorkTypeId,
              defaultWorkTypeNo,
              defaultWorkType,
              defaultPayWayId,
              defaultPayWayNo,
              defaultPayWay,
            } = this.state.defaultTypeValue;
            if (Wlength == 1) {
              // 添加第一条数据
              workArr.map(item => {
                item.bizTypeId = defaultWorkTypeId;
                item.bizTypeCode = defaultWorkTypeNo;
                item.bizTypeName = defaultWorkType;
                item.settleTypeId = this.state.groupSettleId;
                item.settleTypeCode = this.state.groupSettleCode;
                item.settleTypeName = this.state.groupSettleType;
                item.discountRate = 1.0;
                item.qty = +this.state.number;
                item.amount = +this.state.number * item.price || 0;
                item.receivableAmount = +this.state.number * item.price || 0;
              })
              workHoursDataSource = [...workArr, ...workHoursDataSource];
            } else {
              workArr.map(item => {
                item.bizTypeId = workHoursDataSource[workHoursDataSource.length - 2].bizTypeId;
                item.bizTypeCode = workHoursDataSource[workHoursDataSource.length - 2].bizTypeCode;
                item.bizTypeName = workHoursDataSource[workHoursDataSource.length - 2].bizTypeName;
                item.settleTypeId = this.state.groupSettleId;
                item.settleTypeCode = this.state.groupSettleCode;
                item.settleTypeName = this.state.groupSettleType;
                item.discountRate = 1.0;
                item.qty = +this.state.number;
                item.amount = +this.state.number * item.price || 0;
                item.receivableAmount = +this.state.number * item.price || 0;
              })
              workHoursDataSource.splice(Wlength - 1, 0, ...workArr)
            }
            if (Glength == 1) {
              // 添加第一条数据
              goodsArr.map((item) => {
                item.bizTypeId = defaultWorkTypeId;
                item.bizTypeCode = defaultWorkTypeNo;
                item.bizTypeName = defaultWorkType;
                item.settleTypeId = this.state.groupSettleId;
                item.settleTypeCode = this.state.groupSettleCode;
                item.settleTypeName = this.state.groupSettleType;
                item.discountRate = 1.0;
                item.qty = + this.state.number;
                item.amount = + this.state.number * item.price || 0;
                item.receivableAmount = + this.state.number * item.price || 0;
              });
              goodsDataSource = [...goodsArr, ...goodsDataSource];
            } else {
              goodsArr.map((item) => {
                item.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
                item.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
                item.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
                item.settleTypeId = this.state.groupSettleId;
                item.settleTypeCode = this.state.groupSettleCode;
                item.settleTypeName = this.state.groupSettleType;
                item.discountRate = 1.0;
                item.qty = + this.state.number;
                item.amount = + this.state.number * item.price || 0;
                item.receivableAmount = + this.state.number * item.price || 0;
              })
              goodsDataSource.splice(Glength - 1, 0, ...goodsArr)
            }
            workHoursDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.issuedQty = 0;
            });
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.issuedQty = 0;
            });
            this.setState({
              workHoursDataSource,
              goodsDataSource,
              groupVisible: false,
              groupObj: {
                carModelId: '',
                groupGoodsId: '',
                priceTypeCode: '',
                workHourlyPrice: '',
                name: ''
              },
              groupSettleCode: '',
            }, () => {
              // 重新设置key值
              this.state.workHoursDataSource.map((item, index) => {
                item.key = index + Math.random();
              });
              this.state.goodsDataSource.map((item, index) => {
                item.key = index + Math.random();
              });
              _th.calculateTotal('workHoursDataSource');
              _th.calculateTotal('goodsDataSource');
            },
            );
          },
          );
        }
      });
    },
    );
  };
  // 组合Modal显示
  cp = () => {
    const _th = this;
    if (this.state.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
      return false;
    }
    if (this.state.cusAndCarInfo.workHourlyPrice == '') {
      message.error('请输入工时单价');
      return false;
    }
    this.setState({
      groupVisible: true,
    });
    const carModelId = this.state.cusAndCarInfo.carModelId;
    const groupList = this.state.groupList;
    const defaultPayWayId = _th.state.defaultTypeValue.defaultPayWayId
    const defaultPayWayNo = _th.state.defaultTypeValue.defaultPayWayNo
    const defaultPayWay = _th.state.defaultTypeValue.defaultPayWay
    this.setState(
      {
        groupList: Object.assign({}, groupList, { carModelId }),
        groupSettleType: defaultPayWay,
        groupSettleCode: defaultPayWayNo,
        groupSettleId: defaultPayWayId,

      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.groupList);
        // 查询价格方案
        getDicDataByCategoryCode({ code: '3540' }).then((res) => {
          if (res.success) {
            this.setState(
              {
                priceLists: res.data,
              },
              () => {
                this.state.priceLists.map((item, index) => {
                  item.key = index;
                });
              },
            );
          }
        });
      },
    );
  };
  // 关闭清空字段
  CPhandleCancel = () => {
    const groupList = this.state.groupList;
    this.setState({
      groupVisible: false,
      groupObj: {
        carModelId: '',
        groupGoodsId: '',
        priceTypeCode: '',
        workHourlyPrice: '',
        name: ''
      },
      groupList: Object.assign({}, groupList, { groupName: '' }),
      groupSettleCode: '',
    });
  };

  GSwayss = (value, Option) => {
    if (value == undefined || Option == undefined) {
      this.setState({
        groupSettleType: '',
        groupSettleId: '',
        groupSettleCode: '',
      });
    } else {
      this.setState({
        groupSettleType: Option.props.children,
        groupSettleId: Option.props.id,
        groupSettleCode: value,
      });
    }
  };

  groupNameChange = (e) => {
    const value = e.target.value;
    const groupList = this.state.groupList;
    this.setState({
      groupList: Object.assign({}, groupList, { groupName: value }),
    });
  };

  groupNameEnter = (e) => {
    const _th = this;
    const value = e.target.value;
    const groupList = this.state.groupList;
    this.setState(
      {
        groupList: Object.assign({}, groupList, { groupName: value, index: 1 }),
      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.groupList);
      },
    );
  };

  QueryWorkItemPage = (data) => {
    queryWorkItemPage(data).then((res) => {
      if (res.success) {
        // console.log(res.data.items)
        const workModalTable = res.data.items;
        workModalTable.map((item, index) => {
          item.key = index;
        });
        this.setState({
          workModalTable,
          worksPageTotal: res.data.totalNumber,
        });
      }
    });
  };

  // 工时列表显示
  workHouse = () => {
    if (this.state.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
      return false;
    }
    if (this.state.cusAndCarInfo.workHourlyPrice == '') {
      message.error('请输入工时单价');
      return false;
    }
    // 拿到结算方式的默认值
    const defaultPayWayId = this.state.defaultTypeValue.defaultPayWayId
    const defaultPayWayNo = this.state.defaultTypeValue.defaultPayWayNo
    const defaultPayWay = this.state.defaultTypeValue.defaultPayWay
    const workHourlyPrice = this.state.cusAndCarInfo.workHourlyPrice;
    const carModelId = this.state.cusAndCarInfo.carModelId;
    const list = this.state.list;
    this.setState(
      {
        workVisible: true,
        list: Object.assign({}, list, { workHourlyPrice, repairCarModelId: carModelId }),
        worksSettleType: defaultPayWay,
        worksSettleCode: defaultPayWayNo,
        worksSettleId: defaultPayWayId,
      },
      () => {
        // 发送请求
        this.QueryWorkItemPage(this.state.list);
        this.getDicDataesByCategoryCode({ code: '7005' }, 'settleType'); // 获取结算方式
      },
    );
  };

  GShandleCancel = () => {
    let list = this.state.list
    this.setState({
      list: Object.assign({}, list, { keyWord: '' }),
      workVisible: false,
      number: 1,
      worksSettleType: '',
      worksSettleCode: '',
      worksSettleId: '',
    });
  };
  // 关键字改变
  keyWordChange = (e) => {
    const value = e.target.value;
    const list = this.state.list;
    this.setState({
      list: Object.assign({}, list, { keyWord: value }),
    });
  };

  // 回车关键字查询
  keyWordEnter = (e) => {
    const value = e.target.value;
    const list = this.state.list;
    this.setState(
      {
        list: Object.assign({}, list, { keyWord: value, page: 1 }),
      },
      () => {
        this.QueryWorkItemPage(this.state.list);
      },
    );
  };

  // 结算方式变化
  GSway = (value, Option) => {
    if (value == undefined || Option.props == undefined) {
      this.setState({
        worksSettleType: '',
        worksSettleCode: '',
        worksSettleId: '',
      });
    } else {
      this.setState({
        worksSettleType: Option.props.children,
        worksSettleCode: value,
        worksSettleId: Option.props.id,
      });
    }
  };

  // 工项数量变化
  XGnumberChange = (e) => {
    const value = e.target.value;
    this.setState({
      number: value,
    });
    const tabledList = this.state.tabledList;
    this.setState({
      tabledList: Object.assign({}, tabledList, { qty: value }),
    });
  };

  // 工项添加表格到
  addTabled = (record) => {
    // console.log(record)
    const _th = this;
    const tabledList = this.state.tabledList;
    if (this.state.worksSettleCode == '') {
      message.error('请选择结算方式');
      return false;
    }
    this.setState({
      tabledList: Object.assign({}, tabledList, {
        qty: +this.state.number,
        id: '',
        combo: 1,
        issuedQty: 0,
        workNeeded: 0,
        price: record.price,
        index: record.goodsId,
        goodsId: record.goodsId,
        goodsNo: record.goodsNo,
        goodsName: record.goodsName,
        key: record.goodsId,
        discountRate: 1.0,
        stdWorkHour: record.stdWorkHour,
        amount: +this.state.number * record.price || 0,
        receivableAmount: +this.state.number * record.price || 0,
      }),
    },
      () => {
        const tabledList = this.state.tabledList;
        const workHoursDataSource = this.state.workHoursDataSource;
        const length = workHoursDataSource.length;
        const {
          defaultWorkTypeId,
          defaultWorkTypeNo,
          defaultWorkType,
          defaultPayWayId,
          defaultPayWayNo,
          defaultPayWay,
        } = this.state.defaultTypeValue;
        if (length == 1) {
          // 添加第一条数据
          tabledList.bizTypeId = defaultWorkTypeId;
          tabledList.bizTypeCode = defaultWorkTypeNo;
          tabledList.bizTypeName = defaultWorkType;
          tabledList.settleTypeId = this.state.worksSettleId;
          tabledList.settleTypeCode = this.state.worksSettleCode;
          tabledList.settleTypeName = this.state.worksSettleType;
          workHoursDataSource.splice(length - 1, 0, this.state.tabledList);
          workHoursDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
          });
          let list = this.state.list
          this.setState({
            workHoursDataSource,
            workVisible: false,
            number: 1,
            list: Object.assign({}, list, { keyWord: '' }),
            worksSettleType: '',
            worksSettleCode: '',
            worksSettleId: '',
          }, () => {
            this.state.workHoursDataSource.map((item, index) => {
              item.key = index + Math.random();
            });
            _th.calculateTotal('workHoursDataSource');
          });
        } else {
          tabledList.bizTypeId = workHoursDataSource[workHoursDataSource.length - 2].bizTypeId;
          tabledList.bizTypeCode = workHoursDataSource[workHoursDataSource.length - 2].bizTypeCode;
          tabledList.bizTypeName = workHoursDataSource[workHoursDataSource.length - 2].bizTypeName;
          tabledList.settleTypeId = this.state.worksSettleId;
          tabledList.settleTypeCode = this.state.worksSettleCode;
          tabledList.settleTypeName = this.state.worksSettleType;
          workHoursDataSource.splice(length - 1, 0, this.state.tabledList);
        }
        workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
          item.issuedQty = 0;
        });
        let list = this.state.list
        this.setState({
          workHoursDataSource,
          workVisible: false,
          number: 1,
          list: Object.assign({}, list, { keyWord: '' }),
          worksSettleType: '',
          worksSettleCode: '',
          worksSettleId: '',
        }, () => {
          this.state.workHoursDataSource.map((item, index) => {
            item.key = index + Math.random();
          });
          _th.calculateTotal('workHoursDataSource');
        });
        // 清空数据
        this.setState({
          worksSettleType: '',
          worksSettleCode: '',
          worksSettleId: '',
        });
      },
    );
  };

  carType = (e) => {
    const _th = this;
    const flag = e.target.value == 0 ? 1 : 0;
    const goodsObj = this.state.goodsObj;
    this.setState(
      {
        goodsObj: Object.assign({}, goodsObj, { matchSeries: flag, index: 1 }),
      },
      () => {
        _th.QueryFastProductForPage(this.state.goodsObj);
      },
    );
  };

  kucun = (e) => {
    const _th = this;
    const flag = e.target.value == 0 ? 1 : 0;
    const goodsObj = this.state.goodsObj;
    this.setState(
      {
        goodsObj: Object.assign({}, goodsObj, { isZeroStock: flag, index: 1 }),
      },
      () => {
        _th.QueryFastProductForPage(this.state.goodsObj);
      },
    );
  };

  // 价格方案改变事件
  priceChange = (value) => {
    const _th = this;
    const goodsObj = this.state.goodsObj;
    if (value == undefined) {
      this.setState({
        goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '' }),
      });
    } else {
      this.setState(
        {
          goodsObj: Object.assign({}, goodsObj, { priceTypeCode: value }),
        },
        () => {
          // 发送请求
          _th.QueryFastProductForPage(this.state.goodsObj);
        },
      );
    }
  };

  // 结算方式改变
  wayChange = (value, Option) => {
    // console.log(Option)
    if (value == undefined || Option == undefined) {
      this.setState({
        goodsSettleWay: '',
        goodsSettleId: '',
        goodsSettleCode: '',
      });
    } else {
      this.setState({
        goodsSettleWay: Option.props.children,
        goodsSettleId: Option.props.id,
        goodsSettleCode: value,
      });
    }
  };

  // 商品模态框显示
  goods = () => {
    const _th = this;
    if (this.state.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
    } else {
      const id = this.state.cusAndCarInfo.carModelId;
      const goodsObj = this.state.goodsObj;
      // 拿到结算方式的默认值
      const defaultPayWayId = _th.state.defaultTypeValue.defaultPayWayId
      const defaultPayWayNo = _th.state.defaultTypeValue.defaultPayWayNo
      const defaultPayWay = _th.state.defaultTypeValue.defaultPayWay
      getDicDataByCategoryCode({ code: '3540' }).then((res) => {
        if (res.success) {
          this.setState(
            {
              priceLists: res.data,
            },
            () => {
              this.state.priceLists.map((item, index) => {
                item.key = index;
              });
            },
          );
        }
      });

      this.setState(
        {
          goodsVisible: true,
          goodsObj: Object.assign({}, goodsObj, { carModelId: id }),
          goodsSettleWay: defaultPayWay,
          goodsSettleCode: defaultPayWayNo,
          goodsSettleId: defaultPayWayId,
        },
        () => {
          // 发送请求获取数据
          _th.QueryFastProductForPage(this.state.goodsObj);
        },
      );
    }
  };
  // 查询
  QueryFastProductForPage = (data) => {
    queryFastProductForPage(data).then((res) => {
      // console.log(res)
      if (res.success) {
        const goodList = res.data.items;
        goodList.map((item, index) => {
          item.key = index;
        });
        this.setState({
          goodList: res.data.items,
          worksPageTotal: res.data.totalNumber,
        });
      }
    });
  };
  // 回车查询
  OemEnter = (e) => {
    const value = e.target.value;
    const _th = this;
    const goodsObj = this.state.goodsObj;
    this.setState(
      {
        goodsObj: Object.assign({}, goodsObj, { goodsName: value, index: 1 }),
      },
      () => {
        // 发送请求
        _th.QueryFastProductForPage(this.state.goodsObj);
      },
    );
  };

  OemChange = (e) => {
    const value = e.target.value;
    const goodsObj = this.state.goodsObj;
    this.setState({
      goodsObj: Object.assign({}, goodsObj, { goodsName: value }),
    });
  };

  onCurrentPage = (current) => {
    const _th = this;
    const goodsObj = this.state.goodsObj;
    this.setState(
      {
        pagecurrent: current,
        goodsObj: Object.assign({}, goodsObj, { index: current }),
      },
      () => {
        _th.QueryFastProductForPage(this.state.goodsObj);
      },
    );
  };

  // 商品关闭清空字段
  GPhandleCancel = () => {
    const goodsObj = this.state.goodsObj;
    this.setState({
      number: 1,
      goodsVisible: false,
      goodsSettleWay: '',
      goodsSettleId: '',
      goodsSettleCode: '',
      goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 }),
    });
  };

  // 商品数量变化
  GPnumberChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        number: value,
      },
    );
  };
  // 将商品添加到表格
  ToTabled = (record) => {
    // console.log('record',record)
    const _th = this;
    if (record.workNeeded == 1) {
      // 在判断一次如果表格中存在就不在添加万能工项
      const Boolen = this.state.workHoursDataSource.some(item => item.goodsNo == 99999999);
      if (!Boolen) {
        // 添加万能工项
        const tabledList = {
          key: record.goodsId,
          index: record.goodsId,
          workHoursNum: 1,
          id: '', // 主键ID,
          workNeeded: 1, //
          combo: 1,
          goodsId: '', // 商品ID,
          goodsNo: '', // 商品编码,
          goodsName: '', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.state.jdId, // 结算方式ID,
          settleTypeCode: this.state.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.state.goodsSettleWay, // 结算方式名称,
          price: '', // 单价,
          qty: + this.state.number, // 数量,
          amount: '', // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: '', // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          mfgGoodsNo: record.mfgGoodsNo,
          oemGoodsNo: record.oemGoodsNo,
          goodsUnit: '件',
          goodsIssueNeeded: record.goodsIssueNeeded,
          // workNeeded:item.workNeeded
        };
        const workTime = {
          key: Math.random() + 1000,
          goodsNo: '',
          index: Math.random() + 1000,
          workHoursNum: 1,
          id: "", // 主键ID,
          workNeeded: 1, // 1表示万能工时
          combo: 1,
          goodsId: _th.state.wnwokr[0].id, // 商品ID,
          goodsNo: _th.state.wnwokr[0].dicCode, // 商品编码,
          goodsName: '万能工项', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.state.jdId, // 结算方式ID,
          settleTypeCode: this.state.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.state.goodsSettleWay, // 结算方式名称,
          price: 0, // 单价,
          qty: 1, // 数量,
          amount: 0, // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
        };
        this.setState({
          tabledList: Object.assign({}, tabledList, {
            modification: record.modification,
            price: record.price,
            index: record.goodsId,
            goodsId: record.goodsId,
            goodsNo: record.goodsNo,
            goodsName: record.goodsName,
            key: record.goodsId,
            goodsIssueNeeded: record.goodsIssueNeeded,
          }),
        }, () => {
          const tabledList = this.state.tabledList;
          const goodsDataSource = this.state.goodsDataSource;
          const workHoursDataSource = this.state.workHoursDataSource;
          const wlength = workHoursDataSource.length;
          const length = goodsDataSource.length;
          const {
            defaultWorkTypeId,
            defaultWorkTypeNo,
            defaultWorkType,
            defaultPayWayId,
            defaultPayWayNo,
            defaultPayWay,
          } = this.state.defaultTypeValue;
          // 商品
          if (length == 1) {
            // 添加第一条数据
            tabledList.bizTypeId = defaultWorkTypeId;
            tabledList.bizTypeCode = defaultWorkTypeNo;
            tabledList.bizTypeName = defaultWorkType;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            this.setState({
              goodsDataSource,
              goodsVisible: false,
              number: 1,
            }, () => {
              this.state.goodsDataSource.map((item, index) => {
                if (item.goodsName == '万能工项') {
                  item.key = Math.random() + 10000000;
                  item.index = Math.random() * 2 + index;
                } else {
                  item.key = index + Math.random() * 2 + Math.random() * 3;
                }
              });
              _th.calculateTotal('goodsDataSource');
            },
            );
            // 清空字段(bug)
            const goodsObj = this.state.goodsObj;
            this.setState({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.amount = item.qty * item.price || 0;
            });
            this.setState({
              goodsDataSource,
              goodsVisible: false,
              number: 1,
            }, () => {
              this.state.goodsDataSource.map((item, index) => {
                item.key = index + Math.random() * 2 + Math.random() * 3;
              });
              _th.calculateTotal('goodsDataSource');
            });
          }
          workTime.bizTypeId = defaultWorkTypeId;
          workTime.bizTypeCode = defaultWorkTypeNo;
          workTime.bizTypeName = defaultWorkType;
          workTime.settleTypeId = this.state.goodsSettleId;
          workTime.settleTypeCode = this.state.goodsSettleCode;
          workTime.settleTypeName = this.state.goodsSettleWay;
          workTime.discountRate = 1.0
          workTime.amount = 0;
          workTime.receivableAmount = 0;
          workHoursDataSource.unshift(workTime);
          workHoursDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
          });
          this.setState({
            workHoursDataSource,
            goodsVisible: false,
            number: 1,
          }, () => {
            this.state.workHoursDataSource.map((item, index) => {
              item.key = index + Math.random() * 2 + Math.random() * 3;
            });
            _th.calculateTotal('goodsDataSource');
          });
        });
      } else {
        //  不用添加万能工项
        const tabledList = {
          key: record.goodsId,
          goodsNo: '',
          index: record.goodsId,
          workHoursNum: 1,
          id: '', // 主键ID,
          workNeeded: 1,
          combo: 1,
          goodsId: '', // 商品ID,
          goodsNo: '', // 商品编码,
          goodsName: '', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.state.jdId, // 结算方式ID,
          settleTypeCode: this.state.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.state.goodsSettleWay, // 结算方式名称,
          price: '', // 单价,
          qty: this.state.number, // 数量,
          amount: '', // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: '', // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          mfgGoodsNo: record.mfgGoodsNo,
          oemGoodsNo: record.oemGoodsNo,
          goodsUnit: '件',
          goodsIssueNeeded: record.goodsIssueNeeded,
          // workNeeded:item.workNeeded

        };
        this.setState({
          tabledList: Object.assign({}, tabledList, {
            modification: record.modification,
            price: record.price,
            index: record.goodsId,
            goodsId: record.goodsId,
            goodsNo: record.goodsNo,
            goodsName: record.goodsName,
            key: record.goodsId,
            mfgGoodsNo: record.mfgGoodsNo,
            oemGoodsNo: record.oemGoodsNo,
            goodsIssueNeeded: record.goodsIssueNeeded,
            goodsUnit: '件'
          }),
        }, () => {
          const tabledList = this.state.tabledList;
          const goodsDataSource = this.state.goodsDataSource;
          const length = goodsDataSource.length;
          const {
            defaultWorkTypeId,
            defaultWorkTypeNo,
            defaultWorkType,
            defaultPayWayId,
            defaultPayWayNo,
            defaultPayWay,
          } = this.state.defaultTypeValue;
          if (length == 1) {
            // 添加第一条数据
            tabledList.bizTypeId = defaultWorkTypeId;
            tabledList.bizTypeCode = defaultWorkTypeNo;
            tabledList.bizTypeName = defaultWorkType;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            this.setState(
              {
                goodsDataSource,
                goodsVisible: false,
                number: 1,
              },
              () => {
                this.state.goodsDataSource.map((item, index) => {
                  item.key = index + Math.random() * 2 + Math.random() * 3;
                });

                _th.calculateTotal('goodsDataSource');
              },
            );
            // 清空字段(bug)
            const goodsObj = this.state.goodsObj;
            this.setState({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0

            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            this.setState(
              {
                goodsDataSource,
                goodsVisible: false,
                number: 1,
              },
              () => {
                this.state.goodsDataSource.map((item, index) => {
                  item.key = index + Math.random() * 2 + Math.random() * 3;
                });
                _th.calculateTotal('goodsDataSource');
              },
            );
            // 清空字段(bug)
            const goodsObj = this.state.goodsObj;
            this.setState({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          }
        },
        );
      }
    } else {
      // 不用添加
      const tabledList = {
        key: record.goodsId,
        goodsNo: '',
        index: record.goodsId,
        workHoursNum: 1,
        id: '', // 主键ID,
        workNeeded: 0,
        combo: 1,
        goodsId: '', // 商品ID,
        goodsNo: '', // 商品编码,
        goodsName: '', // 商品名称,
        goodsTypeId: '', // 商品类型ID,
        goodsTypeCode: '', // 商品类型编码,
        goodsTypeName: '', // 商品类型名称（材料 or 施工）,
        bizTypeId: '', // 业务类型ID,
        bizTypeCode: '', // 业务类型编码,
        bizTypeName: '', // 业务类型名称,
        settleTypeId: this.state.jdId, // 结算方式ID,
        settleTypeCode: this.state.goodsSettleCode, // 结算方式编码,
        settleTypeName: this.state.goodsSettleWay, // 结算方式名称,
        price: '', // 单价,
        qty: + this.state.number, // 数量,
        amount: '', // 金额,
        discountRate: 1, // 折扣率,
        receivableAmount: '', // 应收金额,
        technicianEmpId: '', // 技师员工ID (施工),
        technicianEmpName: '', // 技师员工姓名 (施工),
        issuedQty: 0, // 已发料数量 (材料)
        mfgGoodsNo: record.mfgGoodsNo,
        oemGoodsNo: record.oemGoodsNo,
        goodsUnit: '件',
        goodsIssueNeeded: record.goodsIssueNeeded,
        // workNeeded:item.workNeeded
      };
      this.setState({
        tabledList: Object.assign({}, tabledList, {
          modification: record.modification,
          price: record.price,
          index: record.goodsId,
          goodsId: record.goodsId,
          goodsNo: record.goodsNo,
          goodsName: record.goodsName,
          key: record.goodsId,
          goodsIssueNeeded: record.goodsIssueNeeded
        }),
      },
        () => {
          // 拿到这个对象加入的数组中并且清空里面的数据
          const tabledList = this.state.tabledList;
          const goodsDataSource = this.state.goodsDataSource;
          const length = goodsDataSource.length;
          const {
            defaultWorkTypeId,
            defaultWorkTypeNo,
            defaultWorkType,
            defaultPayWayId,
            defaultPayWayNo,
            defaultPayWay,
          } = this.state.defaultTypeValue;
          if (length == 1) {
            // 添加第一条数据
            tabledList.bizTypeId = defaultWorkTypeId;
            tabledList.bizTypeCode = defaultWorkTypeNo;
            tabledList.bizTypeName = defaultWorkType;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0;
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            this.setState({
              goodsDataSource,
              goodsVisible: false,
              number: 1,
            }, () => {
              this.state.goodsDataSource.map((item, index) => {
                item.key = index + Math.random() * 2 + Math.random() * 3;
              });
              _th.calculateTotal('goodsDataSource');
            });
            // 清空字段(bug)
            const goodsObj = this.state.goodsObj;
            this.setState({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.goodsSettleId;
            tabledList.settleTypeCode = this.state.goodsSettleCode;
            tabledList.settleTypeName = this.state.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            this.setState({
              goodsDataSource,
              goodsVisible: false,
              number: 1,
            }, () => {
              this.state.goodsDataSource.map((item, index) => {
                item.key = index + Math.random() * 2 + Math.random() * 3;
              });
              _th.calculateTotal('goodsDataSource');
            },
            );
          }
          // 清空字段(bug)
          const goodsObj = this.state.goodsObj;
          this.setState({
            goodsSettleWay: '',
            goodsSettleId: '',
            goodsSettleCode: '',
            goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 }),
          });
        },
      );
    }
  };

  TChandleCancel = () => {
    const obj = this.state.obj;
    this.setState({
      comboVisible: false,
      number: 1,
      obj: Object.assign({}, obj, { comboName: '' })
    });
  };

  // 套餐数量的变化
  numberChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        number: value,
      },
    );
    this.state.goodsLists.map((item, index) => {
      item.qty = value;
    });
    this.state.worksLists.map((item, index) => {
      item.qty = value;
    });
  };
  // linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
  //   cusName: '', // 客户姓名,
  //   cusGenderId: '', // 客户性别ID,
  //   cusGenderName: '', // 客户性别名称,
  //   cusMobileNo: '', // 联系电话,
  //   cusProvinceId: '', // 客户所在省份ID,
  //   cusProvinceName: '', // 客户所在省份名称,
  //   cusCityId: '', // 客户所在城市ID,
  //   cusCityName: '', // 客户所在城市名称,
  //   cusRegionId: '', // 客户所在区ID,
  //   cusRegionName: '', // 客户所在区名称,
  //   cusStreetAddress: '', // 客户所在街道地址
  // }),
  Blur = (event) => {
    let value = event.target.value
    this.props.form.validateFields(
      ['cuMobileNo'],
      (err) => {
        if (!err) {
          // 发送请求带出联系人数据
          getPersonalCustomerByMobileNo({ mobileNo: value }).then(res => {
            // console.log(res.data)
            if (res.data) {
              let linkCustomerInfoDto = this.state.linkCustomerInfoDto
              this.setState({
                linkCustomerInfoDto: Object.assign({}, linkCustomerInfoDto, {
                  cusName: res.data.cusName, // 客户姓名,
                  cusGenderId: res.data.cusGenderId, // 客户性别ID,
                  cusGenderName: res.data.cusGenderName, // 客户性别名称,
                  cusMobileNo: res.data.cusMobileNo, // 联系电话,
                  cusProvinceId: res.data.cusProvinceId, // 客户所在省份ID,
                  cusProvinceName: res.data.cusProvinceName, // 客户所在省份名称,
                  cusCityId: res.data.cusCityId, // 客户所在城市ID,
                  cusCityName: res.data.cusCityName, // 客户所在城市名称,
                  cusRegionId: res.data.cusRegionId, // 客户所在区ID,
                  cusRegionName: res.data.cusRegionName, // 客户所在区名称,
                  cusStreetAddress: res.data.cusStreetAddress, // 客户所在街道地址
                })
              })
            }

          })
        }
      },
    );
  }


  // hjf end

  render() {
    const _th = this;
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const {
      cusAndCarInfo,
      addCarSave,
      customerInfoDto,
      linkCustomerInfoDto,
      carInfoDto,
      dropDownWorkHoursTable,
      dropDownGoodsTable,
      fetching,
      fetchs,
      selectedWorkHoursRowKeys,
      workHoursDataSource,
      goodsDataSource,
      cusUpdateInfo,
      carUpdateInfo: { cusCarInfoFastlyDto },
      carUpdateInfo,
      historyFastlyInfo,
      cusUpdateFlag,
      workBizType,
      settleType,
      scEmp,
      workHoursTotalMoney,
      workHoursReceiveMoney,
      workHoursTotalNum,
      goodsTotalMoney,
      goodsReceiveMoney,
      goodsTotalNum,
      selectedGoodsRowKeys,
      infoData,
      workModalDataSource,
      goodModalDataSource,
      stockDataSource,
      orderType,
    } = this.state;
    const ml10 = { marginLeft: '10px' };
    const w100p = { width: '100%' };
    const RadioGroup = Radio.Group;

    // hjf start

    const GPcolumns = [
      {
        title: 'OEM编码',
        key: 'name',
        render: record => <span>{record.oemGoodsNo}</span>,
      },
      {
        title: '商品名称',
        key: 'age',
        render: record => <span>{record.goodsName}</span>,
      },
      {
        title: '价格',
        key: 'address',
        render: record => <span>{record.price}</span>,
      },
      {
        title: '库存量',
        key: '9999999999',
        render: record => <span>{record.qty}</span>,
      },
      {
        title: '可用库存量',
        key: '000000',
        render: record => <span>{record.usableQty}</span>,
      },
      {
        title: '操作',
        key: '5555555',
        render: record => (
          <Button onClick={this.ToTabled.bind(this, record)} type='primary'>
            选择加入
          </Button>
        ),
      },
    ];

    const CPcolumns = [
      {
        title: '组合',
        key: 'name',
        render: record => <span>{record.groupName}</span>,
      },
      {
        title: '备注',
        key: 'address',
        render: record => <span>{record.remark}</span>,
      },
      {
        title: '操作',
        key: '11111111',
        render: record => (
          <Button onClick={this.adddWHG.bind(this, record)} type='primary'>
            选择加入
          </Button>
        ),
      },
    ];

    const columns = [
      {
        title: '工项编码',
        key: 'name',
        render: record => <span>{record.goodsNo}</span>,
      },
      {
        title: '工项名称',
        key: 'age',
        render: record => <span>{record.goodsName}</span>,
      },
      {
        title: '价格',
        key: 'address',
        render: record => <span>{record.price}</span>,
      },
      {
        title: '操作',
        key: '6666',
        render: record => (
          <Button type='primary' onClick={this.addTabled.bind(this, record)}>
            选择加入
          </Button>
        ),
      },
    ];

    const expandedRowRender = () => {
      const tccolumns = [
        { title: '编码', key: 'date', render: record => <span>{record.goodsNo}</span> },
        { title: '名称', key: 'name', render: record => <span>{record.goodsName}</span> },
        { title: '价格', key: 'state', render: record => <span>{record.price}</span> },
      ];
      return <Table columns={tccolumns} dataSource={infoData} pagination={false} bordered />;
    };
    const taocaicolumns = [
      {
        title: '套餐编码',
        key: 'name',
        render: record => <span>{record.comboNo}</span>,
      },
      {
        title: '套餐名称',
        key: 'platform',
        render: record => <span>{record.comboName}</span>,
      },
      {
        title: '套餐价格',
        key: 'version',
        render: record => <span>{record.comboRetailGuidePrice}</span>,
      },
      {
        title: '备注',
        key: 'upgradeNum',
        render: record => <span>{record.remark}</span>,
      },
      {
        title: '操作',
        key: 'operation',
        render: record => (
          <Button type='primary' onClick={this.AddTableds.bind(this, record)}>
            选择加入
          </Button>
        ),
      },
    ];
    // hjf end

    // 列表数据
    const workHoursColumns = [
      {
        title: '序号',
        key: 'workHoursNum',
        dataIndex: 'workHoursNum',
        width: 50,
      },
      {
        title: '工项编码',
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        width: 250,
        align: 'center',
        cellOption: {
          inputType: 'tableSelect',
        },
      },
      {
        title: '工项名称',
        key: 'goodsName',
        dataIndex: 'goodsName',
        width: 200,
        render: (text, record) => (
          <Input
            onChange={this.inputChange.bind(event, 'goodsName', record)}
            value={record.goodsName}
            style={{ display: record.index == 0 ? 'none' : 'inline-block' }}
            disabled={record.workNeeded == 0}
          />
        ),
      },
      {
        title: '业务类型',
        key: 'bizTypeName',
        dataIndex: 'bizTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option, id) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'select',
            optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
            onChange: (row, option) => {
              this.handleHeadSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
            },
          } : {}
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'workHoursDataSource');
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'select',
            optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
            onChange: (row, option) => {
              this.handleHeadSelectChange(row, option, 'settleTypeName', 'workHoursDataSource');
            },
          } : {}
      },
      {
        title: '价格',
        key: 'price',
        dataIndex: 'price',
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          isFirstFocus: true,
          precision: 2,
          getCellRestProps: record => ({
            disabled: record.workNeeded == 0, // 万能工时才可编辑
          }),
          initialValue: 0,
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
        },
      },
      {
        title: '数量',
        key: 'qty',
        dataIndex: 'qty',
        editable: true,
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          isFirstFocus: true,
          initialValue: 0,
          rules: [
            { validatorFn: value => !!value, errMsg: '请输入数量' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId || record.inWorkProcessQty > 0,
          }),
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
        },
      },
      {
        title: '金额',
        key: 'amount',
        dataIndex: 'amount',
        width: 130,
        render: (text, record) => (
          <span style={{ display: record.index == 0 ? 'none' : 'inline-block' }}>
            {record.amount}
          </span>
        ),
      },
      {
        title: '折扣率',
        key: 'discountRate',
        dataIndex: 'discountRate',
        width: 130,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.0001,
          precision: 4,
          rules: [
            { validatorFn: value => !!value || value == 0, errMsg: '请输入折扣率' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
          }),
          range: [0, 1],
          rules: [
            {
              validatorFn: value => Number(value) <= 1,
              errMsg: '请输入0.0000-1.0000有效数字',
            },
          ],
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'inputNumber',
            step: 0.0001,
            precision: 4,
            placeholder: '0.0000-1.0000',
            rules: [
              { required: true, message: '请输入批量折扣率' },
              {
                validator: (rule, value, cb) => (value > 1 ? cb(true) : cb()),
                message: '请输入0.0000-1.0000有效数字',
              },
            ],
            onChange: (value, key) => {
              this.handleBatchSubmit(value, key, 'workHoursDataSource');
            },
          } : {}
      },
      {
        title: '应收金额',
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        width: 180,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
          rules: [
            { validatorFn: value => value >= 0, errMsg: '请输入应收金额' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
          }),
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'inputNumber',
            step: 0.01,
            precision: 2,
            placeholder: '请输入优惠总金额',
            rules: [{ required: true, message: '请输入优惠总金额，自动分到每个项目' }],
            onChange: (value, key) => {
              this.handleBatchSubmit(value, key, 'workHoursDataSource');
            },
          } : {}
      },
      // {
      //   title: '技师',
      //   key: 'technicianEmpName',
      //   dataIndex: 'technicianEmpName',
      //   width: 180,
      //   cellOption: {
      //     inputType: 'select',
      //     optionRender: this.getOptionRender(scEmp, { key: 'key', code: 'code', name: 'name' }),
      //     onChange: (row, option) => {
      //       this.handleSelectChange(row, option, 'technicianEmpName', 'workHoursDataSource');
      //     },
      //   },
      // },
    ];
    const dropDownWorkHoursColumns = [
      { key: 'goodsNo', title: '工项编码', width: 25 },
      { key: 'goodsName', title: '工项名称', width: 35 },
      { key: 'price', title: '价格', width: 15 },
    ];
    const goodsColumns = [
      {
        title: '序号',
        key: 'workHoursNum',
        dataIndex: 'workHoursNum',
        width: 50,
      },
      {
        title: '商品编码',
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        width: 200,
        align: 'center',
        cellOption: {
          inputType: 'tableSelect',
        },
      },
      {
        title: '商品名称',
        key: 'goodsName',
        dataIndex: 'goodsName',
        width: 200,
      },
      {
        title: '业务类型',
        key: 'bizTypeName',
        dataIndex: 'bizTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'select',
            optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
            onChange: (row, option) => {
              this.handleHeadSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
            },
          } : {}
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'goodsDataSource');
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'select',
            optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
            onChange: (row, option) => {
              this.handleHeadSelectChange(row, option, 'settleTypeName', 'goodsDataSource');
            },
          } : {}
      },
      {
        title: '单价',
        key: 'price',
        dataIndex: 'price',
        width: 120,
        render: (text, record) => (
          <span style={{ display: record.index == 0 ? 'none' : 'inline-block' }}>
            {record.price}
          </span>
        ),
      },
      {
        title: '数量',
        key: 'qty',
        dataIndex: 'qty',
        editable: true,
        type: 'inputNumber',
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          isFirstFocus: true,
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
          }),
          rules: [
            { validatorFn: value => !!value, errMsg: '请输入数量' },
          ],
          onChange: (row, a, b, key) => {
            this.goodsRowValue(row, key);
          },
        },
      },
      {
        title: '金额',
        key: 'amount',
        dataIndex: 'amount',
        width: 120,
        render: (text, record) => (
          <span style={{ display: record.index == 0 ? 'none' : 'inline-block' }}>
            {record.amount}
          </span>
        ),
      },
      {
        title: '折扣率',
        key: 'discountRate',
        dataIndex: 'discountRate',
        width: 130,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.0001,
          range: [0, 1],
          precision: 4,
          rules: [
            { validatorFn: value => !!value || value == 0, errMsg: '请输入折扣率' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
          }),
          rule: {
            validatorFn: value => Number(value) <= 1,
            errMsg: '请输入0.0000-1.0000有效数字',
          },
          onChange: (row, a, b, key) => {
            this.goodsRowValue(row, key);
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'inputNumber',
            step: 0.0001,
            range: [0, 1],
            precision: 4,
            placeholder: '0.0000-1.0000',
            rules: [
              { required: true, message: '请输入批量折扣率' },
              {
                validator: (rule, value, cb) => (value > 1 ? cb(true) : cb()),
                message: '请输入0.0000-1.0000有效数字',
              },
            ],
            onChange: (value, key) => {
              this.handleBatchSubmit(value, key, 'goodsDataSource');
            },
          } : {}
      },
      {
        title: '应收金额',
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        width: 150,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
          rules: [
            { validatorFn: value => value >= 0, errMsg: '请输入应收金额' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
          }),
          onChange: (row, a, b, key) => {
            this.goodsRowValue(row, key);
          },
        },
        headerOption: this.state.jy == false ?
          {
            actionType: 'batchOperation',
            inputType: 'inputNumber',
            step: 0.01,
            precision: 2,
            placeholder: '请输入优惠总金额',
            rules: [{ required: true, message: '请输入优惠总金额，自动分到每个项目' }],
            onChange: (value, key) => {
              this.handleBatchSubmit(value, key, 'goodsDataSource');
            },
          } : {}
      },
      {
        title: '发料数量',
        key: 'issuedQty',
        dataIndex: 'issuedQty',
        width: 100,
        render: (text, record) => (
          <span style={{ display: record.index == 0 ? 'none' : 'inline-block' }}>
            {record.issuedQty}
          </span>
        ),
      },
    ];
    const dropDownGoodsColumns = [
      { key: 'oemGoodsNo', title: 'OEM编码', width: 25 },
      { key: 'goodsName', title: '商品名称', width: 35 },
      { key: 'price', title: '单价', width: 15 },
      { key: 'qty', title: '库存量', width: 15 },
      { key: 'usableQty', title: '可用库存', width: 15 },
    ];
    const carUpdateColumns = [
      {
        title: '车牌号',
        key: 'carPlateNo',
        dataIndex: 'carPlateNo',
        align: 'center',
        width: 180,
      },
      {
        title: 'VIN',
        key: 'vin',
        dataIndex: 'vin',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        align: 'center',
        width: 150,
        render: (text, record) =>
          (cusCarInfoFastlyDto.length >= 1 ? (
            <span>
              <a href='javascript:;' disabled={this.state.jy} onClick={() => this.carUpdateEdit(record)}>
                编辑
              </a>
              {/* 代码暂时保留 */}
              {/* <Divider type='vertical' />
              <Popconfirm title='是否确认删除?' onConfirm={() => this.carUpdateDelete(record)}>
                <a href='javascript:;' disabled={this.state.jy}>删除</a>
              </Popconfirm>*/}
            </span>
          ) : null),
      },
    ];
    const historyColumns = [
      {
        title: '工单号',
        key: 'woNo',
        dataIndex: 'woNo',
        align: 'center',
        width: 180,
        render: (text, record) => (
          <span
            disabled={this.state.jy}
            onClick={this.historyUpdateSee.bind(this, record)}
            style={{ cursor: 'pointer', color: '#352C74' }}
          >
            {record.woNo}
          </span>
        ),
      },
      {
        title: '结算日期',
        key: 'settleDate',
        dataIndex: 'settleDate',
        align: 'center',
        width: 200,
      },
      {
        title: '业务类型',
        key: 'bizTypeName',
        dataIndex: 'bizTypeName',
        align: 'center',
        width: 200,
      },
      {
        title: '结算金额',
        key: 'amount',
        dataIndex: 'amount',
        align: 'center',
        width: 200,
      },
    ];
    const stockColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '商品编码',
        width: 65,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '商品名称',
        width: 65,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '商品类型',
        width: 50,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 50,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '需求数量',
        width: 25,
      },
      {
        key: 'inventoryQty',
        dataIndex: 'inventoryQty',
        title: '库存数量',
        width: 25,
      },
    ];
    const workModalColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '工项编码',
        width: 60,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '工项名称',
        width: 60,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '工项类型',
        width: 40,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 40,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '数量',
        width: 15,
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: '单价',
        width: 20,
      },
      {
        key: 'amount',
        dataIndex: 'amount',
        title: '金额',
        width: 25,
      },
      {
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        title: '应收金额',
        width: 25,
      },
    ];
    const goodModalColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '商品编码',
        width: 60,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '商品名称',
        width: 60,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '商品类型',
        width: 40,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 40,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '数量',
        width: 15,
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: '单价',
        width: 20,
      },
      {
        key: 'amount',
        dataIndex: 'amount',
        title: '金额',
        width: 25,
      },
      {
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        title: '应收金额',
        width: 25,
      },
    ];

    const workHoursRowSelection = {
      selectedRowKeys: selectedWorkHoursRowKeys,
      getCheckboxProps: record => ({
        style: {
          display: record.index === 0 ? 'none' : 'inline-block',
        },
      }),
      onSelect: this.workHoursSelectRow,
      onSelectAll: this.workHoursSelectAll,
    };
    const goodsRowSelection = {
      selectedRowKeys: selectedGoodsRowKeys,
      getCheckboxProps: record => ({
        style: {
          display: record.index === 0 ? 'none' : 'inline-block',
        },
      }),
      onSelect: this.goodsSelectRow,
      onSelectAll: this.goodsSelectAll,
    };

    // hjf start
    const Tcolumns = [
      {
        title: '套餐编码',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href='javascript:;'>{text}</a>,
      },
      {
        title: '套餐名称',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '套餐价格',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '备注',
        dataIndex: '',
        key: 'bz',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href='javascript:;'>Invite {record.name}</a>
          </span>
        ),
      },
    ];

    // hjf end
    // 下拉框
    const settleTypeChildren = this.state.settleType.map(item => (
      // 油表
      <Option key={item.key} id={item.id} value={item.dicCode}>
        {item.dicValue}
      </Option>
    ));
    const fuelMeterScaleChildren = this.state.fuelMeterScale.map(item => (
      // 油表
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const bizTypeChildren = this.state.workBizType.map(item => (
      // 业务类型
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const scEmpChildren = this.state.scEmp.map(item => (
      // 服务接待
      <Option key={item.key} value={item.key} name={item.name}>
        {item.name}
      </Option>
    ));
    const workHourlyPriceChildren = this.state.workHourlyPrice.map(item => (
      // 工时单价
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const cusTypeNameChildren = this.state.cusType.map(item => (
      // 客户类型
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const cusGenderChildren = this.state.cusGender.map(item => (
      // 性别
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const carPowerTypeChildren = this.state.carPowerType.map(item => (
      // 动力类型
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const insBranchChildren = this.state.insBranch.map(item => (
      // 保险公司
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const carUsageChildren = this.state.carUsage.map(item => (
      // 用途
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const carPreChildren = this.state.carPre.map(item => (
      // 车牌前缀
      <Option key={item.key} value={item.code} name={item.name}>
        {item.name}
      </Option>
    ));
    const priceListsChildren = this.state.priceLists.map(item => (
      <Option key={item.id} value={item.dicCode}>
        {item.dicValue}
      </Option>
    ));


    // 表单
    const { getFieldDecorator } = this.props.form;
    // hjf
    const { form: { validateFields } } = this.props;
    const formSpanLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
      },
    };
    const formSmallLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
    };
    const formInputLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 22, offset: 2 },
        sm: { span: 22, offset: 2 },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: this.state.carInfoDto.carPlateTypeName,
    })(<Select style={{ width: 70 }} onChange={this.statesChange.bind(event, 'prefix')}>
      {carPreChildren}
    </Select>);
    const workHoursFooter = this.getTableFooterRender(
      workHoursTotalMoney,
      workHoursTotalNum,
      workHoursReceiveMoney,
    );

    const goodsFooter = this.getTableFooterRender(
      goodsTotalMoney,
      goodsTotalNum,
      goodsReceiveMoney,
    );
    const workHourHeader = this.getTableHeaderRender('workHour');
    const goodsHeader = this.getTableHeaderRender('goods');

    // 限制日期
    function disabledDate(current) {
      // 小于当前日期不能选
      return current < moment().subtract(1, "days")
    }

    return (
      <Root>
      <p className='list-page_title'>装潢工单</p>
        <Col span={22}>
          <Spin spinning={this.state.listLoading} indicator={antIcon} tip='加载中'>
            <Row span={24}>
              <Col sm={23} md={12} lg={5} className='pr20'>
                <FormItem {...formInputLayout} label=''>
                  <div style={w100p}>
                    {this.state.jy == false ?
                      <PersonAndCar
                        callback={this.carOwnerCusNameChange.bind(this)}
                        addCar={this.addCarAndMan}
                        placeholder='手机号/车牌号/姓名/VIN'
                        disabled={orderType == 'editEo'}
                      /> : null}
                  </div>
                </FormItem>
              </Col>
              <Col sm={23} md={11} lg={3} offset={1} className='pr20'>
                <FormItem {...formLayout} label='状态'>
                  <span>{this.state.cusAndCarInfo.woStatusName}</span>
                </FormItem>
              </Col>
              <Col sm={24} md={12} lg={5} className='pr20'>
                <FormItem {...formLayout} label='工单号'>
                  <span>{this.state.cusAndCarInfo.woNo}</span>
                </FormItem>
              </Col>
              <Col sm={24} md={12} lg={4} className='pr20'>
                <FormItem {...formLayout} label='制单人'>
                  <span>{this.state.cusAndCarInfo.woCreatorEmpName}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='创建时间'>
                  <span>
                    {cusAndCarInfo.woCreateDate || moment().format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='客户姓名'>
                  {getFieldDecorator('cusNama', {
                    initialValue: this.state.cusAndCarInfo.cusName,
                    rules: [
                      {
                        required: true,
                        message: '车主姓名不能为空！',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='联系电话'>
                  <Input value={this.state.cusAndCarInfo.cusContactPhone} disabled />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='会员号'>
                  <Input value={this.state.cusAndCarInfo.memberNo} disabled />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='VIN'>
                  <Input value={this.state.cusAndCarInfo.vin} disabled />
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='车牌:'>
                  <Input value={this.state.cusAndCarInfo.carPlateNo} disabled />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='发动机号'>
                  <div style={w100p}>
                    <Input value={this.state.cusAndCarInfo.carEngineeNo} disabled />
                  </div>
                </FormItem>
              </Col>
              <Col span={12} className='pr20'>
                <FormItem {...formSpanLayout} label='车型'>
                  <Input value={this.state.cusAndCarInfo.carModelName} disabled />
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='车辆颜色'>
                  <Input value={this.state.cusAndCarInfo.carColor} disabled />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='动力类型'>
                  <Input value={this.state.cusAndCarInfo.carPowerTypeName} disabled />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='油表信息'>
                  {getFieldDecorator('fuelMeterScaleName', {
                    initialValue: this.state.cusAndCarInfo.fuelMeterScaleName,
                    rules: [
                      {
                        required: true,
                        message: '油表信息不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    onChange={this.statesChange.bind(event, 'fuelMeterScaleName')}
                    disabled={this.state.jy}
                  >
                    {fuelMeterScaleChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='工时单价'>
                  {getFieldDecorator('workHourlyPrice', {
                    initialValue: this.state.cusAndCarInfo.workHourlyPrice,
                    rules: [
                      {
                        required: true,
                        message: '工时单价不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    disabled={this.state.jy}
                    onChange={this.changeStdPrice.bind(event)}
                  >
                    {workHourlyPriceChildren}
                  </Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='预计交车'>
                  {getFieldDecorator('estimatedCarDeliveryDate', {
                    initialValue: cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate) : null,
                    rules: [
                      {
                        required: true,
                        message: '预计交车不能为空！',
                      },
                    ],
                  })(<LocaleProvider locale={zh_CN}>
                    <DatePicker
                      style={w100p}
                      showTime
                      disabledDate={disabledDate}
                      onChange={this.singleDateChange.bind(event, 'estimatedCarDeliveryDate')}
                      format='YYYY-MM-DD HH:mm'
                      disabled={this.state.jy}
                      value={cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate, 'YYYY-MM-DD HH:mm') : null}
                    />
                  </LocaleProvider>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='服务接待'>
                  {getFieldDecorator('scEmpName', {
                    initialValue: this.state.cusAndCarInfo.scEmpName,
                    rules: [
                      {
                        required: true,
                        message: '服务接待不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    disabled={this.state.jy}
                    onChange={this.statesChange.bind(event, 'scEmpName')}
                  >
                    {scEmpChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='业务类型'>
                  {getFieldDecorator('bizTypeName', {
                    initialValue: this.state.cusAndCarInfo.bizTypeName,
                    rules: [
                      {
                        required: true,
                        message: '业务类型不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    disabled={this.state.jy}
                    onChange={this.statesChange.bind(event, 'bizTypeName')}
                  >
                    {bizTypeChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='厂商单号'>
                  <Input
                    value={this.state.cusAndCarInfo.oemOrderNo}
                    disabled={this.state.jy}
                    onChange={this.queryChange.bind(event, 'oemOrderNo')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='维修建议'>
                  <Input
                    disabled={this.state.jy}
                    value={this.state.cusAndCarInfo.repairAdvice}
                    onChange={this.queryChange.bind(event, 'repairAdvice')}
                  />
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='客户描述'>
                  <div style={w100p}>
                    <Input
                      disabled={this.state.jy}
                      value={this.state.cusAndCarInfo.cusDesc}
                      onChange={this.queryChange.bind(event, 'cusDesc')}
                    />
                  </div>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='预检结果'>
                  <Input
                    disabled={this.state.jy}
                    value={this.state.cusAndCarInfo.precheckResult}
                    onChange={this.queryChange.bind(event, 'precheckResult')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col span={2} className='pr20'>
                <FormItem {...formSmallLayout} label='工单备注' />
              </Col>
              <Col span={22} className='pr20' style={{ marginTop: '10px' }}>
                <Row>
                  <Col {...colLayout}>
                    <Checkbox
                      disabled={this.state.jy}
                      value={this.state.cusAndCarInfo.cusTakeOldParts}
                      onChange={this.onCheckChange.bind(event, 'cusTakeOldParts')}
                      checked={this.state.cusAndCarInfo.cusTakeOldParts == 1}
                    >
                      客户带走旧件
                    </Checkbox>
                  </Col>
                  <Col {...colLayout}>
                    <Checkbox
                      disabled={this.state.jy}
                      value={this.state.cusAndCarInfo.carWash}
                      onChange={this.onCheckChange.bind(event, 'carWash')}
                      checked={this.state.cusAndCarInfo.carWash == 1}
                    >
                      车辆洗车
                    </Checkbox>
                  </Col>
                  <Col {...colLayout}>
                    <Checkbox
                      disabled={this.state.jy}
                      value={this.state.cusAndCarInfo.cusWait}
                      onChange={this.onCheckChange.bind(event, 'cusWait')}
                      checked={this.state.cusAndCarInfo.cusWait == 1}
                    >
                      客户等待
                    </Checkbox>
                  </Col>
                  <Col {...colLayout}>
                    <Checkbox
                      disabled={this.state.jy}
                      value={this.state.cusAndCarInfo.cusRoadTestDrive}
                      onChange={this.onCheckChange.bind(event, 'cusRoadTestDrive')}
                      checked={this.state.cusAndCarInfo.cusRoadTestDrive == 1}
                    >
                      客户路试
                    </Checkbox>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* 工项列表 */}
            <EditableTable
              title={() => workHourHeader}
              onSearch={this.workHoursSearch}
              onAdd={this.workHourAdd}
              rowSelection={workHoursRowSelection}
              dataSource={workHoursDataSource}
              dropDownTabledataSource={dropDownWorkHoursTable}
              fetchLoading={fetching}
              columns={workHoursColumns}
              dropDownTableColumns={dropDownWorkHoursColumns}
              Footer={workHoursFooter}
              style={{ width: '100%', marginBottom: '20px' }}
              scroll={{ x: 1800, y: 300 }}
              size='small'
              rowKey='key'
            />
            {/* 商品列表 */}
            <EditableTable
              title={() => goodsHeader}
              onSearch={this.goodsSearch}
              onAdd={this.goodsAdd}
              rowSelection={goodsRowSelection}
              dataSource={goodsDataSource}
              dropDownTabledataSource={dropDownGoodsTable}
              fetchLoading={fetchs}
              columns={goodsColumns}
              dropDownTableColumns={dropDownGoodsColumns}
              Footer={goodsFooter}
              style={{ width: '100%' }}
              scroll={{ x: 1800, y: 300 }}
              size='small'
              rowKey='key'
            />
            <Row style={{ marginTop: '10px', fontSize: '16px', fontWeight: '500' }}>
              <span className='mr20'>
                总金额：
                <label>{cusAndCarInfo.totalAmount || 0}</label>
              </span>
              <span className='mr20'>
                施工金额：<label>{cusAndCarInfo.workItemAmount || 0}</label>
              </span>
              <span className='mr20'>
                商品金额：<label>{cusAndCarInfo.goodsAmount || 0}</label>
              </span>
              <span className='mr20'>
                应收金额：
                <label>
                  {cusAndCarInfo.receivableAmount || 0}
                </label>
              </span>
              <span className='mr20'>
                客户付费：
                <label>
                  {cusAndCarInfo.payAmount || 0}
                </label>
              </span>
            </Row>
            {/* hjf */}
            {this.state.orderType != 'check' ? (
              <Row style={{ marginTop: '8px', textAlign: 'center' }}>
                <Col>
                  <Button
                    type='primary'
                    loading={this.state.submitLoading}
                    className='mr20'
                    onClick={this.handleSaveTable}
                  >
                    保存
                  </Button>
                  <Button onClick={this.handleChangeTable} type='primary' className='mr20' >转施工单</Button>
                  <Button onClick={this.handleCompleteTable} className='mr20'
                    style={{ display: cusAndCarInfo.woStatusCode == '70200000' || cusAndCarInfo.woStatusCode == '70200005' ? 'inline-block' : 'none' }}
                  >完工</Button>
                  <Button onClick={this.handleSubmitTable}
                    style={{ display: cusAndCarInfo.woStatusCode == '70200010' ? 'inline-block' : 'none' }}
                  >结算</Button>
                </Col>
              </Row>
            ) : (
                ''
              )}
          </Spin>
        </Col>
        <Col span={2}>
          <div>
            <Anchor offsetTop={0} affix={false}>
              <p
                onClick={this.cusUpdateClick.bind(event)}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                客户更新
              </p>
              <p
                onClick={this.carUpdateClick.bind(event)}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                车辆信息
              </p>
              <p
                onClick={this.historyUpdateClick.bind(event)}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
              >
                维修历史
              </p>
            </Anchor>
          </div>
        </Col>

        {/* 弹窗 */}
        {/* 打印模态框 */}
        {/* <Modal
                title='打印'
                visible={this.state.printVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                width='80%'
                footer={[
                    <Button key='back' onClick={this.printCancel}>
                    关闭
                    </Button>,
                ]}
                >
                <div style={{ width: '100%', height: '600px' ,overflowY:'auto'}}>
                    <iframe
                    src={`${'http://114.55.2.156:8888/WebReport/ReportServer?reportlet=/saas/Print_OrdSettlement.cpt' +
                        '&id='}${this.state.editId}`}
                    scrolling='auto'
                    frameBorder={0}
                    seamless='seamless'
                    width='100%'
                    height='100%'
                    />
                </div>
            </Modal> */}





        {/* 新增车主 */}
        <Modal
          visible={this.state.addVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='850px'
          footer={[
            <Button
              type='primary'
              key='save'
              loading={this.state.saveLoading}
              onClick={this.addSubmitOk}
            >
              保存
            </Button>,
            <Button key='back' onClick={this.addCancel} style={{ marginLeft: '10px' }}>
              返回
            </Button>,
          ]}
        >
          <Spin spinning={this.state.queryLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Form>
                <Row span={24}>
                  <h3>车主车辆</h3>
                </Row>
                <hr />
                <Row span={24}>
                  <h3>车主信息</h3>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusNam', {
                        initialValue: customerInfoDto.cusName,
                        rules: [
                          {
                            required: true,
                            message: '客户姓名不能为空！',
                          },
                        ],
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusName')}
                        disabled={cusUpdateFlag == 'edit'}
                        onBlur={this.CreditCodeBlur}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='客户类型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusTypeName', {
                        initialValue: customerInfoDto.cusTypeName,
                        rules: [
                          {
                            required: true,
                            message: '客户类型不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'cusTypeName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {cusTypeNameChildren}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={customerInfoDto.cusProvinceName}
                        onChange={this.statesChange.bind(event, 'cusProvinceName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {this.getOptionRender(this.state.cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={this.state.customerInfoDto.cusRegionName}
                        onChange={this.statesChange.bind(event, 'cusRegionName')}
                        disabled={cusUpdateFlag == 'edit'}
                        onClick={this.ass}
                      >
                        {this.getOptionRender(this.state.cusRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusMobileNo', {
                        initialValue: customerInfoDto.cusMobileNo,
                        rules: [
                          {
                            required: true,
                            message: '联系电话不能为空！',
                          },
                          {
                            pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                            message: '请输入021-1234567格式的号码或手机号',
                          },
                        ],
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusMobileNo')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='性别'
                      style={{
                        marginBottom: '10px',
                        paddingRight: '20px',
                        display: this.state.cusTypeNama == 0 ? 'block' : 'none',
                      }}
                    >
                      {getFieldDecorator('cusGenderName', {
                        initialValue: customerInfoDto.cusGenderName,
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'cusGenderName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {cusGenderChildren}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='组织架构代码'
                      style={{
                        marginBottom: '10px',
                        paddingRight: '20px',
                        display: this.state.cusTypeNama == 1 ? 'block' : 'none',
                      }}
                    >
                      {getFieldDecorator('cusCertificateNo', {
                        initialValue: customerInfoDto.cusCertificateNo,
                        // rules: [
                        //   {
                        //     required: true,
                        //     message: '组织架构代码不能为空！',
                        //   },
                        // ],
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusCertificateNo')}
                        // disabled={cusUpdateFlag == 'edit'}
                        disabled
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={this.state.customerInfoDto.cusCityName}
                        onChange={this.statesChange.bind(event, 'cusCityName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {this.getOptionRender(this.state.cusCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='街道门牌'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusStreetAddresss', {
                        initialValue: customerInfoDto.cusStreetAddress,
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusStreetAddress')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row span={24}>
                  <Col span={3}>
                    <h3>联系人信息</h3>
                  </Col>
                  {/* <Col span={3}>
                    <Checkbox value={addCarSave.synchronousOwners} onChange={this.onManCheckChange}
                      checked={addCarSave.synchronousOwners}>
                      同步车主
                    </Checkbox>
                  </Col> */}
                </Row>
                <hr />
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系人'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusName', {
                        initialValue: linkCustomerInfoDto.cusName,
                        rules: [
                          {
                            required: true,
                            message: '联系人不能为空！',
                          },
                        ],
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusName')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={linkCustomerInfoDto.cusProvinceName}
                        onChange={this.statesChange.bind(event, 'manProvinceName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {this.getOptionRender(this.state.cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={this.state.linkCustomerInfoDto.cusRegionName}
                        onChange={this.statesChange.bind(event, 'manRegionName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {this.getOptionRender(this.state.cusManRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cuMobileNo', {
                        initialValue: linkCustomerInfoDto.cusMobileNo,
                        rules: [
                          {
                            required: true,
                            message: '联系电话不能为空！',
                          },
                          {
                            pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                            message: '请输入021-1234567格式的号码或手机号',
                          },
                        ],
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusMobileNo')}
                        disabled={cusUpdateFlag == 'edit'}
                        onBlur={this.Blur.bind(event)}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={this.state.linkCustomerInfoDto.cusCityName}
                        onChange={this.statesChange.bind(event, 'manCityName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {this.getOptionRender(this.state.cusManCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='地址'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusStreetAddress', {
                        initialValue: linkCustomerInfoDto.cusStreetAddress,
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusStreetAddress')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <hr />
                <Row span={24}>
                  <h3>车辆信息</h3>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='车牌号'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carPlateNo', {
                        initialValue: carInfoDto.carPlateNo,
                        rules: [
                          {
                            required: true,
                            message: '车牌号不能为空！',
                          },
                          {
                            pattern: /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
                            message: '请输入完整的车牌号',
                          },
                        ],
                      })(<Input
                        addonBefore={prefixSelector}
                        onChange={this.carAddChange.bind(event, 'carPlateNo')}
                        onBlur={this.keyWordCheck.bind(event, 'carPlateNo')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='动力类型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carPowerTypeName', {
                        initialValue: carInfoDto.carPowerTypeName,
                        rules:[
                          {
                            required: true,
                            message: '动力类型不能为空！',
                          },
                        ]
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'carPowerTypeName')}
                      >
                        {carPowerTypeChildren}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='保险公司'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('insBranchName', {
                        initialValue: carInfoDto.insBranchName,
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'insBranchName')}
                      >
                        {insBranchChildren}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='保险到期'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('insEndDate', {
                        initialValue: carInfoDto.insEndDate,
                      })(<LocaleProvider locale={zh_CN}>
                        <DatePicker
                          style={w100p}
                          onChange={this.singleDateChange.bind(event, 'insEndDate')}
                          format='YYYY-MM-DD'
                        />
                      </LocaleProvider>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='VIN'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('vin', {
                        initialValue: carInfoDto.vin,
                        rules: [
                          {
                            required: true,
                            message: 'VIN不能为空！',
                          },
                          {
                            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{17}$/,
                            message: '请输入17位由字母和数字组成的vin码',
                          },
                        ],
                      })(<Input
                        onChange={this.carAddChange.bind(event, 'vin')}
                        onBlur={this.keyWordCheck.bind(event, 'vin')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='用途'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carUsageName', {
                        initialValue: carInfoDto.carUsageName,
                        rules:[
                          {
                            required: true,
                            message: '用途不能为空！',
                          },
                        ]
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'carUsageName')}
                      >
                        {carUsageChildren}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='质保结束里程'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('qaEndMileage', {
                        initialValue: carInfoDto.qaEndMileage || 0,
                      })(<InputNumber
                        style={w100p}
                        onChange={this.carAddChange.bind(event, 'qaEndMileage')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='质保结束日期'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('qaEndDate', {
                        initialValue: carInfoDto.qaEndDate,
                      })(<LocaleProvider locale={zh_CN}>
                        <DatePicker
                          style={w100p}
                          onChange={this.singleDateChange.bind(event, 'qaEndDate')}
                          format='YYYY-MM-DD'
                        />
                      </LocaleProvider>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row span={24}>
                  <FormItem
                    {...formSpanLayout}
                    label='车型'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    {getFieldDecorator('carModelName', {
                      initialValue: this.state.threeLevelValue,
                      rules: [
                        {
                          required: true,
                          message: '车型不能为空！',
                        },
                      ],
                    })(<SoCarModelsSelect
                      style={{ width: 500, maxHeight: 200, overflow: "auto" }} //根据具体场景进行布局
                      allowClear
                      // multiple //是否多选
                      level={4} //支持4级以下
                      onChange={this.onCarModelChange}
                    />)}
                  </FormItem>
                </Row>
              </Form>
            </div>
          </Spin>
        </Modal>

        {/* 客户更新 */}
        <Modal
          visible={this.state.cusUpdateVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='850px'
          footer={[
            <Button
              type='primary'
              key='update'
              loading={this.state.cusUpdateLoading}
              onClick={this.cusUpdateOk}
            >
              更新
            </Button>,
          ]}
        >
          <Spin spinning={this.state.queryLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Form>
                <Row span={24}>
                  <h3>客户信息</h3>
                </Row>
                <hr />
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusUpdateInfo.cusName}</span>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upProvinceName', {
                        initialValue: cusUpdateInfo.cusProvinceName,
                        rules: [
                          {
                            required: true,
                            message: '省份不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        disabled={this.state.jy}
                        onChange={this.statesChange.bind(event, 'upProvinceName')}
                      >
                        {this.getOptionRender(this.state.cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upRegionName', {
                        initialValue: cusUpdateInfo.cusRegionName,
                        rules: [
                          {
                            required: true,
                            message: '区县不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        disabled={this.state.jy}
                        onChange={this.statesChange.bind(event, 'upRegionName')}
                      >
                        {this.getOptionRender(this.state.cusRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upMobileNo', {
                        initialValue: cusUpdateInfo.cusMobileNo,
                        rules: [
                          {
                            required: true,
                            message: '联系电话不能为空！',
                          },
                          {
                            pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                            message: '请输入021-1234567格式的号码或手机号',
                          },
                        ],
                      })(<Input disabled={this.state.jy} onChange={this.cusUpChange.bind(event, 'cusMobileNo')} />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upCityName', {
                        initialValue: cusUpdateInfo.cusCityName,
                        rules: [
                          {
                            required: true,
                            message: '城市不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        disabled={this.state.jy}
                        onChange={this.statesChange.bind(event, 'upCityName')}
                      >
                        {this.getOptionRender(this.state.cusCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}

                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='客户地址'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upStreetAddress', {
                        initialValue: cusUpdateInfo.cusStreetAddress,
                        rules: [
                          {
                            required: true,
                            message: '客户地址不能为空！',
                          },
                        ],
                      })(<Input disabled={this.state.jy} onChange={this.cusUpChange.bind(event, 'cusStreetAddress')} />)}
                    </FormItem>
                  </Col>

                </Row>
              </Form>
            </div>
          </Spin>
        </Modal>

        {/* 车辆更新 */}
        <Modal
          visible={this.state.carUpdateVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='820px'
          footer={[]}
        >
          <Spin spinning={this.state.queryLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Form>
                <Row span={24}>
                  <h3>车辆信息</h3>
                </Row>
                <hr />
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{carUpdateInfo.cusName}</span>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{carUpdateInfo.cusMobileNo}</span>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col span={3} offset={21}>
                  <Button
                    type='primary'
                    icon='plus'
                    ghost
                    onClick={this.carUpdateAdd}
                    disabled={this.state.jy}
                    style={{ marginBottom: '10px' }}
                  >
                    新增
                  </Button>
                </Col>
              </Row>
              <Table
                bordered
                disabled={this.state.jy}
                dataSource={cusCarInfoFastlyDto}
                columns={carUpdateColumns}
                size='small'
              />
            </div>
          </Spin>
        </Modal>

        {/* 维修历史 */}
        <Modal
          visible={this.state.historyVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='820px'
          footer={[]}
        >
          <Spin spinning={this.state.queryLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Row span={24}>
                <h3>维修历史</h3>
              </Row>
              <hr />
              <Table
                bordered
                dataSource={historyFastlyInfo}
                columns={historyColumns}
                size='small'
              />
            </div>
          </Spin>
        </Modal>

        {/* 套餐 */}
        <Modal
          width='850px'
          visible={this.state.comboVisible}
          onCancel={this.TChandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>套餐:</label>
              <Input
                style={{ width: '120px' }}
                value={this.state.obj.comboName}
                onPressEnter={this.enterSearch}
                onChange={this.TCchange}
                placeholder='套餐名称'
              />
            </span>
            <span>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={this.state.number}
                onChange={this.numberChange}
                placeholder='默认数量'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table
            columns={taocaicolumns}
            // expandedRowRender={expandedRowRender}
            dataSource={this.state.tabledData}
            bordered
            // onExpand={this.onExpand.bind(this)}
            pagination={false}
          />
          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.comboPageTotal}
              pageSize={this.state.obj.pageSize}
              current={this.state.pagecurrent}
              showTotal={this.showTotal}
              onChange={this.onCurrentPages}
            />
          </div>
        </Modal>
        {/* 工时 */}
        <Modal
          width='850px'
          visible={this.state.workVisible}
          onCancel={this.GShandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                // defaultValue={this.state.worksSettleCode}
                allowClear
                style={{ width: 120 }}
                value={this.state.worksSettleCode}
                onChange={this.GSway}
                placeholder='结算方式'
              >
                {settleTypeChildren}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={this.state.number}
                onChange={this.XGnumberChange}
                placeholder='默认数量'
              />
            </span>
            <span>
              <Input
                style={{ width: '120px' }}
                value={this.state.list.keyWord}
                onPressEnter={this.keyWordEnter}
                onChange={this.keyWordChange}
                placeholder='输入工项名称'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table dataSource={this.state.workModalTable} columns={columns} bordered pagination={false} />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.worksPageTotal}
              pageSize={this.state.list.pageSize}
              current={this.state.pagecurrent}
              showTotal={this.showTotal}
              onChange={this.onwsCurrentPage}
            />
          </div>
        </Modal>
        {/* 组合 */}
        <Modal
          width='850px'
          visible={this.state.groupVisible}
          onCancel={this.CPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.groupSettleCode}
                onChange={this.GSwayss}
                placeholder='结算方式'
              >
                {settleTypeChildren}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>价格方案:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.groupObj.priceTypeCode}
                onChange={this.priceWay}
              >
                {/* {settleTypeChildren} */}
                {/* dicValue */}
                {priceListsChildren}
              </Select>
            </span>

            <span>
              <Input
                style={{ width: '120px' }}
                value={this.state.groupList.groupName}
                onPressEnter={this.groupNameEnter}
                onChange={this.groupNameChange}
                placeholder='输入组合名称'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table
            dataSource={this.state.groupDataSource}
            columns={CPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.groupPageTotal}
              pageSize={this.state.groupList.pageSize}
              current={this.state.pagecurrent}
              showTotal={this.showTotal}
              onChange={this.onCpCurrentPage}
            />
          </div>
        </Modal>
        {/* 商品 */}
        <Modal
          width='850px'
          visible={this.state.goodsVisible}
          onCancel={this.GPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.goodsSettleCode}
                onChange={this.wayChange}
              >
                {settleTypeChildren}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>价格方案:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.goodsObj.priceTypeCode}
                onChange={this.priceChange}
              >
                {priceListsChildren}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={this.state.number}
                onChange={this.GPnumberChange}
                placeholder='默认数量'
              />
            </span>
            <span>
              <Input
                style={{ width: '120px' }}
                value={this.state.goodsObj.goodsName}
                onPressEnter={this.OemEnter}
                onChange={this.OemChange}
                placeholder='输入OEM编码或名称'
              />
            </span>
            <Checkbox value={this.state.goodsObj.matchSeries} checked={this.state.goodsObj.matchSeries == 1} onChange={this.carType.bind(event)}>
              适用车型
            </Checkbox>
            <Checkbox value={this.state.goodsObj.isZeroStock} checked={this.state.goodsObj.isZeroStock == 1} onChange={this.kucun.bind(event)}>
              零库存
            </Checkbox>
          </div>
          {/* 表格 */}
          <Table
            dataSource={this.state.goodList}
            columns={GPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.worksPageTotal}
              pageSize={this.state.goodsObj.pageSize}
              current={this.state.pagecurrent}
              showTotal={this.showTotal}
              onChange={this.onCurrentPage}
            />
          </div>
        </Modal>

        {/* 结算 */}
        <Modal
          visible={this.state.calculateVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='920px'
          footer={[
            <Button
              type='primary'
              key='save'
              loading={this.state.calculateLoading}
              onClick={this.calculateOk}
            >
              确认
            </Button>,
          ]}
        >
          <Spin spinning={this.state.queryLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Form>
                <Row span={24}>
                  <h3>结算确认</h3>
                </Row>
                <hr />
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.cusName}</span>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='客户手机'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.cusContactPhone}</span>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='车牌号'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.carPlateNo}</span>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='VIN'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.vin}</span>
                    </FormItem>
                  </Col>
                  <Col span={16}>
                    <FormItem
                      {...formLayout}
                      label='品牌车型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.carModelName}</span>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Table
                bordered
                className='mb16'
                dataSource={workModalDataSource}
                columns={workModalColumns}
                size='small'
              />
              <Table
                bordered
                className='mb16'
                dataSource={goodModalDataSource}
                columns={goodModalColumns}
                size='small'
              />

              <Row>
                <Col span={4}>
                  <FormItem
                    {...formLayout}
                    label='抹零：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <InputNumber
                      min={0}
                      max={Number(this.state.settlementDto.cusPayAmount)}
                      value={this.state.settlementDto.maLingAmount || 0}
                      precision={2}
                      onChange={this.modalChange.bind(event, 'maLingAmount')}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='总金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.totalAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='商品金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.goodsAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='施工金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.workItemAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='抹零金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.maLingAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='应付金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.receivableAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='客户付费：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{this.state.settlementDto.payAmount}</span>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Spin>
        </Modal>

        {/* 库存不足 */}
        <Modal
          visible={this.state.stockVisible}
          onCancel={this.addCancel}
          maskClosable={this.state.maskClosable}
          width='820px'
          footer={[
            <Button type='primary' key='save' onClick={this.addCancel}>
              确认
            </Button>,
          ]}
        >
          <div
            style={{
              maxHeight: '540px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '15px',
            }}
          >
            <Row span={24}>
              <h3>商品库存不足</h3>
            </Row>
            <hr />
            <Table bordered dataSource={stockDataSource} columns={stockColumns} size='small' />
          </div>
        </Modal>
      </Root>
    );
  }
}
const DecorationOrders = withRouter(Form.create()(DecorationOrder));
export default DecorationOrders;
