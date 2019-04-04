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
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import { getOptionRender, } from '../../common/methods';
import { showTotal, } from '../../common/components';

// UI组件
import {
  Form, Select, Pagination, Modal, Table, Button, Input, message, DatePicker,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class AddWorkHours extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  GShandleCancel = () => {
    let list = this.props.list
    this.props.MODAL_SET_STATE({
      list: { ...list, keyWord: '' },
      workVisible: false,
      comboNumber: 1,
      worksSettleType: '',
      worksSettleCode: '',
      worksSettleId: '',
    });
  };
  // 结算方式变化
  GSway = (value, Option) => {
    if (value == undefined || Option.props == undefined) {
      this.props.MODAL_SET_STATE({
        worksSettleType: '',
        worksSettleCode: '',
        worksSettleId: '',
      });
    } else {
      this.props.MODAL_SET_STATE({
        worksSettleType: Option.props.children,
        worksSettleCode: value,
        worksSettleId: Option.key,
      });
    }
  };
  // 工项数量变化
  XGnumberChange = (e) => {
    const value = e.target.value;
    this.props.MODAL_SET_STATE({
      comboNumber: value,
    });
    this.props.MODAL_SET_STATE({
      tabledList: { ...this.props.tabledList, qty: value },
    });
  };
  // 关键字改变
  keyWordChange = (e) => {
    const value = e.target.value;
    this.props.MODAL_SET_STATE({
      list: { ...this.props.list, keyWord: value },
    });
  };
  // 回车关键字查询
  keyWordEnter = (e) => {
    const value = e.target.value;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        list: { ...this.props.list, keyWord: value, page: 1 },
        resolve, reject
      })
    }).then(() => {
      this.props.QueryWorkItemPage(this.props.list);
    })
  };
  // 工时的分页查询
  onwsCurrentPage = (current) => {
    new Promise((resolve, reject) => {
      this.props.modalReset({
        pagecurrent: current,
        list: { ...this.props.list, page: current },
        resolve, reject
      })
    }).then(() => {
      this.props.QueryWorkItemPage(this.props.list);
    })
  };

  // 工项添加表格到
  addTabled = (record) => {
    // console.log(record)
    const _th = this;
    const tabledList = _.cloneDeep(this.props.tabledList);
    if (this.props.worksSettleCode == '') {
      message.error('请选择结算方式');
      return false;
    }
    new Promise((resolve, reject) => {
      this.props.modalReset({
        tabledList: {
          ...tabledList,
          qty: +this.props.comboNumber,
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
          amount: +this.props.comboNumber * record.price || 0,
          receivableAmount: +this.props.comboNumber * record.price || 0,
        },
        resolve, reject
      })
    }).then(() => {
      const tabledList = _.cloneDeep(this.props.tabledList);
      let workHoursDataSource = _.cloneDeep(this.props.workHoursDataSource);
      const length = workHoursDataSource.length;
      const {
        defaultWorkTypeId,
        defaultWorkTypeNo,
        defaultWorkType,
      } = this.props.defaultTypeValue;
      if (length == 1) {
        // 添加第一条数据
        tabledList.bizTypeId = defaultWorkTypeId;
        tabledList.bizTypeCode = defaultWorkTypeNo;
        tabledList.bizTypeName = defaultWorkType;
      } else {
        tabledList.bizTypeId = workHoursDataSource[length - 2].bizTypeId;
        tabledList.bizTypeCode = workHoursDataSource[length - 2].bizTypeCode;
        tabledList.bizTypeName = workHoursDataSource[length - 2].bizTypeName;
      }
      tabledList.settleTypeId = this.props.worksSettleId;
      tabledList.settleTypeCode = this.props.worksSettleCode;
      tabledList.settleTypeName = this.props.worksSettleType;
      workHoursDataSource.splice(length - 1, 0, tabledList);
      workHoursDataSource.map((item, index) => {
        item.workHoursNum = index + 1;
        item.key = index + Math.random();
        item.issuedQty = 0;
      });
      new Promise((resolve, reject) => {
        this.props.tableReset({
          workHoursDataSource,
          resolve, reject
        })
        this.props.modalReset({
          workVisible: false,
          comboNumber: 1,
          list: { ...this.props.list, keyWord: '' },
          worksSettleType: '',
          worksSettleCode: '',
          worksSettleId: '',
          resolve, reject
        })
      }).then(() => {
        _th.props.calculateTotal('workHoursDataSource');
        // _th.props.calculateBottomTotal();
      })
    })
  };


  render() {
    const {
      workVisible, worksSettleCode, comboNumber, list, settleType, workModalTable,
      worksPageTotal, pagecurrent,
    } = this.props
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

    return (
      <Style>
        <Modal
          width='850px'
          visible={workVisible}
          onCancel={this.GShandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={worksSettleCode}
                onChange={this.GSway}
                placeholder='结算方式'
              >
                {getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={comboNumber}
                onChange={this.XGnumberChange}
                placeholder='默认数量'
              />
            </span>
            <span>
              <Input
                style={{ width: '120px' }}
                value={list.keyWord}
                onPressEnter={this.keyWordEnter}
                onChange={this.keyWordChange}
                placeholder='输入工项名称'
              />
            </span>
          </div>
          {/* 表格 */}
          <Table dataSource={workModalTable} columns={columns} bordered pagination={false} />
          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={worksPageTotal}
              pageSize={list.pageSize}
              current={pagecurrent}
              showTotal={showTotal}
              onChange={this.onwsCurrentPage}
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
    workHoursDataSource, defaultTypeValue,
  } = state.tableInfo
  const {
    workVisible, worksSettleType, worksSettleCode, worksSettleId, comboNumber,
    list, workModalTable, worksPageTotal, pagecurrent, tabledList,
  } = state.modalInfo

  return {
    workVisible, worksSettleType, worksSettleCode, worksSettleId, comboNumber,
    list, workModalTable, worksPageTotal, pagecurrent, settleType, tabledList,
    workHoursDataSource, defaultTypeValue,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    tableReset, calculateTotal, calculateBottomTotal,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, QueryWorkItemPage,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, QueryWorkItemPage,
    tableReset, calculateTotal, calculateBottomTotal,
  }
}

const AddWorkHour = Form.create()(AddWorkHours);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddWorkHour)