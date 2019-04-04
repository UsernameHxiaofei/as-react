

import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Table, Anchor} from 'antd'
const {Link} = Anchor

class Tab extends Component{
  render () {
    const {
      totalNum,
      totalMoney,
      YtotalMoney,
      YHmoney,
      wtotalNum,
      wtotalMoney,
      wYtotalMoney,
      wYHmoney,
    } = this.props

  // 维修工项
    const columnss = [{
      title: '序号',
      key: 'key',
      width:50,
      render: (text,record) => (
        <span>{record.key}</span>
      )

    }, {
      title: '工项编码',
      key: 'code',
      width:300,
      render: (text,record) => (
        <span>{record.goodsNo}</span>
      )
    },{
      title: '工项名称',
      key: 'name',
      width:100,
      render: (text,record) => (
        <span>{record.goodsName}</span>
      )
    },{
      title: '业务类型',
      key: 'type',
      width:100,
      render: (text,record) => (
        <span>{record.bizTypeName}</span>
      )
    },{
      title: '结算方式',
      key: 'way',
      width:100,
      render: (text,record) => (
        <span>{record.settleTypeName}</span>
      )
    },{
      title: '价格',
      key: 'price',
      width:100,
      render: (text,record) => (
        <span>{record.price}</span>
      )
    },{
      title: '数量',
      key: 'NUm',
      width:100,
      render: (text,record) => (
        <span>{record.qty}</span>
      )
    },{
      title: '金额',
      key: 'money',
      width:100,
      render: (text,record) => (
        <span>{record.amount}</span>
      )
    },{
      title: '折扣率',
      key: 'lll',
      width:100,
      render: (text,record) => (
        <span>{record.discountRate}</span>
      )
    },{
      title: '应收金额',
      key: 'yMOney',
      width:100,
      render: (text,record) => (
        <span>{record.receivableAmount}</span>
      )
    },{
      title: '优惠金额',
      key: 'Ymoney',
      width:100,
      render: (text,record) => (
        <span>{record.reduceAmount}</span>
      )
    }]
  // 维修材料列表
    const columns = [{
      title: '序号',
      key: 'key',
      width:50,
      render: (text,record) => (
        <span>{record.key}</span>
      )

    }, {
      title: '商品编码',
      key: 'code',
      width:300,
      render: (text,record) => (
        <span>{record.goodsNo}</span>
      )
    },{
      title: '商品名称',
      key: 'name',
      width:200,
      render: (text,record) => (
        <span>{record.goodsName }</span>
      )
    },{
      title: '业务类型',
      key: 'type',
      width:100,
      render: (text,record) => (
        <span>{record.bizTypeName}</span>
      )
    },{
      title: '结算方式',
      key: 'way',
      width:100,
      render: (text,record) => (
        <span>{record.settleTypeName}</span>
      )
    },{
      title: '价格',
      key: 'price',
      width:100,
      render: (text,record) => (
        <span>{record.price }</span>
      )
    },{
      title: '数量',
      key: 'NUm',
      width:100,
      render: (text,record) => (
        <span>{record.qty}</span>
      )
    },{
      title: '金额',
      key: 'money',
      width:100,
      render: (text,record) => (
        <span>{record.amount}</span>
      )
    },{
      title: '折扣率',
      key: 'lll',
      width:100,
      render: (text,record) => (
        <span>{record.discountRate}</span>
      )
    },{
      title: '应收金额',
      key: 'yMOney',
      width:100,
      render: (text,record) => (
        <span>{record.receivableAmount}</span>
      )
    }]

    // 估价金额列表
    const Mcolumns = [{
      title: '工项总金额',
      key: 'key',
      render: (text,record) => (
        <span>{record.workItemAmount}</span>
      )

    }, {
      title: '商品总金额',
      key: 'code',
      render: (text,record) => (
        <span>{record.goodsAmount}</span>
      )
    },{
      title: '应收总金额',
      key: 'name',
      render: (text,record) => (
        <span>{record.totalAmount}</span>
      )
    },{
      title: '客户付费',
      key: 'type',
      render: (text,record) => (
        <span>{record.payAmount}</span>
      )
    },{
      title: '优惠总金额',
      key: 'way',
      render: (text,record) => (
        <span>{record.reducedAmount}</span>
      )
    }]

    return (
      <div>
            <div style={{marginTop:'10px'}}>

            <Table
            scroll={{ y: 240 }}
            dataSource={this.props.listWorkItemVO}
            columns={columnss}
            bordered
            pagination={false}
            scroll={{ y: 600, x:2000 }}
            footer={() =>  {
              return (
                <div>
                  <span>合计</span>
                  <div style={{float:'right'}}> <span style={{marginRight:'20px'}}>总数量:{wtotalNum}</span>  <span style={{marginRight:'20px'}}>总金额:{wtotalMoney}</span> <span style={{marginRight:'20px'}}>应收总金额:{wYtotalMoney}</span> <span>优惠总金额:{wYHmoney}</span> </div>
                </div>
              )
            }}/>
          </div>

          <div style={{marginTop:'20px'}}>
            <h3>维修材料</h3>
            <Table
            scroll={{ y: 600, x:2000 }}
            dataSource={this.props.listGoodsVO}
            columns={columns}
            bordered
            pagination={false}
            footer={() => {
              return (
                <div>
                  <span>合计</span>
                  <div style={{float:'right'}}> <span style={{marginRight:'20px'}}>总数量:{totalNum}</span>  <span style={{marginRight:'20px'}}>总金额:{totalMoney}</span> <span style={{marginRight:'20px'}}>应收总金额:{YtotalMoney}</span> <span>优惠总金额:{YHmoney}</span> </div>
                </div>
              )
            }}/>
          </div>

           <div style={{marginTop:'20px'}}>
            <h3>估价金额</h3>
            <Table
            dataSource={this.props.settlementVO}
            columns={Mcolumns}
            bordered
            pagination={false}/>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {settlementVO,
          listGoodsVO,
          listWorkItemVO,
          totalNum,
          totalMoney,
          YtotalMoney,
          YHmoney,
          wtotalNum,
          wtotalMoney,
          wYtotalMoney,
          wYHmoney,
        } = state.viewValuationList
  return {settlementVO,
          listGoodsVO,
          listWorkItemVO,
          totalNum,
          totalMoney,
          YtotalMoney,
          YHmoney,
          wtotalNum,
          wtotalMoney,
          wYtotalMoney,
          wYHmoney,
        }
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.viewValuationList
  return {SET_STATE}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab)
