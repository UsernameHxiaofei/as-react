import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Row, Col, Spin, Anchor, Table } from 'antd'
import { connect } from 'react-redux'

const { Link } = Anchor


class LookDecorationWorkOrdeManagement extends Component {

  componentDidMount = () => {
    // this.props.QueryWorkOrder({woId:'3ec4eb895acd47559fdc9aa9ce976bd3', page:1,pageSize:100000})

    // window.addEventListener('message', (e) => {
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     let obj = {
    //       woId: data.id,
    //       page: 1,
    //       pageSize: 100000
    //     }
    //     this.props.QueryWorkOrder(obj)
    //   }
    // });
    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        let obj = {
          woId: data.id,
          page: 1,
          pageSize: 100000
        }
        this.props.QueryWorkOrder(obj)
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          let obj = {
            woId: data.id,
            page: 1,
            pageSize: 100000
          }
          this.props.QueryWorkOrder(obj)
        }
      });
    }
  }


  render() {
    const {
      woNo,
      woStatusName,
      woCreatorEmpName,
      woCreateDate,
      cusName,
      cusContactPhone,
      memberNo,
      carPlateNo,
      vin,
      carBrandName,
      carSeriesName,
      carModelName,
      carEngineeNo,
      carColorName,
      carPowerTypeName,
      fuelMeterScaleName,
      estimatedCarDeliveryDate,
      bizTypeName,
      oemOrderNo,
      workHourlyPrice,
      scEmpName,
      precheckResult,
      repairAdvice,
      cusTakeOldParts,
      carWash,
      carWait,
      cusRoadTestDrive,
      cusDesc
    } = this.props.Info
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'index',
      align: "center",
      width: '50px'
    }, {
      title: '工项编号',
      key: 'number',
      dataIndex: 'goodsNo',
      align: "center",
      width: '300px',
    }, {
      title: '工项名称',
      dataIndex: 'goodsName',
      key: 'name',
      align: "center",
      width: '300px'
    }, {
      title: '业务类型',
      dataIndex: 'bizTypeName',
      align: "center",
      key: 'type',
      width: '100px'
    }, {
      title: '结算方式',
      dataIndex: 'settleTypeName',
      align: "center",
      key: 'way',
      width: '100px'
    }, {
      title: '价格',
      dataIndex: 'price',
      align: "center",
      key: 'price',
      width: '100px'
    }, {
      title: '数量',
      align: "center",
      dataIndex: 'qty',
      key: 'num',
      width: '100px'
    }, {
      title: '金额',
      align: "center",
      dataIndex: 'amount',
      key: 'money',
      width: '100px'
    }, {
      title: '折扣率',
      dataIndex: 'discountRate',
      align: "center",
      key: 'Hui',
      width: '100px'
    }, {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      align: "center",
      key: 'Ymoney',
      width: '100px'
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
      width: '50px'
    }, {
      title: '商品编码',
      dataIndex: 'goodsNo',
      align: "center",
      key: 'number',
      width: '300px'
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: "center",
      key: 'name',
      width: '300px'
    }, {
      title: '业务类型',
      dataIndex: 'bizTypeName',
      align: "center",
      key: 'type',
      width: '100px'
    }, {
      title: '结算方式',
      dataIndex: 'settleTypeName',
      align: "center",
      key: 'way',
      width: '100px'
    }, {
      title: '价格',
      dataIndex: 'price',
      align: "center",
      key: 'price',
      width: '100px'
    }, {
      title: '数量',
      dataIndex: 'qty',
      align: "center",
      key: 'num',
      width: '100px'
    }, {
      title: '金额',
      dataIndex: 'amount',
      align: "center",
      key: 'money',
      width: '100px'
    }, {
      title: '折扣率',
      dataIndex: 'discountRate',
      align: "center",
      key: 'Hui',
      width: '100px'
    }, {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      align: "center",
      key: 'Ymoney',
      width: '100px'
    }, {
      title: '发料数量',
      dataIndex: 'issuedQty',
      align: "center",
      key: 'Teacher',
      width: '100px'
    }]

    return (
      <Spin spinning={this.props.loading}>
        <div style={{ marginBottom: '40px' }}>
          <div>
            <p className='list-page_title'>查看装潢开单</p>
            <Col span={22}>
              <Row style={{ marginBottom: '10px' }}>
                <Col span={6}>
                  <div>工单号:{woNo}</div>
                </Col>
                <Col span={6}>
                  <div>状态:{woStatusName}</div>
                </Col>
                <Col span={6}>
                  <div>制单人:{woCreatorEmpName}</div>
                </Col>
                <Col span={6}>
                  <div>创建时间:{woCreateDate}</div>
                </Col>
              </Row>
              <Row>
                <Col span={20}><h3>基本信息</h3></Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <div>客户姓名:{cusName}</div>
                </Col>
                <Col span={6}>
                  <div>联系电话:{cusContactPhone}</div>
                </Col>
                <Col span={6}>
                  <div>会员号:{memberNo}</div>
                </Col>
                <Col span={5}>
                  <div>车牌号:{carPlateNo}</div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <div>VIN:{vin}</div>
                </Col>
                <Col span={12}>
                  <div>车型:{carModelName}</div>
                  {/* <div>车型:{carBrandName + ' ' + carSeriesName + " " + carModelName}</div> */}
                </Col>
                <Col span={6}>
                  <div>发动机号:{carEngineeNo}</div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <div>车辆颜色:{carColorName}</div>
                </Col>
                <Col span={6}>
                  <div>动力类型:{carPowerTypeName}</div>
                </Col>
                <Col span={6}>
                  <div>油表信息:{fuelMeterScaleName}</div>
                </Col>
                <Col span={5}>
                  <div>预计交车:{estimatedCarDeliveryDate}</div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <div>业务类型:{bizTypeName}</div>
                </Col>
                <Col span={6}>
                  <div>厂商单号:{oemOrderNo}</div>
                </Col>
                <Col span={6}>
                  <div>工时单价:{workHourlyPrice}</div>
                </Col>
                <Col span={5}>
                  <div>服务接待:{scEmpName}</div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={6}>
                  <div>客户描述:{cusDesc}</div>
                </Col>
                <Col span={6}>
                  <div>预检结果:{precheckResult}</div>
                </Col>
                <Col span={6}>
                  <div>维修建议:{repairAdvice}</div>
                </Col>
              </Row>
              <Row style={{ marginBottom: '20px' }}>
                <Col span={24}>
                  <div>工单备注:
              <span style={{ marginLeft: '200px' }}>{cusTakeOldParts == 1 ? '客户带走旧件' : ''}</span>
                    <span style={{ marginLeft: '200px' }}>{carWash == 1 ? '车辆洗车' : ''}</span>
                    <span style={{ marginLeft: '200px' }}>{carWait == 1 ? '客户等待' : ''}</span>
                    <span style={{ marginLeft: '200px' }}>{cusRoadTestDrive == 1 ? '客户路试' : ''}</span>
                  </div>
                </Col>
              </Row>
            </Col>
            {/* < Col span={2}>
        <Anchor affix={false} style={{float:'right'}}>
          <Link href="#" title="客户更新" />
          <Link href="#" title="车辆信息" />
          <Link href="#" title="维修历史" />
        </Anchor>
        </ Col> */}
          </div>
          <div>
            <div style={{ marginTop: '20px' }}>
              <Row>
                <Col span={24}>
                  <Table
                    dataSource={this.props.worksList}
                    columns={columns}
                    pagination={false}
                    bordered
                    scroll={{ y: 400, x: 1900 }}
                    footer={() => {
                      return (
                        <div>
                          <div> <span style={{ marginLeft: '20px' }}>数量合计:{(this.props.worktotalnum / 10000).toFixed(2)}</span>  <span style={{ marginLeft: '400px' }}>金额总计:{(this.props.worktotalmoney / 10000).toFixed(2)}</span> <span style={{ marginLeft: '400px' }}>应收金额总计:{(this.props.workTotalYmoney / 10000).toFixed(2)}</span> </div>
                        </div>
                      )
                    }} />
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Row>
                <Col span={24}>
                  <Table
                    dataSource={this.props.goodsList}
                    columns={Scolumns}
                    pagination={false}
                    bordered
                    scroll={{ y: 400, x: 1900 }}
                    footer={() => {
                      return (
                        <div>
                          <div> <span style={{ marginLeft: '20px' }}>数量合计:{(this.props.goodsNUm / 10000).toFixed(2)}</span>  <span style={{ marginLeft: '400px' }}>金额总计:{(this.props.goodstotalmoney / 10000).toFixed(2)}</span> <span style={{ marginLeft: '400px' }}>应收金额总计:{(this.props.goodsTotalYmoney / 10000).toFixed(2)}</span> </div>
                        </div>
                      )
                    }} />
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: '20px' }}>
              <span style={{ marginLeft: '40px' }}>总金额:{this.props.settlementDto.totalAmount}</span>
              <span style={{ marginLeft: '40px' }}>施工金额:{this.props.settlementDto.workItemAmount}</span>
              <span style={{ marginLeft: '40px' }}>商品金额:{this.props.settlementDto.goodsAmount}</span>
              <span style={{ marginLeft: '40px' }}>应收金额:{this.props.settlementDto.receivableAmount}</span>
              <span style={{ marginLeft: '40px' }}>客户付费:{this.props.settlementDto.payAmount}</span>
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}

const mapStateToProps = (state) => {
  const { Info, worksList, goodsList, settlementDto,
    worktotalnum,
    worktotalmoney,
    workTotalYmoney,
    goodsNUm,
    goodstotalmoney,
    goodsTotalYmoney,
    loading
  } = state.lookdecorationWorkOrderManagement
  return {
    Info, worksList, goodsList, settlementDto, worktotalnum,
    worktotalmoney,
    workTotalYmoney,
    goodsNUm,
    goodstotalmoney,
    goodsTotalYmoney,
    loading
  }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, QueryWorkOrder } = dispatch.lookdecorationWorkOrderManagement
  return { SET_STATE, QueryWorkOrder }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LookDecorationWorkOrdeManagement))
