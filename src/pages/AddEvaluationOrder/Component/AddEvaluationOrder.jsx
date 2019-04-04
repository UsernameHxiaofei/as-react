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
  getBasValueByBasCategoryNo,
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
  deleteCusCarFastlyInfo,
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
  queryWorkOrderNoPage,
  getCarInfoBykeywords,
  settlementConfirm,
  saveWorkOrder,
  copyWorkOrder,
  queryUnifiedSocialCreditCode,
  getPersonalCustomerByMobileNo,
  querySettlementGoodsInventory,
  saveEvaluateOrder,
} from '../../../services/getData';
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
import { EditableTable, SelectTableMenu } from '../../../components/BlksEditableTable';
import * as _ from 'lodash';
import { env } from '../../../config/env/';
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式

const {
  REDIRECTION_URL: { QuickOrder, MaintenanceHistory },
  HOST,
} = env;
moment.locale('zh-cn');
const Option = Select.Option;
const FormItem = Form.Item;
const { Link } = Anchor;
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
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};
class AddEvaluationOrder extends Component {
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
      selectedGoodsRowKeys: [], // 商品选中行id
      workHoursTotalMoney: 0, // 工时金额总计
      workHoursReceiveMoney: 0, // 工时应收金额总计
      workHoursReduce: 0, // 工时优惠金额
      workHoursTotalNum: 0, // 工时数量合计
      goodsTotalMoney: 0, // 商品金额总计
      goodsReceiveMoney: 0, // 商品应收金额总计
      goodsReduce: 0, // 商品优惠金额
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
      reduceDatasource: [], //估价金额
      cusAndCarInfo: {
        // 主页面保存时提交的数据
        carModelId: '',
        id: '', // 主键ID,/* -- */
        woId: '', // 工单ID,/* -- */
        woNo: '',// 工单号,
        eoNo: '', // 估价单号/* -- */
        eoCreatorEmpId: '', // 制单人ID,/* --woCreatorEmpId此处与维修工单不同 */
        eoCreatorEmpName: '', // 制单人姓名,/* --woCreatorEmpName */
        woCreateDate: '', // 工单创建时间,
        eoStatusId: '', // 工单状态ID,
        eoStatusCode: '', // 工单状态编码,
        eoStatusName: '新建', // 工单状态名称,
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
        amount: '', // 总金额 <必传>,/* -- totalAmount*/
        materialAmount: '', // 商品金额 <必传>,/* --goodsAmount */
        workItemAmount: '', // 施工金额 <必传>,
        receivableAmount: '', // 应收金额 <必传>,
        payAmount: '', // 付费金额 <必传>
        reduceAmount: '', // 优惠金额
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
      },
      workHourdisaounts: 0, // 工时优惠价格
      isBatch: '', // 是否是折扣率批量  改变的是列表输入框的哪个值

      //hjf start\
      GSpagetotal: 0,
      goodsObj: {
        index: 1,
        pageSize: 10,
        goodsName: '',
        carModelId: '',
        priceTypeCode: '35400000', // 给个默认值
        matchSeries: 0,
        isZeroStock: 0,
      },
      WTway: '',
      WTCode: '',
      WTId: '',
      jsway: '',
      jsCode: '',
      jsId: '',
      cpjsway: '',
      cpjsCode: '',
      cpjsId: '',
      GoodsList: [],
      WtabledList: [],
      TablesList: [],
      TCpagetotal: 0,
      GSpagetotal: 0,
      CPpagetotal: 0,
      cpObj: {
        carModelId: '',
        groupGoodsId: '',
        priceTypeCode: '',
        workHourlyPrice: '',
        name: ''
      },
      priceLists: [],
      CPdataSource: [],
      editId: '',
      orderType: '', //判断是不是复制工单
      carInfoId: '',
      TCvisible: false,
      GSvisible: false,
      PTvisible: false,
      CPvisible: false,
      GPvisible: false,
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
      GXtabled: [],
      gxObj: {},
      cpList: {
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
        issuedQty: '', // 已发料数量 (材料)
      },
      goodsLists: [],
      worksLists: [],
      expandedRowKeys: [],
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
    // this.seeQueryWorkOrder('bacaadda551a466cb51fcfb092426cbb')/* ---- */

    const _th = this;
    const cusAndCarInfo = _th.state.cusAndCarInfo;
    // 跳转页面的逻辑
    // window.addEventListener('message', (e) => {
    //   // console.log('跳转',e.data)
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     _th.setState({
    //       editId: data.id,
    //       orderType: data.type,
    //     }, () => {
    //       // 就发送请求获取数据(渲染页面)
    //       _th.seeQueryWorkOrder(_th.state.editId);
    //     });
    //   }
    // });

    if (envRouter) { //预发环境
      const data = this.props.location.query;
      // console.log(data);
      if (data) {
        _th.setState({
          editId: data.id,
          orderType: data.type,
        }, () => {
          // 就发送请求获取数据(渲染页面)
          _th.seeQueryWorkOrder(_th.state.editId);
        });
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        // console.log('接收的数据',req);
        if (req.jumpFlag) {
          const data = req;
          _th.setState({
            editId: data.id,
            orderType: data.type,
          }, () => {
            // 就发送请求获取数据(渲染页面)
            _th.seeQueryWorkOrder(_th.state.editId);
          });
        }
      });
    }

    if (localStorage.getItem('loginInfo')) {
      const _data = JSON.parse(localStorage.getItem('loginInfo')).login;
      _th.setState({
        cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
          eoCreatorEmpName: _data.empName || '',
        }),
      });
      _th.getQueryDicValue(); // 调用基础数据
      _th.getGlobalMdmRegion('', 'cusProvince'); // 获取省
    } else {
      _th.DelErrorMsg('用户未登陆');
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
    // 调用数据字典、基础数值接口
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
      } else {
        this.setState({ listLoading: false });
        return message.error(res.msg)
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
      } else {
        this.setState({ listLoading: false });
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
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption) {
      if (selectedOptions.length < 3) {
        this.GetCarModelVoChildren({ id: targetOption.id }, targetOption, selectedOptions.length);
      }
    }
  };
  // 页面第一次下拉时请求车型的一级数据
  threeDefault = () => {
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
        this.props.form.setFieldsValue({ upProvinceName: e.props.name });
        this.setState(
          {
            cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
              cusProvinceId: e.key,
              cusProvinceName: e.props.name,
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
        this.props.form.setFieldsValue({ upRegionName: e.props.name });
        this.setState({
          cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
            cusRegionId: e.key,
            cusRegionName: e.props.name,
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
        this.props.form.setFieldsValue({ upCityName: e.props.name });
        this.setState(
          {
            cusUpdateInfo: Object.assign({}, cusUpdateInfo, {
              cusCityId: e.key,
              cusCityName: e.props.name,
              cusRegionId: '',
              cusRegionName: '',
            }),
          },
          () => {
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
    let { workHoursDataSource, dropDownWorkHoursTable, cusAndCarInfo } = this.state;
    if (code) {
      let stdPrice = e.props.name;
      this.setState({
        cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
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
      this.setState({ workHoursDataSource, dropDownWorkHoursTable }, () => {
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
    const { addCarSave, customerInfoDto, linkCustomerInfoDto } = this.state;
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
    this.setState({
      cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
        carId: value.id, // 车辆id
        cusNo: value.cusNo, // 客户编码
        cusId: value.cusId, // 车主Id,
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
            this.DelErrorMsg(this.res.msg);
          }
        });
      }, 300);
    },
    );
  };

  // 维修历史
  historyUpdateClick = () => {
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
            const SaveEvaluateOrderVO = {
              evaluateOrderMstrVO: this.state.cusAndCarInfo,
              workOrderDetList: workDataSource,
              goodItemDetList: goodDataSource,
            };
            saveEvaluateOrder(SaveEvaluateOrderVO).then((res) => {
              if (res.success) {
                // console.log('res', res.data)
                message.success('保存成功');
                this.setState({
                  submitLoading: false,
                  isId: res.data,
                  cusAndCarInfo: Object.assign({}, cusAndCarInfo, { id: res.data }),
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

  /** 估价单转工单 */
  handleSubmitTable = () => {
    const { isId, cusAndCarInfo } = this.state;
    if (!isId) {
      message.error('请先保存估价单');
      return false;
    } else {
      if (cusAndCarInfo.woNo) {
        message.error('该估价单已转工单');
        return false;
      } else {
        const data = {
          id: cusAndCarInfo.woId,
          jumpFlag: true,
          type: 'copy',
          eoId: cusAndCarInfo.id,
          jy: false
        };
        this.setState({ isId: '' })
        // const _data = JSON.stringify(data);
        // const autoMessage = {
        //   name: '新建工单', index: `orderEdit${cusAndCarInfo.id}`, url: 'QuickOrder', resId: 'editOrder', infoData: _data,
        // };
        // window.parent.postMessage(autoMessage, HOST);
        /* 修改了autoMessage中的url值 */
        if (envRouter) { //预发环境
          this.props.history.push({ pathname: '/QuickOrder', query: data });
        } else {
          menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
            menuRouter.open(QuickOrder, data, { title: '新建工单' });
          });
        }
      }
    }
  };

  seeQueryWorkOrder = (id) => {
    const _th = this;
    const { cusAndCarInfo, settlementDto, orderType } = this.state;
    queryWorkOrderNoPage({ eoId: id }).then((res) => {
      if (res.success && res.code == 200) {
        // console.log('提交采购单', res.data)
        const mstrDto = res.data.mstrVO;
        const workItemArr = res.data.listWorkItemVO;
        const goodsItemArr = res.data.listGoodsVO;
        const [worFront, workLast, goodFront, goodLast] = [[], [], [], []];
        // 将套餐和万能工项放到列表前面，方便计算金额
        workItemArr.forEach(item => {
          if (item.comboGoodsId || item.goodsNo == 99999999) worFront.push(item);
          else workLast.push(item);
        })
        goodsItemArr.forEach(item => {
          if (item.comboGoodsId) goodFront.push(item);
          else goodLast.push(item);
        })
        const workItemDtos = [...worFront, ...workLast]
        const goodsDtos = [...goodFront, ...goodLast]
        workItemDtos.map((item, index) => {
          item.key = item.id + index;
          item.workHoursNum = index + 1;
          if (item.comboGoodsId) item.combo = 2;// 非套餐1 套餐2
          else item.combo = 1;
        });
        workItemDtos.push({ index: 0, workHoursNum: workItemDtos.length + 1 });
        goodsDtos.map((item, index) => {
          item.key = item.id + index;
          item.workHoursNum = index + 1;
          if (item.comboGoodsId) item.combo = 2;// 非套餐1 套餐2
          else item.combo = 1;
        });
        goodsDtos.push({ index: 0, workHoursNum: goodsDtos.length + 1 });
        this.setState({
          queryLoading: false,
          orderType: orderType == 'editEo' ? 'editEo' : '',
          cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
            id: mstrDto.id, // 主键ID,
            woId: mstrDto.woId, // 工单ID,
            woNo: mstrDto.woNo,// 工单号,
            eoNo: mstrDto.eoNo, // 估价单号
            eoCreatorEmpId: mstrDto.eoCreatorEmpId, // 制单人ID,
            eoCreatorEmpName: mstrDto.eoCreatorEmpName, // 制单人姓名,
            woCreateDate: mstrDto.eoCreateDate, // 工单创建时间,
            eoStatusId: mstrDto.eoStatusId, // 工单状态ID,
            eoStatusCode: mstrDto.eoStatusCode, // 工单状态编码,
            eoStatusName: mstrDto.eoStatusName, // 工单状态名称,
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
            amount: mstrDto.amount, // 总金额 <必传>,
            materialAmount: mstrDto.materialAmount, // 商品金额 <必传>,
            workItemAmount: mstrDto.workItemAmount, // 施工金额 <必传>,
            receivableAmount: mstrDto.receivableAmount, // 应收金额 <必传>,
            payAmount: mstrDto.payAmount, // 付费金额 <必传>
            carPlateNo: mstrDto.carPlateNo, // 车牌号
            carModelId: mstrDto.carModelId, // 车型id
            carModelName: mstrDto.carModelName, // 车型名称
            carEngineeNo: mstrDto.carEngineeNo, // 发动机号,
            carColor: mstrDto.carColorName, // 车身色名称,
            carPowerTypeName: mstrDto.carPowerTypeName, // 车辆动力类型名称,
          }),
          workModalDataSource: workItemDtos.filter(item => item.index != 0),
          goodModalDataSource: goodsDtos.filter(item => item.index != 0),
          workHoursDataSource: workItemDtos,
          goodsDataSource: goodsDtos,
          settlementDto: Object.assign({}, settlementDto, {
            totalAmount: res.data.settlementVO.totalAmount, // 总金额,
            goodsAmount: res.data.settlementVO.goodsAmount, // 商品金额,
            workItemAmount: res.data.settlementVO.workItemAmount, // 施工金额,
            receivableAmount: res.data.settlementVO.receivableAmount, // 应收金额,
            payType: res.data.settlementVO.payType, // 付费方式(客户付费, 厂家付费, 店内付费),
            payAmount: res.data.settlementVO.payAmount, // 付费金额,
            cusPayAmount: res.data.settlementVO.payAmount, // 付费金额,
            maLingAmount: res.data.settlementVO.maLingAmount, // 抹零金额
            oldMaLingAmount: res.data.settlementVO.maLingAmount, // 原抹零金额
          }),
        }, () => {
          this.props.form.setFieldsValue({ estimatedCarDeliveryDate: mstrDto.estimatedCarDeliveryDate });
          // 调用方法计算
          _th.calculateTotal('workHoursDataSource', 1);
          _th.calculateTotal('goodsDataSource', 1);

        });
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
      let Boolean = this.state.workHoursDataSource.some(item => item.workNeeded == 1)
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
          reduceAmount: 0,//优惠金额
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 1, // 已发料数量 (材料)
        }
        this.state.workHoursDataSource.unshift(workTime)
        this.state.workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
        });
      }
    }
    if (dataSource.length == 1) { // 添加第一条数据
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
      row.workNeeded = row.workNeeded || 0; // 1万能工时 0非万能工时
      row.discountRate = 1.0;
      row.qty = 1;
      row.amount = row.qty * row.price || 0;
      row.receivableAmount = row.amount;
      row.id = ''; // 新增时id为空
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
      dataSource.splice(dataSource.length - 1, 0, row);
    }
    dataSource.map((item, index) => {
      if (item.index == 0) {
        item.workHoursNum = index + 1; // 序号
        item.amount = '';
      } else {
        item.key = item.goodsId + index; // 唯一标识码
        item.workHoursNum = index + 1; // 序号
        if (sourseType == 'workHoursDataSource') {
          item.issuedQty = 0; // 发料数量
        } else if (sourseType == 'goodsDataSource') {
          item.issuedQty = 1; // 发料数量
        }
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
    const {
      workHoursDataSource,
      goodsDataSource,
    } = this.state;
    if (type == 'workHoursDataSource') {
      this.setState({ selectedWorkHoursRowKeys: [] });
    } else if (type == 'goodsDataSource') {
      this.setState({ selectedGoodsRowKeys: [] });
    }
    const newWorkHoursDataSource = workHoursDataSource.filter(item => !item.checked);
    const newGoodsDataSource = goodsDataSource.filter(item => !item.checked);
    const option = newGoodsDataSource.find(item => item.workNeeded == 1) //找到所有的万能工项商品
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
    this.setState({ selectedGoodsRowKeys, selectedWorkHoursRowKeys, selectedComboRowKeys }, () => {
      this.handleSelectRow(selectedWorkHoursRowKeys, 'workHoursDataSource');
      this.handleSelectRow(selectedGoodsRowKeys, 'goodsDataSource');
    });
  };
  //点击表格 全选
  selectAllRow = (selected, selectedRows, type) => {
    // console.log(selected, selectedRows)
    let { workHoursDataSource, goodsDataSource, } = this.state;
    let worksRowKeys = [];
    let goodsRowKeys = [];
    if (!selected) {
      // 全不选
      this.setState({ selectedWorkHoursRowKeys: [] });
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
      this.setState({ selectedWorkHoursRowKeys: worksRowKeys, selectedGoodsRowKeys: goodsRowKeys });
      this.handleSelectRow(worksRowKeys, 'workHoursDataSource');
      this.handleSelectRow(goodsRowKeys, 'goodsDataSource');
    }
  };
  workHoursSelectAll = (selected, selectedRows) => {
    // console.log(selected, selectedRows)
    // this.selectAllRow(selected, selectedRows, 'workHoursDataSource')
    if (!selected) {
      // 全不选
      this.setState({ selectedWorkHoursRowKeys: [] });
    } else {
      let RowKeys = [];
      selectedRows.map((item) => {
        RowKeys.push(item.key);
      });
      this.setState({ selectedWorkHoursRowKeys: RowKeys });
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
          // 最后一行不是套餐
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
    let { workHoursDataSource, goodsDataSource, cusAndCarInfo, reduceDatasource } = this.state;
    let obj = {
      key: Math.random() + 1000,
      totalAmount: accAdd(getTotal(workHoursDataSource, 'amount'), getTotal(goodsDataSource, 'amount')), // 总金额
      goodsAmount: getTotal(goodsDataSource, 'amount'), // 商品金额
      workItemAmount: getTotal(workHoursDataSource, 'amount'), // 施工金额
      receivableAmount: accAdd(getTotal(workHoursDataSource, 'receivableAmount'), getTotal(goodsDataSource, 'receivableAmount')), // 应收金额
      payAmount: accAdd(getReceiveTotal(workHoursDataSource, 'receivableAmount'), getReceiveTotal(goodsDataSource, 'receivableAmount')), // 付费金额
      reduceAmount: accAdd(getTotal(workHoursDataSource, 'reduceAmount'), getTotal(goodsDataSource, 'reduceAmount')), // 优惠总金额
    }
    const newArr = [obj];
    this.setState({
      workHourdisaounts: 0,
      isBatch: 'noRowChange',
      cusAndCarInfo: Object.assign({}, cusAndCarInfo, {
        amount: obj.totalAmount, // 总金额
        materialAmount: obj.goodsAmount, // 商品金额
        workItemAmount: obj.workItemAmount, // 施工金额
        receivableAmount: obj.receivableAmount, // 应收金额
        payAmount: obj.payAmount, // 付费金额
        reduceAmount: obj.reduceAmount, //优惠金额
      }),
      reduceDatasource: newArr
    })
  }



  // 四舍不入
  decimalsCut = (number, n, type) => {
    if (type == 'down') { //只舍不入
      let digit = Math.pow(10, n);
      return Number(Math.floor(number * digit) / digit);
    }
    if (type == 'up') { //只入不舍
      let digit = Math.pow(10, n);
      return Number(Math.ceil(number * digit) / digit);
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
    const ReduceMoney = getTotal(selectRows, 'reduceAmount');
    const TotalNum = getTotal(selectRows, 'qty');
    return {
      selectRows,
      TotalMoney,
      ReceiveMoney,
      ReduceMoney,
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
  getTableFooterRender = (TotalMoney, TotalNum, ReceiveMoney, ReduceMoney) => {
    const FooterRender = (
      <Row style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.85)' }}>
        <Col span={2} style={{ marginLeft: '20px' }}>
          <FormItem {...formItemLayout} label=''>
            合计
          </FormItem>
        </Col>
        <Col span={3} offset={3}>
          <FormItem {...formItemLayout} label='总数量'>
            {TotalNum || 0}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formItemLayout} label='总金额'>
            {TotalMoney ? TotalMoney.toFixed(2) : 0}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formItemLayout} label='应收金额总金额'>
            {ReceiveMoney ? ReceiveMoney.toFixed(2) : 0}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem {...formItemLayout} label='优惠总金额'>
            {ReduceMoney ? ReduceMoney.toFixed(2) : 0}
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
        >
          删除
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.addT}
        >
          套餐
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.cp}
        >
          组合
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.workHouse}
        >
          工时
        </Button>
        <Button
          className='mr20'
          style={{ display: type == 'goods' ? 'inline-block' : 'none' }}
          onClick={this.deleteRows.bind(event, 'goodsDataSource')}
        >
          删除
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'goods' ? 'inline-block' : 'none' }}
          onClick={this.goods}
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
    this.setState(
      {
        expandedRowKeys: this.state.expandedRowKeys,
      },
    );
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
          TCpagetotal: res.data.totalNumber,
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
        TCvisible: true,
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
              workNeeded: 0,
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
              issuedQty: 1, // 已发料数量 (材料)
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
            if (item.index == 0) {
              item.issuedQty = ''; // 发料数量
              item.workHoursNum = index + 1;
            } else {
              item.workHoursNum = index + 1;
              item.issuedQty = 1; // 发料数量
            }
          });
          this.setState(
            {
              workHoursDataSource,
              goodsDataSource,
              number: 1, // 清空字段
              TCvisible: false,
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
        const CPdataSource = res.data.items;
        CPdataSource.map((item, index) => {
          item.key = index;
        });
        this.setState({
          CPdataSource,
          CPpagetotal: res.data.totalNumber,
        });
      }
    });
  };

  onCpCurrentPage = (current) => {
    const _th = this;
    const cpList = this.state.cpList;
    this.setState(
      {
        pagecurrent: current,
        cpList: Object.assign({}, cpList, { index: current }),
      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.cpList);
      },
    );
  };

  // 价格方案改变事件
  priceWay = (value, Option) => {
    const cpObj = this.state.cpObj;
    if (value == undefined || Option.props == undefined) {
      this.setState({
        cpObj: Object.assign({}, cpObj, { priceTypeCode: '', name: '' }),
      });
    } else {
      this.setState({
        cpObj: Object.assign({}, cpObj, { priceTypeCode: value, name: Option.props.children }),
      });
    }
  };

  // 组合添加到表格
  adddWHG = (record) => {
    // console.log(record)
    const _th = this;
    if (this.state.cpObj.priceTypeCode == '') {
      message.error('请选择价格方案');
    }
    const cpObj = this.state.cpObj;
    const workHourlyPrice = this.state.cusAndCarInfo.workHourlyPrice;
    const carModelId = this.state.cusAndCarInfo.carModelId;
    this.setState({
      cpObj: Object.assign({}, cpObj, {
        carModelId,
        groupGoodsId: record.id,
        workHourlyPrice,
      }),
    }, () => {
      queryGroupGoodsDet(this.state.cpObj).then((res) => {
        // console.log(res)
        if (res.success) {
          this.setState({
            TablesList: [...res.data.additionList, ...res.data.competitiveList, ...res.data.spareList],
            WtabledList: res.data.workList,
          }, () => {
            // 如果这两个数组的length都为0
            if (this.state.TablesList.length == 0 && this.state.WtabledList.length == 0) {
              // 提示用户这个组合中没有商品了
              message.error('这个组合中没有商品请选择别的组合');
              return false;
            }
            if (res.data.noPriceList.length != 0) {
              let str = '';
              res.data.noPriceList.map((item, index) => {
                str += `${item},`;
              });
              let price = `${_th.state.cpObj.name}`
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
            let workArr = [];
            let goodsArr = [];
            this.state.TablesList.map((item) => {
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
                settleTypeId: this.state.cpjsId, // 结算方式ID,
                settleTypeCode: this.state.cpjsCode, // 结算方式编码,
                settleTypeName: this.state.cpjsway, // 结算方式名称,
                price: item.price, // 单价,
                qty: + this.state.number, // 数量,
                amount: '', // 金额,
                discountRate: 1.00, // 折扣率,
                receivableAmount: '', // 应收金额,
                technicianEmpId: '', // 技师员工ID (施工),
                technicianEmpName: '', // 技师员工姓名 (施工),
                issuedQty: 1, // 已发料数量 (材料)
                mfgGoodsNo: item.mfgGoodsNo,
                oemGoodsNo: item.oemGoodsNo,
                goodsUnit: '件',
                goodsIssueNeeded: item.goodsIssueNeeded,
              };
              goodsArr.push(tabledList); // 商品
            });
            this.state.WtabledList.map((item) => {
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
                settleTypeId: this.state.cpjsId, // 结算方式ID,
                settleTypeCode: this.state.cpjsCode, // 结算方式编码,
                settleTypeName: this.state.cpjsway, // 结算方式名称,
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
                item.settleTypeId = this.state.cpjsId;
                item.settleTypeCode = this.state.cpjsCode;
                item.settleTypeName = this.state.cpjsway;
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
                item.settleTypeId = this.state.cpjsId;
                item.settleTypeCode = this.state.cpjsCode;
                item.settleTypeName = this.state.cpjsway;
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
                item.settleTypeId = this.state.cpjsId;
                item.settleTypeCode = this.state.cpjsCode;
                item.settleTypeName = this.state.cpjsway;
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
                item.settleTypeId = this.state.cpjsId;
                item.settleTypeCode = this.state.cpjsCode;
                item.settleTypeName = this.state.cpjsway;
                item.discountRate = 1.0;
                item.qty = + this.state.number;
                item.amount = + this.state.number * item.price || 0;
                item.receivableAmount = + this.state.number * item.price || 0;
              })
              goodsDataSource.splice(Glength - 1, 0, ...goodsArr)
            }
            workHoursDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.key = index + Math.random();
              item.issuedQty = 0;
            });
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.key = index + Math.random();
              item.issuedQty = 1;
            });
            this.setState({
              workHoursDataSource,
              goodsDataSource,
              CPvisible: false,
              cpObj: {
                carModelId: '',
                groupGoodsId: '',
                priceTypeCode: '',
                workHourlyPrice: '',
                name: ''
              },
              cpjsCode: '',
            }, () => {
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
      CPvisible: true,
    });
    const carModelId = this.state.cusAndCarInfo.carModelId;
    const cpList = this.state.cpList;
    const defaultPayWayId = _th.state.defaultTypeValue.defaultPayWayId
    const defaultPayWayNo = _th.state.defaultTypeValue.defaultPayWayNo
    const defaultPayWay = _th.state.defaultTypeValue.defaultPayWay
    this.setState(
      {
        cpList: Object.assign({}, cpList, { carModelId }),
        cpjsway: defaultPayWay,
        cpjsCode: defaultPayWayNo,
        cpjsId: defaultPayWayId,

      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.cpList);
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
    const cpList = this.state.cpList;
    this.setState({
      CPvisible: false,
      cpObj: {
        carModelId: '',
        groupGoodsId: '',
        priceTypeCode: '',
        workHourlyPrice: '',
        name: ''
      },
      cpList: Object.assign({}, cpList, { groupName: '' }),
      cpjsCode: '',
    });
  };

  GSwayss = (value, Option) => {
    if (value == undefined || Option == undefined) {
      this.setState({
        cpjsway: '',
        cpjsId: '',
        cpjsCode: '',
      });
    } else {
      this.setState(
        {
          cpjsway: Option.props.children,
          cpjsId: Option.props.id,
          cpjsCode: value,
        },
      );
    }
  };

  groupNameChange = (e) => {
    const value = e.target.value;
    const cpList = this.state.cpList;
    this.setState(
      {
        cpList: Object.assign({}, cpList, { groupName: value }),
      },
    );
  };

  groupNameEnter = (e) => {
    const _th = this;
    const value = e.target.value;
    const cpList = this.state.cpList;
    this.setState(
      {
        cpList: Object.assign({}, cpList, { groupName: value, index: 1 }),
      },
      () => {
        _th.QueryGroupGoodsForPage(this.state.cpList);
      },
    );
  };

  QueryWorkItemPage = (data) => {
    queryWorkItemPage(data).then((res) => {
      if (res.success) {
        // console.log(res.data.items)
        const GXtabled = res.data.items;
        GXtabled.map((item, index) => {
          item.key = index;
        });
        this.setState({
          GXtabled,
          GSpagetotal: res.data.totalNumber,
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
        GSvisible: true,
        list: Object.assign({}, list, { workHourlyPrice, repairCarModelId: carModelId }),
        WTway: defaultPayWay,
        WTCode: defaultPayWayNo,
        WTId: defaultPayWayId,
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
      GSvisible: false,
      number: 1,
      WTway: '',
      WTCode: '',
      WTId: '',
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
        WTway: '',
        WTCode: '',
        WTId: '',
      });
    } else {
      this.setState(
        {
          WTway: Option.props.children,
          WTCode: value,
          WTId: Option.props.id,
        },
      );
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
    if (this.state.WTCode == '') {
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
          tabledList.settleTypeId = this.state.WTId;
          tabledList.settleTypeCode = this.state.WTCode;
          tabledList.settleTypeName = this.state.WTway;
          workHoursDataSource.splice(length - 1, 0, this.state.tabledList);
          workHoursDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
          });
          let list = this.state.list
          this.setState({
            workHoursDataSource,
            GSvisible: false,
            number: 1,
            list: Object.assign({}, list, { keyWord: '' }),
            WTway: '',
            WTCode: '',
            WTId: '',
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
          tabledList.settleTypeId = this.state.WTId;
          tabledList.settleTypeCode = this.state.WTCode;
          tabledList.settleTypeName = this.state.WTway;
          workHoursDataSource.splice(length - 1, 0, this.state.tabledList);
        }
        workHoursDataSource.map((item, index) => {
          item.workHoursNum = index + 1;
          item.issuedQty = 0;
        });
        let list = this.state.list
        this.setState({
          workHoursDataSource,
          GSvisible: false,
          number: 1,
          list: Object.assign({}, list, { keyWord: '' }),
          WTway: '',
          WTCode: '',
          WTId: '',
        }, () => {
          this.state.workHoursDataSource.map((item, index) => {
            item.key = index + Math.random();
          });
          _th.calculateTotal('workHoursDataSource');
        });
        // 清空数据
        this.setState({
          WTway: '',
          WTCode: '',
          WTId: '',
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
        jsway: '',
        jsId: '',
        jsCode: '',
      });
    } else {
      this.setState({
        jsway: Option.props.children,
        jsId: Option.props.id,
        jsCode: value,
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
          GPvisible: true,
          goodsObj: Object.assign({}, goodsObj, { carModelId: id }),
          jsway: defaultPayWay,
          jsCode: defaultPayWayNo,
          jsId: defaultPayWayId,
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
        const GoodsList = res.data.items;
        GoodsList.map((item, index) => {
          item.key = index;
        });
        this.setState({
          GoodsList: res.data.items,
          GSpagetotal: res.data.totalNumber,
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
      GPvisible: false,
      jsway: '',
      jsId: '',
      jsCode: '',
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
          settleTypeCode: this.state.jsCode, // 结算方式编码,
          settleTypeName: this.state.jsway, // 结算方式名称,
          price: '', // 单价,
          qty: + this.state.number, // 数量,
          amount: 0, // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          mfgGoodsNo: record.mfgGoodsNo,
          oemGoodsNo: record.oemGoodsNo,
          goodsUnit: '件',
          goodsIssueNeeded: record.goodsIssueNeeded,
          reduceAmount: 0,  //优惠金额
          // workNeeded:item.workNeeded
        };
        const workTime = {
          key: Math.random() + 1000,
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
          settleTypeCode: this.state.jsCode, // 结算方式编码,
          settleTypeName: this.state.jsway, // 结算方式名称,
          price: 0, // 单价,
          qty: 1, // 数量,
          amount: 0, // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          reduceAmount: 0,  //优惠金额
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
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            this.setState({
              goodsDataSource,
              GPvisible: false,
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
              jsway: '',
              jsId: '',
              jsCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
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
              GPvisible: false,
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
          workTime.settleTypeId = this.state.jsId;
          workTime.settleTypeCode = this.state.jsCode;
          workTime.settleTypeName = this.state.jsway;
          workTime.discountRate = 1.0
          workTime.amount = 0;
          workTime.receivableAmount = 0;
          workHoursDataSource.unshift(workTime);
          workHoursDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
          });
          this.setState({
            workHoursDataSource,
            GPvisible: false,
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
          settleTypeCode: this.state.jsCode, // 结算方式编码,
          settleTypeName: this.state.jsway, // 结算方式名称,
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
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            this.setState(
              {
                goodsDataSource,
                GPvisible: false,
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
              jsway: '',
              jsId: '',
              jsCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
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
                GPvisible: false,
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
              jsway: '',
              jsId: '',
              jsCode: '',
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
        settleTypeCode: this.state.jsCode, // 结算方式编码,
        settleTypeName: this.state.jsway, // 结算方式名称,
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
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0;
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            this.setState({
              goodsDataSource,
              GPvisible: false,
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
              jsway: '',
              jsId: '',
              jsCode: '',
              goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '' }),
            });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.state.jsId;
            tabledList.settleTypeCode = this.state.jsCode;
            tabledList.settleTypeName = this.state.jsway;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, this.state.tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            this.setState({
              goodsDataSource,
              GPvisible: false,
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
            jsway: '',
            jsId: '',
            jsCode: '',
            goodsObj: Object.assign({}, goodsObj, { priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 }),
          });
        },
      );
    }
  };

  TChandleCancel = () => {
    const obj = this.state.obj;
    this.setState({
      TCvisible: false,
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
      reduceDatasource,
      workHoursTotalMoney,
      workHoursReceiveMoney,
      workHoursReduce,
      workHoursTotalNum,
      goodsTotalMoney,
      goodsReceiveMoney,
      goodsReduce,
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
        width: 150,
        align: 'center',
        cellOption: {
          inputType: 'tableSelect',
        },
      },
      {
        title: '工项名称',
        key: 'goodsName',
        dataIndex: 'goodsName',
        width: 150,
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
        width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option, id) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
          },
        }
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'workHoursDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'settleTypeName', 'workHoursDataSource');
          },
        }
      },
      {
        title: '价格',
        key: 'price',
        dataIndex: 'price',
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          // isFirstFocus: true,
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
        width: 100,
        cellOption: {
          inputType: 'inputNumber',
          // isFirstFocus: true,
          initialValue: 0,
          rules: [
            { validatorFn: value => !!value, errMsg: '请输入数量' },
          ],
          getCellRestProps: record => ({
            disabled: !!record.comboGoodsId,
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
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
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
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
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
        }
      },
      {
        title: '应收金额',
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        width: 160,
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
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
          placeholder: '请输入优惠总金额',
          rules: [{ required: true, message: '请输入优惠总金额，自动分到每个项目' }],
          onChange: (value, key) => {
            this.handleBatchSubmit(value, key, 'workHoursDataSource');
          },
        }
      },
      {
        title: '优惠金额',
        key: 'reduceAmount',
        dataIndex: 'reduceAmount',
        width: 120,
        render: (text, record) => (
          <span style={{ display: record.index == 0 ? 'none' : 'inline-block' }}>
            {record.reduceAmount}
          </span>
        ),
      },
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
        width: 150,
        align: 'center',
        cellOption: {
          inputType: 'tableSelect',
        },
      },
      {
        title: '商品名称',
        key: 'goodsName',
        dataIndex: 'goodsName',
        width: 150,
      },
      {
        title: '业务类型',
        key: 'bizTypeName',
        dataIndex: 'bizTypeName',
        width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: this.getOptionRender(workBizType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
          },
        }
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'goodsDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: this.getOptionRender(settleType, { key: 'key', code: 'code', name: 'name' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'settleTypeName', 'goodsDataSource');
          },
        }
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
        width: 100,
        cellOption: {
          inputType: 'inputNumber',
          // isFirstFocus: true,
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
        width: 120,
        cellOption: {
          inputType: 'inputNumber',
          step: 0.01,
          range: [0, 1],
          precision: 2,
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
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'inputNumber',
          step: 0.01,
          range: [0, 1],
          precision: 2,
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
        }
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
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'inputNumber',
          step: 0.01,
          precision: 2,
          placeholder: '请输入优惠总金额',
          rules: [{ required: true, message: '请输入优惠总金额，自动分到每个项目' }],
          onChange: (value, key) => {
            this.handleBatchSubmit(value, key, 'goodsDataSource');
          },
        }
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
              <a href='javascript:;' onClick={() => this.carUpdateEdit(record)}>
                编辑
              </a>
              {/* 代码暂时保留 */}
              {/* <Divider type='vertical' />
              <Popconfirm title='是否确认删除?' onConfirm={() => this.carUpdateDelete(record)}>
                <a href='javascript:;'>删除</a>
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
    const reduceColumns = [
      {
        title: '工时总金额',
        key: 'workItemAmount',
        dataIndex: 'workItemAmount',
        align: 'center',
        width: 180,
      },
      {
        title: '商品总金额',
        key: 'goodsAmount',
        dataIndex: 'goodsAmount',
        align: 'center',
        width: 200,
      },
      {
        title: '应收总金额',
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        align: 'center',
        width: 200,
      },
      {
        title: '客户付费',
        key: 'payAmount',
        dataIndex: 'payAmount',
        align: 'center',
        width: 200,
      },
      {
        title: '优惠总金额',
        key: 'reduceAmount',
        dataIndex: 'reduceAmount',
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
      workHoursReduce,
    );

    const goodsFooter = this.getTableFooterRender(
      goodsTotalMoney,
      goodsTotalNum,
      goodsReceiveMoney,
      goodsReduce,
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
        <p className='list-page_title'>估价单</p>
        <Col span={22}>
          <Spin spinning={this.state.listLoading} indicator={antIcon} tip='加载中'>
            <Row span={24}>
              <Col sm={24} md={12} lg={5} className='pr20'>
                <FormItem {...formLayout} label='估价单号'>
                  <span>{cusAndCarInfo.eoNo}</span>
                </FormItem>
              </Col>
              <Col sm={18} md={5} lg={3} offset={6} className='pr20'>
                <FormItem {...formLayout} label='状态'>
                  <span>{cusAndCarInfo.eoStatusName}</span>
                </FormItem>
              </Col>
              <Col sm={24} md={12} lg={4} className='pr20'>
                <FormItem {...formLayout} label='制单人'>
                  <span>{cusAndCarInfo.eoCreatorEmpName}</span>
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
            <Row>
              <h2 id='customer-info'>客户信息检索</h2>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='客户检索'>
                  <div style={w100p}>
                    <PersonAndCar
                      callback={this.carOwnerCusNameChange.bind(this)}
                      addCar={this.addCarAndMan}
                      placeholder='手机号/车牌号/姓名/VIN'
                      disabled={orderType == 'editEo'}
                    />
                  </div>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label=''>
                  <p style={{ color: '#007fff', cursor: 'pointer' }} onClick={this.historyUpdateClick.bind(event)}>维修历史</p>
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='客户姓名'>
                  <span>{cusAndCarInfo.cusName || '-'}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='联系电话'>
                  <span>{cusAndCarInfo.cusContactPhone || '-'}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='会员号'>
                  <span>{cusAndCarInfo.memberNo || '-'}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='VIN'>
                  <span>{cusAndCarInfo.vin || '-'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='车牌号:'>
                  <span>{cusAndCarInfo.carPlateNo || '-'}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='发动机号'>
                  <div style={w100p}>
                    <span>{cusAndCarInfo.carEngineeNo || '-'}</span>
                  </div>
                </FormItem>
              </Col>
              <Col span={12} className='pr20'>
                <FormItem {...formSpanLayout} label='车型'>
                  <span>{cusAndCarInfo.carModelName || '-'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='车辆颜色'>
                  <span>{cusAndCarInfo.carColor || '-'}</span>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='动力类型'>
                  <span>{cusAndCarInfo.carPowerTypeName || '-'}</span>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <h2 id='base-info-input'>基本信息填写</h2>
            </Row>
            <Row span={24}>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='业务类型'>
                  {getFieldDecorator('bizTypeName', {
                    initialValue: cusAndCarInfo.bizTypeName,
                    rules: [
                      {
                        required: true,
                        message: '业务类型不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    onChange={this.statesChange.bind(event, 'bizTypeName')}
                  >
                    {bizTypeChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='服务接待'>
                  {getFieldDecorator('scEmpName', {
                    initialValue: cusAndCarInfo.scEmpName,
                    rules: [
                      {
                        required: true,
                        message: '服务接待不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    onChange={this.statesChange.bind(event, 'scEmpName')}
                  >
                    {scEmpChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='工时单价'>
                  {getFieldDecorator('workHourlyPrice', {
                    initialValue: cusAndCarInfo.workHourlyPrice,
                    rules: [
                      {
                        required: true,
                        message: '工时单价不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    onChange={this.changeStdPrice.bind(event)}
                  >
                    {workHourlyPriceChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='送修人'>
                  {getFieldDecorator('carSenderName', {
                    initialValue: cusAndCarInfo.carSenderName,
                    rules: [
                      {
                        // required: true,
                        message: '送修人不能为空！',
                      },
                    ],
                  })(<Input onChange={this.queryChange.bind(event, 'carSenderName')} />)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='送修人电话'>
                  {getFieldDecorator('carSenderPhone', {
                    initialValue: cusAndCarInfo.carSenderPhone,
                    rules: [
                      {
                        // required: true,
                        // message: '送修人电话不能为空！',
                      },
                      {
                        pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                        message: '请输入021-1234567格式的号码或手机号',
                      },
                    ],
                  })(<Input
                    placeholder='如021-1234567或手机号'
                    onChange={this.queryChange.bind(event, 'carSenderPhone')}
                  />)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='进店里程'>
                  {getFieldDecorator('inStoreMileage', {
                    initialValue: cusAndCarInfo.inStoreMileage,
                    rules: [
                      {
                        required: false,
                        message: '进店里程不能为空！',
                      },
                      {
                        pattern: /^\d{0,6}$/,
                        message: '进店里程已超过车辆里程表限额[999999]',
                      },
                    ],
                  })(<InputNumber
                    style={w100p}
                    onChange={this.queryChange.bind(event, 'inStoreMileage')}
                  />)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='油表信息'>
                  {getFieldDecorator('fuelMeterScaleName', {
                    initialValue: cusAndCarInfo.fuelMeterScaleName,
                    rules: [
                      {
                        // required: true,
                        message: '油表信息不能为空！',
                      },
                    ],
                  })(<Select
                    allowClear
                    style={w100p}
                    onChange={this.statesChange.bind(event, 'fuelMeterScaleName')}
                  >
                    {fuelMeterScaleChildren}
                  </Select>)}
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='预计交车'>
                  {getFieldDecorator('estimatedCarDeliveryDate', {
                    initialValue: cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate) : null,
                    rules: [
                      {
                        // required: true,
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
                      value={cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate, 'YYYY-MM-DD HH:mm') : null}
                    />
                  </LocaleProvider>)}
                </FormItem>
              </Col>

              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='维修建议'>
                  <Input
                    style={{ height: '60px' }}
                    value={cusAndCarInfo.repairAdvice}
                    onChange={this.queryChange.bind(event, 'repairAdvice')}
                  />
                </FormItem>
              </Col>


              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='客户描述'>
                  <div style={w100p}>
                    <Input
                      style={{ height: '60px' }}
                      value={cusAndCarInfo.cusDesc}
                      onChange={this.queryChange.bind(event, 'cusDesc')}
                    />
                  </div>
                </FormItem>
              </Col>
              <Col {...colLayout} className='pr20'>
                <FormItem {...formLayout} label='预检结果'>
                  <Input
                    style={{ height: '60px' }}
                    value={cusAndCarInfo.precheckResult}
                    onChange={this.queryChange.bind(event, 'precheckResult')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row span={24}>
              <hr />
              <h2 id='select-works'>选择维修工项</h2>
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
              scroll={{ x: 1600, y: 300 }}
              size='small'
              rowKey='key'
            />
            <hr />
            <Row><h2 id='select-goods'>选择维修材料</h2></Row>
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
              scroll={{ x: 1600, y: 300 }}
              size='small'
              rowKey='key'
            />
            <hr />
            <Row><h2 id='total-money'>估价金额</h2></Row>
            <Table
              bordered
              dataSource={reduceDatasource}
              columns={reduceColumns}
              size='small'
              pagination={false}
            />
            {/* hjf */}
            {this.state.orderType != 'check' ? (
              <Row style={{ marginTop: '8px', textAlign: 'center' }}>
                <Col>
                  <Button
                    loading={this.state.submitLoading}
                    className='mr20'
                    onClick={this.handleSaveTable}
                  >
                    保存
                  </Button>
                  <Button type='primary' onClick={this.handleSubmitTable}>估价单转工单</Button>

                </Col>
              </Row>
            ) : (
                ''
              )}
          </Spin>
        </Col>
        <Col span={2}>
          <Anchor >
            <Link href="#/AddEvaluationOrder/#customer-info" title="客户信息检索" />
            <Link href="#/AddEvaluationOrder/#base-info-input" title="基本信息填写" />
            <Link href="#/AddEvaluationOrder/#select-works" title="选择维修工项" />
            <Link href="#/AddEvaluationOrder/#select-goods" title="选择维修材料" />
            <Link href="#/AddEvaluationOrder/#total-money" title="估价金额" />
          </Anchor>
        </Col>

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
                        rules: [
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
                        rules: [
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
                      })(<Input onChange={this.cusUpChange.bind(event, 'cusMobileNo')} />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusCityName', {
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
                      })(<Input onChange={this.cusUpChange.bind(event, 'cusStreetAddress')} />)}
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
                    style={{ marginBottom: '10px' }}
                  >
                    新增
                  </Button>
                </Col>
              </Row>
              <Table
                bordered
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
          visible={this.state.TCvisible}
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
              total={this.state.TCpagetotal}
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
          visible={this.state.GSvisible}
          onCancel={this.GShandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                // defaultValue={this.state.WTCode}
                allowClear
                style={{ width: 120 }}
                value={this.state.WTCode}
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
          <Table dataSource={this.state.GXtabled} columns={columns} bordered pagination={false} />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.GSpagetotal}
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
          visible={this.state.CPvisible}
          onCancel={this.CPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.cpjsCode}
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
                value={this.state.cpObj.priceTypeCode}
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
                value={this.state.cpList.groupName}
                onPressEnter={this.groupNameEnter}
                onChange={this.groupNameChange}
                placeholder='输入组合名称'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table
            dataSource={this.state.CPdataSource}
            columns={CPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.CPpagetotal}
              pageSize={this.state.cpList.pageSize}
              current={this.state.pagecurrent}
              showTotal={this.showTotal}
              onChange={this.onCpCurrentPage}
            />
          </div>
        </Modal>
        {/* 商品 */}
        <Modal
          width='850px'
          visible={this.state.GPvisible}
          onCancel={this.GPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={this.state.jsCode}
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
            dataSource={this.state.GoodsList}
            columns={GPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={this.state.GSpagetotal}
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
      </Root >
    );
  }
}
const AddEvaluationOrders = withRouter(Form.create()(AddEvaluationOrder));
export default AddEvaluationOrders;
