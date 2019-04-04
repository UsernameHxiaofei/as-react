
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Table, Divider, Pagination, Spin } from 'antd'
import { connect } from 'react-redux'

import { env } from '../../../config/env/'
const { REDIRECTION_URL: { AddEvaluationOrder, ViewValuationList }, HOST } = env

import { tableCreate } from '@/shared/hoc'

class Tab extends Component {
  componentDidMount = () => {
    // 调用方法渲染页面
    const { data } = this.props
    this.props.ListEvaluateOrder(data)

  }

  // 作废模态框显示
  ZFmodalshow = (record) => {
    this.props.SET_STATE({
      ZFVisible: true,
      id: record.id,
      woNo: record.woNo,
      carPlateNo: record.carPlateNo,
      vin: record.vin,
      eoNo: record.eoNo
    })
  }

  // 转工单显示
  ZGDmodalShow = (record) => {
    let id = record.id
    this.props.SET_STATE({
      ZGDVisible: true,
      id: id,
      eoNo: record.eoNo,
      carPlateNo: record.carPlateNo,
      vin: record.vin,
      eoStatusName: record.eoStatusName
    })
  }

  // 打印模态框显示
  DYmodalShow = (record) => {
    this.props.SET_STATE({
      id: record.id,
      DYprintVisible: true
    })
  }

  // 编辑
  edit = (record) => {
    let id = record.id
    // 跳转到估价单页面
    const data = {
      id: id,
      jumpFlag: true,
      type: 'editEo'
    }
    // const _data = JSON.stringify(data)
    // const autoMessage = {
    //   name: '编辑估价单', index: `edit${id}`, url: 'AddEvaluationOrder', resId: 'edit', infoData: _data,
    // }
    // window.parent.postMessage(autoMessage, HOST) 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/AddEvaluationOrder', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(AddEvaluationOrder, data, { title: '编辑估价单' });
      });
    }

  }



  // 查看页面
  looked = (record) => {
    // 跳转到查看页面
    const data = {
      id: record.id,
      jumpFlag: true,
    }
    // const _data = JSON.stringify(data)
    // const autoMessage = {
    //   name: '查看估价单', index: `looked${record.id}`, url: 'ViewValuationList', resId: 'looked', infoData: _data,
    // }
    // window.parent.postMessage(autoMessage, HOST) 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/ViewValuationList', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(ViewValuationList, data, { title: '查看估价单' });
      });
    }
  }





  showTotal = (total) => {
    return `共 ${total} 条`
  }
  currentChange = (current) => {
    const newData = { ...this.props.data, currentIndex: current }
    this.props.ListEvaluateOrder(newData)
  }

  render() {
    const {
      tableListDataSource,
      paginationInfo,
      selectedRowKeys,
      tableClassName,         // table className
      tableHeaderClassName,   // table上方容器className
    } = this.props;


    const columns = [{
      title: '估价单信息',
      key: 'name',
      width: '200px',
      render: (text, record) => (
        <div>
          <div>估价单号:{record.eoNo}</div>
          <div>估价单状态:{record.eoStatusName}</div>
          <div>工单号:{record.woNo}</div>
          <div>业务类型:{record.bizTypeName}</div>
        </div>
      )
    }, {
      title: '客户车辆',
      key: 'age',
      width: '200px',
      render: (text, record) => (
        <div>
          <div>客户姓名:{record.cusName}</div>
          <div>联系电话:{record.cusContactPhone}</div>
          <div>送修人:{record.carSenderName}</div>
          <div>联系电话:{record.carSenderPhone}</div>
          <div>车牌号:{record.carPlateNo}</div>
          <div>VIN:{record.vin}</div>
        </div>
      )
    }, {
      title: '服务信息',
      key: 'address',
      width: '200px',
      render: (text, record) => (
        <div>
          <div>服务接待:{record.scEmpName}</div>
          <div>制单人:{record.eoCreatorEmpName}</div>
          <div>开单时间:{record.eoCreateDate}</div>
        </div>
      )
    },
    {
      title: '服务金额',
      key: 'money',
      width: '200px',
      render: (text, record) => (
        <div>
          <div>工时总金额:{record.workItemAmount == null ? 0.00 : record.workItemAmount.toFixed(2)}</div>
          <div>商品总金额:{record.materialAmount == null ? 0.00 : record.materialAmount.toFixed(2)}</div>
          <div>客户付费:{record.payAmount == null ? 0.00 : record.payAmount.toFixed(2)}</div>
          <div>优惠总金额:{record.reduceAmount == null ? 0.00 : record.reduceAmount.toFixed(2)}</div>
          <div>应收总金额:{record.receivableAmount == null ? 0.00 : record.receivableAmount.toFixed(2)}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '160px',
      render: (text, record) => (
        <span>
          {record.eoStatusName == '新建' ?
            <span>
              <a onClick={this.edit.bind(this, record)} href="javascript:;">编辑</a>
              <Divider type="vertical" />
              <a onClick={this.looked.bind(this, record)} href="javascript:;">查看</a>
              <Divider type="vertical" />
              <a onClick={this.ZFmodalshow.bind(this, record)} href="javascript:;">作废</a>
              {/* <Divider type="vertical" />
              <a onClick={this.DYmodalShow.bind(this, record)} href="javascript:;">打印</a> */}
              <Divider type="vertical" />
              <a onClick={this.ZGDmodalShow.bind(this, record)} href="javascript:;">转工单</a>
            </span>
            : null}
          {record.eoStatusName == '已转工单' ?
            <span>
              <a onClick={this.looked.bind(this, record)} href="javascript:;">查看</a>
              {/* <Divider type="vertical" />
              <a onClick={this.DYmodalShow.bind(this, record)} href="javascript:;">打印</a> */}
            </span>
            : null}
          {record.eoStatusName == '已作废' ?
            <span>
              <a onClick={this.looked.bind(this, record)} href="javascript:;">查看</a>
            </span>
            : null}
        </span>
      )
    }]

    return (
      <div>
        <span>共{this.props.totalNumber}条</span>
        <Spin tip="Loading..." spinning={this.props.spin}>
          <Table
            size='small'
            className={tableClassName}
            dataSource={this.props.dataSource}
            columns={columns}
            bordered
            pagination={false} />
        </Spin>


        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Pagination
            size="small"
            total={this.props.totalNumber}
            showQuickJumper
            showTotal={this.showTotal}
            pageSize={this.props.data.pageSize}
            current={this.props.data.currentIndex}
            onChange={this.currentChange} />
        </div>
      </div>



    )
  }
}

const mapStateToProps = (state) => {
  const { ZFVisible, dataSource, data, totalNumber, spin } = state.valuationManagement
  return { ZFVisible, dataSource, data, totalNumber, spin }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, ListEvaluateOrder } = dispatch.valuationManagement
  return { SET_STATE, ListEvaluateOrder }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(tableCreate()(Tab)))
