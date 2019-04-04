// 基础模块
import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import * as _ from 'lodash';

// 方法
import { showTotal, DelErrorMsg } from '../../common/components';

// UI组件
import {
  Form, Pagination, Modal, Table, Button, Row, Input, LocaleProvider, DatePicker,
} from 'antd'

// API
import {
  queryComboGoodsDet,
} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class AddCombos extends Component {

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }

  // 套餐回车事件
  enterSearch = (e) => {
    const value = e.target.value;
    const comboObj = this.props.comboObj;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        comboVisible: true,
        comboObj: { ...comboObj, comboName: value, index: 1 },
        resolve,
        reject
      })
    }).then(_ => {
      this.props.searchTable(this.props.comboObj);
    })
  };

  TCchange = (e) => {
    const value = e.target.value;
    const comboObj = this.props.comboObj;
    this.props.MODAL_SET_STATE({
      comboObj: { ...comboObj, comboName: value },
    });
  };

  // 套餐数量的变化
  numberChange = (e) => {
    const value = e.target.value;
    this.props.goodsLists.map((item, index) => {
      item.qty = value;
    });
    this.props.worksLists.map((item, index) => {
      item.qty = value;
    });
    this.props.MODAL_SET_STATE({
      comboNumber: value,
    });
  };

  // 查询套餐的分页
  onCurrentPages = (current) => {
    const _th = this;
    const comboObj = this.props.comboObj;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        pagecurrent: current,
        comboObj: { ...comboObj, index: current },
        resolve, reject,
      })
    }).then(_ => {
      _th.props.searchTable(this.props.comboObj);
    })
  };

  // 套餐添加到表格
  AddTableds = (record) => {
    const _th = this;
    const ID = record.id;
    queryComboGoodsDet({ comboGoodsId: ID }).then((res) => {
      // console.log('添加套餐', res)
      if (res.success) {
        let infoData = [
          ...res.data.additionList,
          ...res.data.competitiveList,
          ...res.data.spareList,
          ...res.data.workList,
        ];
        new Promise((resolve, reject) => {
          this.props.modalReset({
            resolve, reject,
            infoData,
            goodsLists: [
              ...res.data.additionList,
              ...res.data.competitiveList,
              ...res.data.spareList,
            ],
            worksLists: [...res.data.workList],
          })
        }).then(() => {
          // 如果这两个数组的length都为0
          if (this.props.goodsLists.length == 0 && this.props.worksLists.length == 0) {
            // 提示用户这个组合中没有商品了
            message.error('这个套餐中没有商品请选择别的套餐');
            return false;
          }
          _.cloneDeep(this.props.infoData).map((item, index) => {
            item.key = index;
          });
          // 将商品的添加到商品或者工项
          const workArr = [];
          const goodsArr = [];
          _.cloneDeep(this.props.goodsLists).map((item, index) => {
            item.qty = this.props.comboNumber;
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
              qty: +this.props.comboNumber, // 数量,
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
          _.cloneDeep(this.props.worksLists).map((item, index) => {
            item.qty = this.props.comboNumber;
            const tabledListss = {
              key: item.goodsId + index,
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
              qty: +this.props.comboNumber, // 数量,
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
            workArr.map((item) => {
              item.bizTypeId = defaultWorkTypeId;
              item.bizTypeCode = defaultWorkTypeNo;
              item.bizTypeName = defaultWorkType;
              item.settleTypeId = defaultPayWayId;
              item.settleTypeCode = defaultPayWayNo;
              item.settleTypeName = defaultPayWay;
              item.discountRate = 1.0;
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
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
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
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
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
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
              item.qty = +this.props.comboNumber;
              item.amount = +this.props.comboNumber * item.price || 0;
              item.receivableAmount = +this.props.comboNumber * item.price || 0;
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
          new Promise((resolve, reject) => {
            this.props.modalReset({
              comboNumber: 1, // 清空字段
              comboVisible: false,
              resolve, reject
            })
            this.props.tableReset({
              workHoursDataSource,
              goodsDataSource,
              resolve, reject
            })
          }).then(() => {
            // arr设置key值
            _.cloneDeep(this.props.workHoursDataSource).map((item, index) => {
              item.key = item.goodsId + index;
            });
            _.cloneDeep(this.props.goodsDataSource).map((item, index) => {
              item.key = item.goodsId + index;
            });
            this.props.calculateTotal('workHoursDataSource');
            this.props.calculateTotal('goodsDataSource');
            // this.props.calculateBottomTotal()
          })
        })
      } else {
        DelErrorMsg(res.msg);
      }
    });
  };

  TChandleCancel = () => {
    const comboObj = this.props.comboObj;
    this.props.MODAL_SET_STATE({
      comboVisible: false,
      comboNumber: 1,
      comboObj: { ...comboObj, comboName: '' }
    });
  };


  render() {
    const {
      comboObj, comboVisible, comboTabledData, comboPageTotal, pagecurrent,
      comboNumber, infoData,
    } = this.props
    const comboColumns = [
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
    const expandedRowRender = () => {
      const tccolumns = [
        { title: '编码', key: 'date', render: record => <span>{record.goodsNo}</span> },
        { title: '名称', key: 'name', render: record => <span>{record.goodsName}</span> },
        { title: '价格', key: 'state', render: record => <span>{record.price}</span> },
      ];
      return <Table columns={tccolumns} dataSource={infoData} pagination={false} bordered />;
    };
    return (
      <Style>
        <Modal
          width='850px'
          visible={comboVisible}
          onCancel={this.TChandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>套餐:</label>
              <Input
                style={{ width: '120px' }}
                value={comboObj.comboName}
                onPressEnter={this.enterSearch}
                onChange={this.TCchange}
                placeholder='套餐名称'
              />
            </span>
            <span>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={comboNumber}
                onChange={this.numberChange}
                placeholder='默认数量'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table
            columns={comboColumns}
            // expandedRowRender={expandedRowRender}
            dataSource={comboTabledData}
            bordered
            // onExpand={this.onExpand.bind(this)}
            pagination={false}
          />
          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={comboPageTotal}
              pageSize={comboObj.pageSize}
              current={pagecurrent}
              showTotal={showTotal}
              onChange={this.onCurrentPages}
            />
          </div>
        </Modal>
      </Style>
    )
  }
}

const mapStateToProps = (state) => {
  const {
   
  } = state.baseData
  const {
    workHoursDataSource,goodsDataSource, defaultTypeValue,
  } = state.tableInfo
  const {
    comboObj, comboVisible, comboTabledData, comboPageTotal, pagecurrent,
    comboNumber, goodsLists, worksLists, infoData,
  } = state.modalInfo

  return {
    comboObj, comboVisible, comboTabledData, comboPageTotal, pagecurrent,
    comboNumber, goodsLists, worksLists, infoData,workHoursDataSource,
    goodsDataSource,defaultTypeValue,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
   
  } = dispatch.baseData
  const {
    tableReset,calculateTotal, calculateBottomTotal,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, searchTable,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, searchTable, calculateTotal,
    tableReset, calculateBottomTotal,
  }
}

const AddCombo = Form.create()(AddCombos);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCombo)