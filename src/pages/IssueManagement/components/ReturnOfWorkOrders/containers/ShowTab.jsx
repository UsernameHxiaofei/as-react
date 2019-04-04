import React, { Component } from 'react'
import { Row, Col, Form, Table, Input, DatePicker, Button, Icon, Select } from 'antd'
import { connect } from 'react-redux'


class Tab extends Component {
  render () {
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'index',
      align: "center",
      width: '5%'
    }, {
      title: '工项编号',
      dataIndex: 'workItemNo',
      align: "center",
      key: 'workNUMBER',
      width: '20%'
    }, {
      title: '工项名称',
      dataIndex: 'workItemName',
      align: "center",
      key: 'name',
      width: '10%'
    }, {
      title: '业务类型',
      dataIndex: 'bizTypeName',
      align: "center",
      key: 'tpype',
      width: '10%'
    }, {
      title: '金额',
      dataIndex: 'amount',
      align: "center",
      render: (text, record) => (
        <span>
        {Number(text).toFixed(2)}
       </span>
    ),
      key: 'money',
      width: '10%'
    }, {
      title: '折扣率',
      dataIndex: 'discount',
      align: "center",
      key: 'she',
      width: '10%',
      render: (text, record) => (
        <span>
        {Number(text).toFixed(2)}
       </span>
    ),
    }, {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      align: "center",
      key: 'Ymoney',
      width: '10%',
      render: (text, record) => (
        <span>
        {Number(text).toFixed(2)}
       </span>
    ),
    }, {
      title: '优惠金额',
      dataIndex: 'reduceAmount',
      key: 'price',
      align: "center",
      width: '10%',
      render: (text, record) => (
        <span>
        {Number(text).toFixed(2)}
       </span>
    ),
    }, {
      title: '施工状态',
      dataIndex: 'workStatusName',
      key: 'state',
      align: "center",
      width: '10%'
    }]


    return (
      <div style={{marginTop:'20px'}}>
        <p className='list-page_title'>工项信息</p>
        <Table
         dataSource={this.props.showTable}
        columns={columns}
        scroll={{ y: 400, x:1300 }}
        bordered
        pagination={false} />
      </div>
    )
  }
}


const mapStateToPros = (state) => {
  const {showTable} = state.returnofworkorders
  return {showTable}
}


const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.returnofworkorders
  return {SET_STATE}
}

export default connect (
  mapStateToPros,
  mapDispatchToProps
) (Tab)
