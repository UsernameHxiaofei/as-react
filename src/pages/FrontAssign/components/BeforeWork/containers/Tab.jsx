import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';

import { Table, Divider, Pagination, Spin } from 'antd'
import { } from '@/services/getData'

import { connect } from 'react-redux'
import { env } from '../../../../../config/env/'
const { REDIRECTION_URL: { LookBeforeWork, FrontAssignOrder }, HOST } = env

class Tab extends Component {

  componentDidMount = () => {
    
  }

  edit = (record) => { //编辑事件
    const data = {
      id: record.id,
      jumpFlag: true,
    };
    // const _data = JSON.stringify(data);// 转为字符串
    // const autoMessage = {
    //   name: '编辑前装工单', index: `orderEdit${record.id}`, url: 'FrontAssignOrder', resId: `${record.id + 1}`, infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST); 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/FrontAssignOrder', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(FrontAssignOrder, data, { title: '编辑前装工单' });
      });
    }
  }

  look = (record) => {//查看事件
    const data = {
      id: record.id,
      jumpFlag: true,
    };
    // const _data = JSON.stringify(data);// 转为字符串
    // const autoMessage = {
    //   name: '查看前装工单', index: `orderLook${record.id}`, url: 'LookBeforeWork', resId: `${record.id + 2}`, infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST); 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/LookBeforeWork', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(LookBeforeWork, data, { title: '查看前装工单' });
      });
    }
 }

  aready = (record) => { //已完工事件
    let id = record.id
    this.props.FinishWorkOrder(id, this.props.data)
  }

  backWork = (record) => {//返工事件
    let id = record.id
    this.props.FeworkWorkOrder(id, this.props.data)
  }

  playCory = (record) => {//打印事件
    let id = record.id
    this.props.SET_STATE({
      palyVisible: true,
      ID: id
    })
  }

  noUsu = (record) => {//作废事件
    let id = record.id
    this.props.SET_STATE({
      NoUseVisible: true,
      NoUseId: id,
      obj: record
    })
  }

  pageChange = (current) => {
    let data = { ...this.props.data, currentIndex: current }
    this.props.ListWorkProcessOrder(data)
  }

  render() {
    const columns = [{
      title: '工单信息',
      key: 'msg',

      width: 320,
      render: (record) => (
        <div>
          <div>工单号:{record.woNo}</div>
          <div>预约单号:{record.appointmentOrderNo}</div>
          <div>关联单号:{record.refWoNo}</div>
          <div>厂商单号:{record.oemOrderNo}</div>
          <div>业务类型:{record.bizTypeName}</div>
          <div>工单状态:{record.woStatusName}</div>
          <div>收款状态:{record.receiptStatusName}</div>
        </div>
      )
    }, {
      title: '客户车辆',
      key: 'age',
      width: 200,
      render: (record) => (
        <div>
          <div>客户姓名:{record.cusName}</div>
          <div>联系电话:{record.cusContactPhone}</div>
          <div>车牌号:{record.carPlateNo}</div>
          <div>VIN:{record.vin}</div>
        </div>
      )
    }, {
      title: '服务信息',
      key: 'address',
      width: 200,
      render: (record) => (
        <div>
          <div>服务接待:{record.scEmpName}</div>
          <div>制单人:{record.woCreatorEmpName}</div>
        </div>
      )
    },
    {
      title: '服务时间',
      key: 'name',

      width: 300,
      render: (record) => (
        <div>
          <div>开单时间:{record.wOrderOpenDate}</div>
          <div>预计完工:{record.expectCarDeliveryDate}</div>
          <div>结算时间:{record.settleDate}</div>
          {/* <div>收款时间:{record.scEmpName}</div> */}
        </div>
      )
    }, {
      title: '服务金额',
      key: '9999',
      render: (record) => (
        <div>
          <div>总金额:{record.amount.toFixed(2)}</div>
          <div>商品金额:{record.materialAmount.toFixed(2)}</div>
          <div>工项金额:{record.workItemAmount.toFixed(2)}</div>
          <div>优惠金额:{record.reduceAmount.toFixed(2)}</div>
          <div>抹零金额:{record.wipedAmount.toFixed(2)}</div>
          <div>应收金额:{record.receivableAmount.toFixed(2)}</div>
          <div>定金:{record.depositAmount == null ? 0.00 : record.depositAmount.toFixed(2)}</div>
        </div>
      )
    }, {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right',

      render: (record) => (
        <span>
          {/* 新建施工 */}
          {record.woStatusCode == '70200000' || record.woStatusCode == '70200005' ? <span>
            <a onClick={this.edit.bind(this, record)} href="javascript:;">编辑</a>
            <Divider type="vertical" />
            <a onClick={this.look.bind(this, record)} href="javascript:;">查看</a>
            <Divider type="vertical" />
            <a onClick={this.noUsu.bind(this, record)} href="javascript:;">作废</a>
            <Divider type="vertical" />
            <a onClick={this.aready.bind(this, record)} href="javascript:;">完工</a>
            {/* <Divider type="vertical" />
            <a onClick={this.playCory.bind(this, record)} href="javascript:;">打印</a> */}
          </span> : ''}
          {/* 已结算 */}
          {record.woStatusCode == '70200015' ? <span>
            <a onClick={this.look.bind(this, record)} href="javascript:;">查看</a>
            {/* <Divider type="vertical" />
            <a onClick={this.playCory.bind(this, record)} href="javascript:;">打印</a> */}
            <Divider type="vertical" />
            <a onClick={this.noUsu.bind(this, record)} href="javascript:;">作废</a>
          </span> : ''}
          {/* 已作废 */}
          {record.woStatusCode == '70200020' ? <span>
            <a onClick={this.look.bind(this, record)} href="javascript:;">查看</a>
            {/* <Divider type="vertical" />
            <a onClick={this.playCory.bind(this, record)} href="javascript:;">打印</a> */}
          </span> : ''}
          {/* 已完工 */}
          {record.woStatusCode == '70200010' ? <span>
            <a onClick={this.edit.bind(this, record)} href="javascript:;">编辑</a>
            <Divider type="vertical" />
            <a onClick={this.look.bind(this, record)} href="javascript:;">查看</a>
            <Divider type="vertical" />
            <a onClick={this.noUsu.bind(this, record)} href="javascript:;">作废</a>
            <Divider type="vertical" />
            <a onClick={this.backWork.bind(this, record)} href="javascript:;">返工</a>
            {/* <Divider type="vertical" />
            <a onClick={this.playCory.bind(this, record)} href="javascript:;">打印</a> */}
          </span> : ''}

        </span>
      )
    }]




    return (
      <div>
        <span>共{this.props.totalNumber}条</span>
        <Spin tip="玩命加载中..." spinning={this.props.spin}>
          <Table
            dataSource={this.props.tableList}
            columns={columns}
            pagination={false}
            scroll={{ x: 1600 }}
            bordered />
        </Spin>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Pagination
            size='small'
            showQuickJumper
            total={this.props.totalNumber}
            showTotal={total => `共 ${total} 条`}
            pageSize={this.props.data.pageSize}
            current={this.props.data.currentIndex}
            onChange={this.pageChange} />
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const { data, tableList, totalNumber, spin, NoUseId, obj } = state.beforeWork
  return { data, tableList, totalNumber, spin, NoUseId, obj }
}


const mapDispatchToProps = (dispatch) => {
  const { ListFrontLoadingLWorkOrder, SET_STATE, FinishWorkOrder, FeworkWorkOrder } = dispatch.beforeWork
  return { ListFrontLoadingLWorkOrder, SET_STATE, FinishWorkOrder, FeworkWorkOrder }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Tab))
