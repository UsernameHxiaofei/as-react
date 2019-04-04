// 基础模块
import React, { Component } from 'react'
import styled, { consolidateStreamedStyles } from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import { PersonAndCar } from '@/components/Common';
import * as _ from 'lodash';

// 方法
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import { getOptionRender, } from '../../common/methods';
import { showTotal, } from '../../common/components';
// UI组件
import {
  Form, Select, Pagination, Modal, Table, Button, Input, message,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {
  queryGroupGoodsDet,
} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class AddGroups extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }

  // 关闭清空字段
  CPhandleCancel = () => {
    const groupList = this.props.groupList;
    this.props.MODAL_SET_STATE({
      groupVisible: false,
      groupObj: {
        carModelId: '',
        groupGoodsId: '',
        priceTypeCode: '',
        workHourlyPrice: '',
        name: ''
      },
      groupList: { ...groupList, groupName: '' },
      groupSettleCode: '',
    });
  };

  GSwayss = (value, Option) => {
    if (value == undefined || Option == undefined) {
      this.props.MODAL_SET_STATE({
        groupSettleType: '',
        groupSettleId: '',
        groupSettleCode: '',
      });
    } else {
      this.props.MODAL_SET_STATE({
        groupSettleType: Option.props.children,
        groupSettleId: Option.props.id,
        groupSettleCode: value,
      });
    }
  };

  // 价格方案改变事件
  priceWay = (value, Option) => {
    const groupObj = this.props.groupObj;
    if (value == undefined || Option.props == undefined) {
      this.props.MODAL_SET_STATE({
        groupObj: { ...groupObj, priceTypeCode: '', name: '' },
      });
    } else {
      this.props.MODAL_SET_STATE({
        groupObj: { ...groupObj, priceTypeCode: value, name: Option.props.children },
      });
    }
  };

  // 组合添加到表格
  adddWHG = (record) => {
    const _th = this;
    const { groupObj, cusAndCarInfo } = this.props;
    if (groupObj.priceTypeCode == '') {
      message.error('请选择价格方案');
    }
    const workHourlyPrice = cusAndCarInfo.workHourlyPrice;
    const carModelId = cusAndCarInfo.carModelId;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        groupObj: {
          ...groupObj,
          carModelId,
          groupGoodsId: record.id,
          workHourlyPrice,
        },
        resolve, reject
      })
    }).then(() => {
      queryGroupGoodsDet(this.props.groupObj).then((res) => {
        if (res.success) {
          let goodsModalList = [...res.data.additionList, ...res.data.competitiveList, ...res.data.spareList];
          let worksModalList = res.data.workList;
          // 如果这两个数组的length都为0
          if (goodsModalList.length == 0 && worksModalList.length == 0) {
            // 提示用户这个组合中没有商品了
            message.error('这个组合中没有商品请选择别的组合');
            return false;
          }
          if (res.data.noPriceList.length != 0) {
            let str = '';
            res.data.noPriceList.map((item, index) => {
              str += `${item},`;
            });
            let price = `${_th.props.groupObj.name}`
            message.error(`这个组合中${str}这项未维护${price},不能添加到工单`);
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
          goodsModalList.map((item) => {
            item.qty = + this.props.comboNumber;
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
              settleTypeId: this.props.groupSettleId, // 结算方式ID,
              settleTypeCode: this.props.groupSettleCode, // 结算方式编码,
              settleTypeName: this.props.groupSettleType, // 结算方式名称,
              price: item.price, // 单价,
              qty: + this.props.comboNumber, // 数量,
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
          worksModalList.map((item) => {
            item.qty = + this.props.comboNumber;
            const tabledListss = {
              combo: 1,
              key: item.goodsId,
              workNeeded: 0,
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
              settleTypeId: this.props.groupSettleId, // 结算方式ID,
              settleTypeCode: this.props.groupSettleCode, // 结算方式编码,
              settleTypeName: this.props.groupSettleType, // 结算方式名称,
              price: item.price, // 单价,
              qty: + this.props.comboNumber, // 数量,
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
          let workHoursDataSource = _.cloneDeep(this.props.workHoursDataSource);
          let goodsDataSource = _.cloneDeep(this.props.goodsDataSource);
          const Wlength = workHoursDataSource.length;
          const Glength = goodsDataSource.length;
          const {
            defaultWorkTypeId,
            defaultWorkTypeNo,
            defaultWorkType,
            defaultPayWayId,
            defaultPayWayNo,
            defaultPayWay,
          } = this.props.defaultTypeValue;
          if (Wlength == 1) {
            // 添加第一条数据
            workArr.map(item => {
              item.bizTypeId = defaultWorkTypeId;
              item.bizTypeCode = defaultWorkTypeNo;
              item.bizTypeName = defaultWorkType;
              item.settleTypeId = this.props.groupSettleId;
              item.settleTypeCode = this.props.groupSettleCode;
              item.settleTypeName = this.props.groupSettleType;
              item.discountRate = 1.0;
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
            })
            workHoursDataSource = [...workArr, ...workHoursDataSource];
          } else {
            workArr.map(item => {
              item.bizTypeId = workHoursDataSource[workHoursDataSource.length - 2].bizTypeId;
              item.bizTypeCode = workHoursDataSource[workHoursDataSource.length - 2].bizTypeCode;
              item.bizTypeName = workHoursDataSource[workHoursDataSource.length - 2].bizTypeName;
              item.settleTypeId = this.props.groupSettleId;
              item.settleTypeCode = this.props.groupSettleCode;
              item.settleTypeName = this.props.groupSettleType;
              item.discountRate = 1.0;
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
            })
            workHoursDataSource.splice(Wlength - 1, 0, ...workArr)
          }
          if (Glength == 1) {
            // 添加第一条数据
            goodsArr.map((item) => {
              item.bizTypeId = defaultWorkTypeId;
              item.bizTypeCode = defaultWorkTypeNo;
              item.bizTypeName = defaultWorkType;
              item.settleTypeId = this.props.groupSettleId;
              item.settleTypeCode = this.props.groupSettleCode;
              item.settleTypeName = this.props.groupSettleType;
              item.discountRate = 1.0;
              item.qty = + this.props.comboNumber;
              item.amount = + this.props.comboNumber * item.price || 0;
              item.receivableAmount = + this.props.comboNumber * item.price || 0;
            });
            goodsDataSource = [...goodsArr, ...goodsDataSource];
          } else {
            goodsArr.map((item) => {
              item.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
              item.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
              item.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
              item.settleTypeId = this.props.groupSettleId;
              item.settleTypeCode = this.props.groupSettleCode;
              item.settleTypeName = this.props.groupSettleType;
              item.discountRate = 1.0;
              item.qty = + this.props.comboNumber;
              item.amount = + this.props.comboNumber * item.price || 0;
              item.receivableAmount = + this.props.comboNumber * item.price || 0;
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
            item.issuedQty = 0;
          });
          new Promise((resolve, reject) => {
            this.props.tableReset({
              workHoursDataSource,
              goodsDataSource,
              resolve, reject
            }).then(() => {
              _th.props.calculateTotal('workHoursDataSource');
              _th.props.calculateTotal('goodsDataSource');
            })
            this.props.modalReset({
              groupVisible: false,
              groupObj: {
                carModelId: '',
                groupGoodsId: '',
                priceTypeCode: '',
                workHourlyPrice: '',
                name: ''
              },
              groupSettleCode: '',
              resolve, reject
            })
          })
        }
      });
    })

  };



  groupNameEnter = (e) => {
    const _th = this;
    const value = e.target.value;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        groupList: { ...this.props.groupList, groupName: value, index: 1 },
        resolve, reject,
      })
    }).then(() => {
      _th.props.QueryGroupGoodsForPage(this.props.groupList);
    })
  };

  groupNameChange = (e) => {
    const value = e.target.value;
    this.props.MODAL_SET_STATE({
      groupList: { ...this.props.groupList, groupName: value, },
    });
  };


  onCpCurrentPage = (current) => {
    const _th = this;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        pagecurrent: current,
        groupList: { ...this.props.groupList, index: current },
        resolve, reject,
      })
    }).then(() => {
      _th.props.QueryGroupGoodsForPage(this.props.groupList);
    })
  };

  render() {
    const {
      groupVisible, groupSettleCode, settleType, priceLists, groupList,
      groupDataSource, pagecurrent, groupObj, groupPageTotal,
    } = this.props
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

    return (
      <Style>
        <Modal
          width='850px'
          visible={groupVisible}
          onCancel={this.CPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={groupSettleCode}
                onChange={this.GSwayss}
                placeholder='结算方式'
              >
                {getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>价格方案:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={groupObj.priceTypeCode}
                onChange={this.priceWay}
              >
                {getOptionRender(priceLists, { key: 'key', code: 'dicCode', name: 'dicValue' })}
              </Select>
            </span>

            <span>
              <Input
                style={{ width: '120px' }}
                value={groupList.groupName}
                onPressEnter={this.groupNameEnter}
                onChange={this.groupNameChange}
                placeholder='输入组合名称'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table
            dataSource={groupDataSource}
            columns={CPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={groupPageTotal}
              pageSize={groupList.pageSize}
              current={pagecurrent}
              showTotal={showTotal}
              onChange={this.onCpCurrentPage}
            />
          </div>
        </Modal>
      </Style>
    )


  }
}

const mapStateToProps = (state) => {
  const {
    settleType,
  } = state.baseData
  const {
    workHoursDataSource, goodsDataSource, cusAndCarInfo, defaultTypeValue,
  } = state.tableInfo
  const {
    groupVisible, groupSettleCode, groupObj, priceLists, groupList, comboNumber,
    groupDataSource, groupPageTotal, pagecurrent, groupSettleId, groupSettleType,

  } = state.modalInfo

  return {
    groupVisible, groupSettleCode, settleType, groupObj, priceLists,
    groupList, groupDataSource, groupPageTotal, pagecurrent, cusAndCarInfo,
    defaultTypeValue, groupSettleId, groupSettleType, workHoursDataSource,
    goodsDataSource, comboNumber,
  }
}

const mapDispatchToProps = (dispatch) => {
  const { } = dispatch.baseData
  const {
    calculateTotal, calculateBottomTotal, tableReset, TABLE_SET_STATE, TABLE_RESET_STATE,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, QueryGroupGoodsForPage, getDicDataByCategoryCode,
    modalReset,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE, QueryGroupGoodsForPage, getDicDataByCategoryCode,
    modalReset, calculateTotal, calculateBottomTotal, tableReset, TABLE_SET_STATE,
    TABLE_RESET_STATE,
  }
}

const AddGroup = Form.create()(AddGroups);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGroup)