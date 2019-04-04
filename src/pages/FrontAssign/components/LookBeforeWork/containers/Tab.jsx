import React from 'react'
import {Row,Col,Table} from 'antd'
import {connect} from 'react-redux'


class Tab extends React.Component{
  render () {
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'index',
      align: "center",
      width:'50px'
    }, {
      title: '工项编号',
      key: 'number',
      dataIndex: 'goodsNo',
      align: "center",
      width:'200px',
    }, {
      title: '工项名称',
      dataIndex: 'goodsName',
      key: 'name',
      align: "center",
      width:'100px'
    }, {
      title: '业务类型',
      dataIndex: 'bizTypeName',
      align: "center",
      key: 'type',
      width:'100px'
    }, {
      title: '结算方式',
      dataIndex: 'settleTypeName',
      align: "center",
      key: 'way',
      width:'100px'
    }, {
      title: '价格',
      dataIndex: 'price',
      align: "center",
      key: 'price',
      width:'100px'
    }, {
      title: '数量',
      align: "center",
      dataIndex: 'qty',
      key: 'num',
      width:'100px'
    }, {
      title: '金额',
      align: "center",
      dataIndex: 'amount',
      key: 'money',
      width:'100px'
    }, {
      title: '折扣率',
      dataIndex: 'discountRate',
      align: "center",
      key: 'Hui',
      width:'100px'
    }, {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      align: "center",
      key: 'Ymoney',
      width:'100px'
    },
    // {
    //   title: '技师',
    //   dataIndex: 'technicianEmpName',
    //   key: 'Teacher',
    //   width:'100px'
    // }
  ]

    const Scolumns = [{
      title: '序号',
      align: "center",
      dataIndex: 'key',
      key: 'index',
      width:'50px'
    }, {
      title: '商品编码',
      dataIndex: 'goodsNo',
      align: "center",
      key: 'number',
      width:'200px'
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: "center",
      key: 'name',
      width:'100px'
    }, {
      title: '业务类型',
      dataIndex: 'bizTypeName',
      align: "center",
      key: 'type',
      width:'100px'
    }, {
      title: '结算方式',
      dataIndex: 'settleTypeName',
      align: "center",
      key: 'way',
      width:'100px'
    }, {
      title: '价格',
      dataIndex: 'price',
      align: "center",
      key: 'price',
      width:'100px'
    }, {
      title: '数量',
      dataIndex: 'qty',
      align: "center",
      key: 'num',
      width:'100px'
    }, {
      title: '金额',
      dataIndex: 'amount',
      align: "center",
      key: 'money',
      width:'100px'
    }, {
      title: '折扣率',
      dataIndex: 'discountRate',
      align: "center",
      key: 'Hui',
      width:'100px'
    }, {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      align: "center",
      key: 'Ymoney',
      width:'100px'
    }, {
      title: '发料数量',
      dataIndex: 'issuedQty',
      align: "center",
      key: 'Teacher',
      width:'100px'
    }]



    return (
      <div>
        <div style={{marginTop:'20px'}}>
         <Row>
              <Col span={24}>
              <Table
              dataSource={this.props.worksList}
              columns={columns}
              pagination={false}
              bordered
              scroll={{ y: 400, x: 1700 }}
              footer={() =>  {
                return (
                  <div>
                    <div> <span style={{marginLeft:'20px'}}>数量合计:{(this.props.worktotalnum/10000).toFixed(2)}</span>  <span style={{marginLeft:'400px'}}>金额总计:{(this.props.worktotalmoney/10000).toFixed(2)}</span> <span style={{marginLeft:'400px'}}>应收金额总计:{(this.props.workTotalYmoney/10000).toFixed(2)}</span> </div>
                  </div>
                )
              }}/>
              </Col>
            </Row>
      </div>
      <div style={{marginTop:'20px'}}>
         <Row>
              <Col span={24}>
              <Table
              dataSource={this.props.goodsList}
              columns={Scolumns}
              pagination={false}
              bordered
              scroll={{ y: 400, x: 1700 }}
              footer={() =>  {
                return (
                  <div>
                    <div> <span style={{marginLeft:'20px'}}>数量合计:{(this.props.goodsNUm/10000).toFixed(2)}</span>  <span style={{marginLeft:'400px'}}>金额总计:{(this.props.goodstotalmoney/10000).toFixed(2)}</span> <span style={{marginLeft:'400px'}}>应收金额总计:{(this.props.goodsTotalYmoney/10000).toFixed(2)}</span> </div>
                  </div>
                )
              }}/>
              </Col>
            </Row>
      </div>
      <div style={{marginTop:'20px'}}>
          <span style={{marginLeft:'40px'}}>总金额:{this.props.settlementDto.totalAmount}</span>
          <span style={{marginLeft:'40px'}}>施工金额:{this.props.settlementDto.workItemAmount}</span>
          <span style={{marginLeft:'40px'}}>商品金额:{this.props.settlementDto.goodsAmount}</span>
          <span style={{marginLeft:'40px'}}>应收金额:{this.props.settlementDto.receivableAmount}</span>
          <span style={{marginLeft:'40px'}}>客户付费:{this.props.settlementDto.payAmount}</span>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {goodsList,worksList,settlementDto,
    worktotalnum,
    worktotalmoney,
    workTotalYmoney,
    goodsNUm,
    goodstotalmoney,
    goodsTotalYmoney} = state.lookbeforeWork
  return {goodsList,worksList,settlementDto,worktotalnum,
    worktotalmoney,
    workTotalYmoney,
    goodsNUm,
    goodstotalmoney,
    goodsTotalYmoney}
}
const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.lookbeforeWork
  return {SET_STATE}
}

export default connect(mapStateToProps,mapDispatchToProps)(Tab)
