import React from 'react'
import {Row,Col,Table} from 'antd'
import {connect} from 'react-redux'


class Tab extends React.Component{
  render () {


    const columns = [{
      title: '序号',
      key: 'index',
      align: "center",
      dataIndex: 'key',
      width:'50px'
    }, {
      title: '工项编号',
      key: 'number',
      align: "center",
      width:'200px',
      dataIndex: 'goodsNo',
    }, {
      title: '工项名称',
      key: 'name',
      align: "center",
      dataIndex: 'goodsName',
      width:'100px'
    }, {
      title: '业务类型',
      align: "center",
      key: 'type',
      dataIndex: 'bizTypeName',
      width:'100px'
    }, {
      title: '结算方式',
      align: "center",
      dataIndex: 'settleTypeName',
      key: 'way',
      width:'100px'
    }, {
      title: '价格',
      align: "center",
      dataIndex: 'price',
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
      align: "center",
      dataIndex: 'discountRate',
      key: 'Hui',
      width:'100px'
    }, {
      title: '应收金额',
      align: "center",
      dataIndex: 'receivableAmount',
      key: 'Ymoney',
      width:'100px'
    },
    // {
    //   title: '技师',
    //   key: 'Teacher',
    //   dataIndex: 'technicianEmpName',
    //   width:'100px'
    // }
  ]

    const Scolumns = [{
      title: '序号',
      align: "center",
      key: 'index',
      dataIndex: 'key',
      width:'50px'
    }, {
      title: '商品编码',
      align: "center",
      dataIndex: 'goodsNo',
      key: 'number',
      width:'200px'
    }, {
      title: '商品名称',
      align: "center",
      dataIndex: 'goodsName',
      key: 'name',
      width:'100px'
    }, {
      title: '业务类型',
      align: "center",
      dataIndex: 'bizTypeName',
      key: 'type',
      width:'100px'
    }, {
      title: '结算方式',
      align: "center",
      dataIndex: 'settleTypeName',
      key: 'way',
      width:'100px'
    }, {
      title: '价格',
      align: "center",
      dataIndex: 'price',
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
      align: "center",
      dataIndex: 'discountRate',
      key: 'Hui',
      width:'100px'
    }, {
      title: '应收金额',
      align: "center",
      dataIndex: 'receivableAmount',
      key: 'Ymoney',
      width:'100px'
    }, {
      title: '发料数量',
      align: "center",
      dataIndex: 'issuedQty',
      key: 'Teacher',
      width:'100px'
    }]

    const {totalAmount, workItemAmount,payType, payAmount, goodsAmount, receivableAmount} = this.props.settlementDto


    return (
      <div>
        <div style={{marginTop:'20px'}}>
         <Row>
              <Col span={24}>
              <Table
              dataSource={this.props.workTable}
              columns={columns}
              pagination={false}
              bordered
              scroll={{ y: 400, x: 1700 }}
              footer={() =>  {
                return (
                  <div>
                    <div> <span style={{marginLeft:'20px'}}>数量合计:{this.props.worktotalnum/10000}</span>  <span style={{marginLeft:'400px'}}>金额总计:{this.props.worktotalmoney/10000}</span> <span style={{marginLeft:'400px'}}>应收金额总计:{this.props.workTotalYmoney/10000}</span> </div>
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
              dataSource={this.props.goodsTable}
              columns={Scolumns}
              pagination={false}
              bordered
              scroll={{ y: 400, x: 1700 }}
              footer={() =>  {
                return (
                  <div>
                    <div> <span style={{marginLeft:'20px'}}>数量合计:{this.props.goodsNUm/10000}</span>  <span style={{marginLeft:'400px'}}>金额总计:{this.props.goodstotalmoney/10000}</span> <span style={{marginLeft:'400px'}}>应收金额总计:{this.props.goodsTotalYmoney/10000}</span> </div>
                  </div>
                )
              }}/>
              </Col>
            </Row>
      </div>
      <div style={{marginTop:'20px'}}>
          <span style={{marginLeft:'40px'}}>总金额:{totalAmount}</span>
          <span style={{marginLeft:'40px'}}>施工金额:{workItemAmount}</span>
          <span style={{marginLeft:'40px'}}>商品金额:{goodsAmount}</span>
          <span style={{marginLeft:'40px'}}>应收金额:{receivableAmount}</span>
          <span style={{marginLeft:'40px'}}>客户付费:{payAmount}</span>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {data,mstrDto,goodsTable,workTable,settlementDto,worktotalnum,worktotalmoney,workTotalYmoney,goodsNUm,goodstotalmoney,goodsTotalYmoney} = state.lookquerywork
  return {data,mstrDto,goodsTable,workTable,settlementDto,worktotalnum,worktotalmoney,workTotalYmoney,goodsNUm,goodstotalmoney,goodsTotalYmoney}
}
const mapDispatchToProps = (dispatch) => {
  const {} = dispatch.lookquerywork
  return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(Tab)
