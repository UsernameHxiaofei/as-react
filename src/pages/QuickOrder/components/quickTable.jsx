// 基础模块
import React, { Component } from 'react'
import styled, { consolidateStreamedStyles } from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import * as _ from 'lodash';

// 方法
import { EditableTable, SelectTableMenu } from '@/components/BlksEditableTable';

import {
  getOptionRender, getTotal, getReceiveTotal, getNoComboTotal,
  decimalsCut, getSelectedItemsInfo, calculateTable
} from '../common/methods';

// UI组件
import {
  Form,
  Select,
  message,
  Row,
  Col,
  Button,
  Input,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {
  queryWorkItem,
  queryFastProduct,
  queryWorkItemPage,
} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { formItemLayout, DelErrorMsg } from '../common/components';
const Style = styled.div`
.mr20 {
  margin-right: 20px;
}
`;



class QuickTable extends Component {

  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }

  inputChange = (type, index, event) => {
    const workHoursDataSource = this.state.workHoursDataSource;
    const option = workHoursDataSource.find(Item => Item.key == index.key);
    option.goodsName = event.target.value;
    this.setState({ workHoursDataSource });
  };

  /** 下拉框搜索回调 */
  workHoursSearch = (value) => {
    const { carModelId, workHourlyPrice } = this.props.cusAndCarInfo;
    if (!carModelId) {
      message.error('请先填写车主姓名和工时单价！');
    } else if (!workHourlyPrice) {
      message.error('请先选择工时单价！');
    } else {
      this.props.TABLE_SET_STATE({ dropDownWorkHoursTable: [], fetching: true });
      const obj = {
        repairCarModelId: carModelId,
        keyWord: value,
        workHourlyPrice,
        page: 1,
        pageSize: 5,
      };
      this.props.getWorkItemPage(obj);
    }
  };
  goodsSearch = (value) => {
    if (value == '') return false;
    this.props.TABLE_SET_STATE({ dropDownGoodsTable: [], fetchs: true });
    const obj = {
      goodsName: value,
    };
    queryFastProduct(obj).then((res) => {
      if (res.success) {
        if (res.data) {
          const list = res.data.map((item, index) => {
            item.key = item.goodsId + index;
            return item;
          });
          this.props.TABLE_SET_STATE({ dropDownGoodsTable: list });
        }
      } else {
        DelErrorMsg(res.msg);
      }
      this.props.TABLE_SET_STATE({ fetchs: false });
    });
  };

  /** 增加一行数据  */
  workHourAdd = (row) => {
    this.handleAdd(row, 'workHoursDataSource');
  };
  goodsAdd = (row) => {
    this.handleAdd(row, 'goodsDataSource');
  };
  handleAdd = (row, sourseType) => {
    const {
      defaultWorkTypeId,
      defaultWorkTypeNo,
      defaultWorkType,
      defaultPayWayId,
      defaultPayWayNo,
      defaultPayWay,
    } = this.props.defaultTypeValue;
    let dataSource = _.cloneDeep(this.props[sourseType]); // 根据调用的不同获取工时/商品
    let workHoursDataSource = _.cloneDeep(this.props.workHoursDataSource); // 获取工时
    // 添加万能工时
    if (row.workNeeded == 1) {
      let randomFlag = workHoursDataSource.some(item => item.goodsNo == 99999999)
      // console.log(randomFlag, workHoursDataSource)
      if (!randomFlag) { // 添加万能工项
        const workTime = {
          key: Math.random() + 1000,
          id: '', // 主键ID,
          workNeeded: 1, // 1表示万能工时
          combo: 1,
          goodsId: this.props.goodsArr[0].id, // 商品ID,
          goodsNo: this.props.goodsArr[0].dicCode, // 商品编码,
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
        workHoursDataSource.unshift(workTime)
        workHoursDataSource.forEach((item, index) => {
          item.workHoursNum = index + 1;
        });
        this.props.TABLE_SET_STATE({ workHoursDataSource: workHoursDataSource });
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
      row.workNeeded = 0; // 1万能工时  0非万能工时
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
      row.workNeeded = 0; // 1万能工时  0非万能工时
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
    this.props.TABLE_SET_STATE({
      [sourseType]: dataSource,
    })
    this.setState({}, () => {
      if (sourseType == 'workHoursDataSource') {
        this.props.calculateTotal('workHoursDataSource')
      } else {
        this.props.calculateTotal('goodsDataSource');
      }
      // this.props.calculateBottomTotal()
    });
  };

  /** 删除多行数据  */
  deleteRows = (type, e) => {
    const { workHoursDataSource, goodsDataSource, } = _.cloneDeep(this.props);
    if (type == 'workHoursDataSource') {
      this.props.TABLE_SET_STATE({ selectedWorkHoursRowKeys: [], selectedWorkRowKeys: [] });
    } else if (type == 'goodsDataSource') {
      this.props.TABLE_SET_STATE({ selectedGoodsRowKeys: [] });
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
      data.map((item, index) => {
        item.workHoursNum = index + 1;
      });
      newGoodsDataSource.map((item, index) => {
        item.workHoursNum = index + 1;
      });
      this.props.TABLE_SET_STATE({
        workHoursDataSource: data,
        goodsDataSource: newGoodsDataSource
      })
      this.setState({}, () => {
        this.props.calculateTotal('workHoursDataSource');
        this.props.calculateTotal('goodsDataSource');
        // this.props.calculateBottomTotal()
      })
    } else {
      newWorkHoursDataSource.map((item, index) => {
        item.workHoursNum = index + 1;
      });
      newGoodsDataSource.map((item, index) => {
        item.workHoursNum = index + 1;
      });
      this.props.TABLE_SET_STATE({
        workHoursDataSource: newWorkHoursDataSource,
        goodsDataSource: newGoodsDataSource
      })
      this.setState({}, () => {
        this.props.calculateTotal('workHoursDataSource');
        this.props.calculateTotal('goodsDataSource');
        // this.props.calculateBottomTotal()
      })
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
    } = _.cloneDeep(this.props);
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
      goodsDataSource.map((item) => { // 商品
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
    this.props.TABLE_SET_STATE({ selectedGoodsRowKeys, selectedWorkHoursRowKeys, selectedComboRowKeys, selectedWorkRowKeys: selectedWorkHoursRowKeys })
    this.setState({}, () => {
      this.handleSelectRow(selectedWorkHoursRowKeys, 'workHoursDataSource');
      this.handleSelectRow(selectedGoodsRowKeys, 'goodsDataSource');
    });
  };


  // 下拉框更改
  handleSelectChange = (row, option, key, type) => {
    const { workHoursDataSource, goodsDataSource } = _.cloneDeep(this.props);
    const comboId = row.comboGoodsId;
    workHoursDataSource.forEach((item) => {
      if (item.combo == 2 && item.comboGoodsId == comboId && option) {
        // 找到当前套餐的所有工项
        if (key == 'bizTypeName') { // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') { // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {  // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      } else if (item.key == row.key && option) {
        if (key == 'bizTypeName') { // 业务类型
          console.log(12333)
          item.bizTypeId = option.key || '';
          item.bizTypeCode = option.props.value || '';
          item.bizTypeName = option.props.children || '';
        }
        if (key == 'settleTypeName') {  // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') {  // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      }
    });
    goodsDataSource.forEach((item) => {
      if (item.combo == 2 && item.comboGoodsId == comboId && option) { // 找到当前套餐的所有工项
        if (key == 'bizTypeName') { // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') { // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') { // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      } else if (item.key == row.key && option) {
        if (key == 'bizTypeName') { // 业务类型
          item.bizTypeId = option.key;
          item.bizTypeCode = option.props.value;
          item.bizTypeName = option.props.children;
        }
        if (key == 'settleTypeName') { // 结算方式
          item.settleTypeId = option.key;
          item.settleTypeCode = option.props.value;
          item.settleTypeName = option.props.children;
        }
        if (key == 'technicianEmpName') { // 技师
          item.technicianEmpId = option.key;
          item.technicianEmpName = option.props.children;
        }
      }
    });
    this.props.TABLE_SET_STATE({
      workHoursDataSource, goodsDataSource
    })
    this.setState({}, () => {
      this.props.calculateBottomTotal(); //计算客户付费
    });
  };
  // 批量下拉框更改
  handleHeadSelectChange = (row, option, key, type) => {
    const dataSourse = _.cloneDeep(this.props[type]);
    let selectRows = dataSourse.filter(item => item.checked);
    // 对所有行进行计算，有勾选行则计算勾选行
    if (selectRows.length == 0) selectRows = dataSourse.filter(item => item.index != 0);
    // 验证每行的表单，如果有错误，则无法获取选中数据
    const isFormInValid = selectRows.some(item =>
      (item.formValidatorError ? item.formValidatorError.length > 0 : item.formValidatorError));
    if (isFormInValid) return false;
    selectRows.forEach((item) => {
      if (key == 'bizTypeName') { // 业务类型
        item.bizTypeId = option.key;
        item.bizTypeCode = option.props.value;
        item.bizTypeName = option.props.children;
      }
      if (key == 'settleTypeName') { // 结算方式
        item.settleTypeId = option.key;
        item.settleTypeCode = option.props.value;
        item.settleTypeName = option.props.children;
      }
      if (key == 'technicianEmpName') {  // 技师
        item.technicianEmpId = option.key;
        item.technicianEmpName = option.props.children;
      }
    });
    this.props.TABLE_SET_STATE({ [type]: dataSourse })
    this.setState({}, () => {
      this.props.calculateBottomTotal(); //计算客户付费
    });
  };
  /** 批量操作：通过key来判断对那一列做逻辑 */
  handleBatchSubmit = (value, key, type) => {
    // console.log(value, key);
    const DataSource = _.cloneDeep(this.props[type]);
    const disaounts = key == 'receivableAmount' ? Number(value) : this.state.workHourdisaounts;
    const newData = DataSource.map((item) => {
      if ((key == 'discountRate' || key == 'receivableAmount') && item.combo == 2) { item[key] = item[key]; return item; } // 套餐的折扣率、应收金额不能修改
      item[key] = value; return item;
    });
    this.props.TABLE_SET_STATE({ [type]: newData, workHourdisaounts: disaounts, isBatch: key })
    this.setState({}, () => {
      this.props.calculateTotal(type);
      // this.props.calculateBottomTotal()
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
      const newData = _.cloneDeep(this.props[dataSource]);
      const index = newData.findIndex(item => row.key === item.key);
      const changeKey = `row${key}`;
      row.amount = row.price * row.qty;
      newData.splice(index, 1, row);
      this.props.TABLE_SET_STATE({ [dataSource]: newData, isBatch: changeKey })
      this.setState({}, () => {
        this.props.calculateTotal(dataSource);
        // this.props.calculateBottomTotal()
      });
    }
  };
  /* 全选 */
  workHoursSelectAll = (selected, selectedRows) => {
    if (!selected) { // 全不选
      this.props.TABLE_SET_STATE({ selectedWorkHoursRowKeys: [], selectedWorkRowKeys: [] });
    } else {
      let RowKeys = [];
      let WorkRowKeys = [];
      selectedRows.map((item) => {
        RowKeys.push(item.key);
        if (item.index != 0) { WorkRowKeys.push(item.key) } //选中转施工单的id
      });
      this.props.TABLE_SET_STATE({ selectedWorkHoursRowKeys: RowKeys, selectedWorkRowKeys: WorkRowKeys });
      this.handleSelectRow(RowKeys, 'workHoursDataSource');
    }
  }
  goodsSelectAll = (selected, selectedRows, changeRows) => {
    if (!selected) { // 全不选
      this.props.TABLE_SET_STATE({ selectedGoodsRowKeys: [] });
    } else {
      let RowKeys = [];
      selectedRows.map((item) => {
        RowKeys.push(item.key);
      });
      this.props.TABLE_SET_STATE({ selectedGoodsRowKeys: RowKeys });
      this.handleSelectRow(RowKeys, 'goodsDataSource');
    }
  };

  handleSelectRow = (selectedRowKeys, type) => { //添加勾选属性
    const dataSource = _.cloneDeep(this.props[type]);
    dataSource.forEach((item) => {
      item.checked = selectedRowKeys.indexOf(item.key) > -1 && item.index != 0;
    });

    this.props.TABLE_SET_STATE({ [type]: dataSource })
    this.setState({}, () => {
      this.props.calculateTotal(type)
      // this.props.calculateBottomTotal()
    });
  };

  // 套餐显示
  showCombo = () => {
    const cusAndCarInfo = this.props.cusAndCarInfo;
    if (cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
      return false;
    }
    const carModelId = cusAndCarInfo.carModelId;

    new Promise((resolve, reject) => {
      this.props.modalReset({
        comboVisible: true,
        comboObj: { ...this.props.comboObj, carModelId },
        resolve,
        reject
      })
    }).then(_ => {
      this.props.searchTable(this.props.comboObj);
    })
  };
  // 组合Modal显示
  showGroup = () => {
    const _th = this;
    const { cusAndCarInfo, groupList, defaultTypeValue } = this.props;
    if (cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名和工时单价');
      return false;
    }
    if (cusAndCarInfo.workHourlyPrice == '') {
      message.error('请输入工时单价');
      return false;
    }
    const carModelId = cusAndCarInfo.carModelId;
    const defaultPayWayId = defaultTypeValue.defaultPayWayId
    const defaultPayWayNo = defaultTypeValue.defaultPayWayNo
    const defaultPayWay = defaultTypeValue.defaultPayWay
    new Promise((resolve, reject) => {
      this.props.modalReset({
        groupVisible: true,
        groupList: { ...groupList, carModelId },
        groupSettleType: defaultPayWay,
        groupSettleCode: defaultPayWayNo,
        groupSettleId: defaultPayWayId,
        resolve, reject,
      })
    }).then(() => {
      _th.props.QueryGroupGoodsForPage(this.props.groupList);
      // 查询价格方案
      _th.props.getDicDataByCategoryCode();
    })
  };

  // 工时列表显示
  showWorkHouse = () => {
    if (this.props.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名和工时单价');
      return false;
    }
    if (this.props.cusAndCarInfo.workHourlyPrice == '') {
      message.error('请输入工时单价');
      return false;
    }
    // 拿到结算方式的默认值
    const defaultPayWayId = this.props.defaultTypeValue.defaultPayWayId
    const defaultPayWayNo = this.props.defaultTypeValue.defaultPayWayNo
    const defaultPayWay = this.props.defaultTypeValue.defaultPayWay
    const workHourlyPrice = this.props.cusAndCarInfo.workHourlyPrice;
    const carModelId = this.props.cusAndCarInfo.carModelId;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        workVisible: true,
        list: { ...this.props.list, workHourlyPrice, repairCarModelId: carModelId },
        worksSettleType: defaultPayWay,
        worksSettleCode: defaultPayWayNo,
        worksSettleId: defaultPayWayId,
        resolve, reject,
      })
    }).then(() => {
      // 发送请求
      this.props.QueryWorkItemPage(this.props.list);
    })
  };


  // 商品模态框显示
  showGoods = () => {
    const _th = this;
    if (this.props.cusAndCarInfo.carModelId == '') {
      message.error('请输入车主姓名');
    } else {
      const id = this.props.cusAndCarInfo.carModelId;
      const goodsObj = this.props.goodsObj;
      // 拿到结算方式的默认值
      const defaultPayWayId = _th.props.defaultTypeValue.defaultPayWayId
      const defaultPayWayNo = _th.props.defaultTypeValue.defaultPayWayNo
      const defaultPayWay = _th.props.defaultTypeValue.defaultPayWay
      this.props.getDicDataByCategoryCode();
      new Promise((resolve, reject) => {
        this.props.modalReset({
          goodsVisible: true,
          goodsObj: { ...goodsObj, carModelId: id },
          goodsSettleWay: defaultPayWay,
          goodsSettleCode: defaultPayWayNo,
          goodsSettleId: defaultPayWayId,
          resolve, reject,
        })
      }).then(() => {
        // 发送请求获取数据
        _th.props.QueryFastProductForPage(this.props.goodsObj);
      })
    }
  };
  // 表格头部
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
          onClick={this.showCombo}
        >
          套餐
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.showGroup}
        >
          组合
        </Button>
        <Button
          type='primary'
          className='mr20'
          style={{ display: type == 'workHour' ? 'inline-block' : 'none' }}
          onClick={this.showWorkHouse}
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
          onClick={this.showGoods}
        >
          商品
        </Button>
      </Row>
    );
    return HeaderRender;
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

  /** 保存工单 */
  handleSaveTable = () => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll([
      'cusNama',
      'fuelMeterScaleName',
      'estimatedCarDeliveryDate',
      'carSenderName',
      'carSenderPhone',
      'inStoreMileage',
      'scEmpName',
      'bizTypeName',
      'workHourlyPrice',
    ], (err, values) => {
      if (!err) {
        const { cusAndCarInfo, orderType, } = this.props;
        const ids = cusAndCarInfo.id;
        new Promise((resolve, reject) => {
          this.props.tableReset({
            submitLoading: true,
            cusAndCarInfo: { ...cusAndCarInfo, id: orderType == 'copy' ? '' : ids },
            resolve, reject
          })
        }).then(() => {
          const workDataSource = _.cloneDeep(this.props.workHoursDataSource);
          const goodDataSource = _.cloneDeep(this.props.goodsDataSource);
          workDataSource.splice(workDataSource.length - 1, 1);
          goodDataSource.splice(goodDataSource.length - 1, 1);
          const SaveWorkOrdeVo = {
            mstrVo: this.props.cusAndCarInfo,
            workItemsDetVos: workDataSource,
            goodsDetVos: goodDataSource,
          };
          new Promise((resolve, reject) => {
            this.props.saveWorkOrder(SaveWorkOrdeVo);
          }).then(_ => {
            new Promise((resolve, reject) => {
              this.props.seeQueryWorkOrder(this.props.isId);
            }).then(_ => {
              this.props.form.setFieldsValue({ estimatedCarDeliveryDate: this.props.cusAndCarInfo.estimatedCarDeliveryDate });
            })
          })

        })
      }
    },
    );
  };

  // 工单转施工单
  handleChangeTable = () => {
    const { cusAndCarInfo, isId, selectedWorkRowKeys, workHoursDataSource } = _.cloneDeep(this.props);
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
      return message.error('请选择工项');
    } else {
      const params = { woId: cusAndCarInfo.id, workItemIds: selectedWorkRowKeys };
      this.props.convertWorkProcessOrder(params)
    }
  };

  // 工单完工
  handleCompleteTable = () => {
    const { isId } = this.props;
    if (!isId) {
      message.error('请先保存工单');
      return false;
    }
    this.props.finishWorkOrder();
  }

  /** 提交工单 */
  handleSubmitTable = () => {
    const { cusAndCarInfo, defaultTypeValue: { isAutoGoods } } = this.props;
    if (isAutoGoods == '10000000') { //自动发料需要查库存
      this.props.querySettlementGoodsInventory({ woId: cusAndCarInfo.id })
    } else {
      // 正常结算
      this.props.MODAL_SET_STATE({ calculateVisible: true, tableLoading: true });
      this.props.seeQueryWorkOrder(cusAndCarInfo.id);
    }
    this.props.TABLE_SET_STATE({ isId: '' });
  };

  render() {
    const {
      workHoursDataSource, dropDownWorkHoursTable, fetching,
      fetchs, workHoursTotalMoney, workHoursTotalNum, workHoursReceiveMoney,
      goodsDataSource, goodsTotalMoney, goodsTotalNum, goodsReceiveMoney,
      selectedWorkHoursRowKeys, selectedGoodsRowKeys, workBizType, settleType, scEmp,
      dropDownGoodsTable, selectedComboRowKeys, cusAndCarInfo,
    } = this.props
    const workHourHeader = this.getTableHeaderRender('workHour');
    const goodsHeader = this.getTableHeaderRender('goods');
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
          optionRender: getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' }),
          onChange: (row, option, id) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'bizTypeName', 'workHoursDataSource');
          },
        }
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'workHoursDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' }),
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
            { validatorFn: value => !!value, errMsg: '请输入折扣率' },
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
        }
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
      // {
      //   title: '技师',
      //   key: 'technicianEmpName',
      //   dataIndex: 'technicianEmpName',
      //   width: 180,
      //   cellOption: {
      //     inputType: 'select',
      //     optionRender: getOptionRender(scEmp, { key: 'key', code: 'empNo', name: 'empName' }),
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
          optionRender: getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' }),
          onChange: (row, option) => {
            this.handleHeadSelectChange(row, option, 'bizTypeName', 'goodsDataSource');
          },
        }
      },
      {
        title: '结算方式',
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        width: 160,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleTypeName', 'goodsDataSource');
          },
        },
        headerOption: {
          actionType: 'batchOperation',
          inputType: 'select',
          optionRender: getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' }),
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
            { validatorFn: value => !!value, errMsg: '请输入折扣率' },
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

    return (
      <Style>
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
          style={{ width: '100%', margin: '20px 0' }}
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
            总金额： <label>{cusAndCarInfo.totalAmount || 0}</label>
          </span>
          <span className='mr20'>
            施工金额：<label>{cusAndCarInfo.workItemAmount || 0}</label>
          </span>
          <span className='mr20'>
            商品金额：<label>{cusAndCarInfo.goodsAmount || 0}</label>
          </span>
          <span className='mr20'>
            应收金额： <label>{cusAndCarInfo.receivableAmount || 0}</label>
          </span>
          <span className='mr20'>
            客户付费： <label> {cusAndCarInfo.payAmount || 0}</label>
          </span>
        </Row>
        {/* <Row style={{ marginTop: '8px', textAlign: 'center' }}>
          <Col>
            <Button
              type='primary'
              loading={this.props.submitLoading}
              className='mr20'
              onClick={this.handleSaveTable}
            >保存</Button>
            <Button onClick={this.handleChangeTable} type='primary' className='mr20' >转施工单</Button>
            <Button onClick={this.handleCompleteTable} className='mr20'
              style={{ display: cusAndCarInfo.woStatusCode == '70200000' || cusAndCarInfo.woStatusCode == '70200005' ? 'inline-block' : 'none' }}
            >完工</Button>
            <Button onClick={this.handleSubmitTable}
              style={{ display: cusAndCarInfo.woStatusCode == '70200010' ? 'inline-block' : 'none' }}
            >结算</Button>
          </Col>
        </Row> */}
      </Style>
    )
  }
}


const mapStateToProps = (state) => {
  const {
    workBizType, settleType, scEmp, goodsArr,
  } = state.baseData
  const {
    workHoursDataSource, dropDownWorkHoursTable, fetching, isId, selectedWorkRowKeys,
    fetchs, workHoursTotalMoney, workHoursTotalNum, workHoursReceiveMoney, tableLoading,
    goodsTotalMoney, goodsTotalNum, goodsReceiveMoney, selectedWorkHoursRowKeys,
    selectedGoodsRowKeys, goodsDataSource, dropDownGoodsTable, selectedComboRowKeys,
    decimalCount, workHourdisaounts, isBatch, submitLoading, cusAndCarInfo, defaultTypeValue,

  } = state.tableInfo
  const {
    comboObj, groupList, groupVisible, list, goodsObj, calculateVisible, queryLoading,
  } = state.modalInfo
  return {
    cusAndCarInfo, workHoursDataSource, dropDownWorkHoursTable, fetching, tableLoading,
    fetchs, workHoursTotalMoney, workHoursTotalNum, workHoursReceiveMoney,
    goodsTotalMoney, goodsTotalNum, goodsReceiveMoney, selectedWorkHoursRowKeys,
    selectedGoodsRowKeys, workBizType, settleType, scEmp, goodsDataSource,
    dropDownGoodsTable, defaultTypeValue, selectedComboRowKeys, goodsArr, list,
    decimalCount, workHourdisaounts, isBatch, comboObj, groupList, groupVisible,
    submitLoading, goodsObj, isId, selectedWorkRowKeys, calculateVisible, queryLoading,

  }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, RESET_STATE, } = dispatch.baseData
  const {
    TABLE_SET_STATE, TABLE_RESET_STATE, calculateTotal, tableReset, calculateBottomTotal,
    convertWorkProcessOrder, finishWorkOrder, saveWorkOrder,getWorkItemPage,
  } = dispatch.tableInfo
  const {
    searchTable, MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, QueryFastProductForPage,
    QueryGroupGoodsForPage, getDicDataByCategoryCode, QueryWorkItemPage, querySettlementGoodsInventory,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, TABLE_SET_STATE, TABLE_RESET_STATE, MODAL_SET_STATE,
    MODAL_RESET_STATE, searchTable, modalReset, calculateTotal, calculateBottomTotal,
    QueryGroupGoodsForPage, getDicDataByCategoryCode, QueryWorkItemPage, QueryFastProductForPage,
    tableReset, convertWorkProcessOrder, finishWorkOrder, querySettlementGoodsInventory,
    saveWorkOrder,getWorkItemPage,
  }
}

const QuickTables = Form.create()(QuickTable);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickTables)
