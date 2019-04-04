import React from 'react'
import { Row, Col, Anchor } from 'antd'
import { connect } from 'react-redux'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
const { Link } = Anchor

class Search extends React.Component {
  componentDidMount = () => {
    // this.props.QueryWorkOrder(this.props.data) //测试数据
    // window.addEventListener('message', (e) => {
    //   if (e.data) {
    //     const data = JSON.parse(e.data)
    //     let newdata = {
    //       woId: data.id,
    //       page: 1,
    //       pageSize: 1000
    //     }
    //     this.props.QueryWorkOrder(newdata)
    //   }
    // })
    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        let newdata = {
          woId: data.id,
          page: 1,
          pageSize: 1000
        }
        this.props.QueryWorkOrder(newdata)
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
         if (req.jumpFlag) {
          const data = req;
          let newdata = {
            woId: data.id,
            page: 1,
            pageSize: 1000
          }
          this.props.QueryWorkOrder(newdata)
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
      vin,
      carPlateNo,
      carEngineeNo,
      carBrandName,
      carSeriesName,
      carModelName,
      carColorName,
      carPowerTypeName,
      fuelMeterScaleName,
      workHourlyPrice,
      estimatedCarDeliveryDate,
      carSenderName,
      carSenderPhone,
      inStoreMileage,
      scEmpName,
      bizTypeName,
      oemOrderNo,
      repairAdvice,
      cusDesc,
      precheckResult,
      carWash,
      cusRoadTestDrive,
      cusTakeOldParts,
      carWait,
      appointmentOrderNo
    } = this.props.mstrDto

    return (
      <div style={{ marginBottom: '40px' }}>
        <div>
        <p className='list-page_title'>查看维修开单</p>
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
                <div>VIN:{vin}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>车牌号:{carPlateNo}</div>
              </Col>
              <Col span={6}>
                <div>发动机号:{carEngineeNo}</div>
              </Col>
              <Col span={12}>
                {/* <div>车型:{carBrandName + ' ' + carSeriesName + ' ' + carModelName}</div> */}
                <div>车型:{carModelName}</div>
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
                <div>工时单价:{workHourlyPrice}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>预计交车:{estimatedCarDeliveryDate}</div>
              </Col>
              <Col span={6}>
                <div>送修人:{carSenderName}</div>
              </Col>
              <Col span={6}>
                <div>送修人电话:{carSenderPhone}</div>
              </Col>
              <Col span={5}>
                <div>进店里程:{inStoreMileage}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>服务接待:{scEmpName}</div>
              </Col>
              <Col span={6}>
                <div>业务类型:{bizTypeName}</div>
              </Col>
              <Col span={6}>
                <div>厂商单号:{oemOrderNo}</div>
              </Col>
              <Col span={5}>
                <div>维修建议:{repairAdvice}</div>
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
                <div>预约单号:{appointmentOrderNo}</div>
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { data, mstrDto, goodsTable, workTable, settlementDto } = state.lookquerywork
  return { data, mstrDto, goodsTable, workTable, settlementDto }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, QueryWorkOrder } = dispatch.lookquerywork
  return { SET_STATE, QueryWorkOrder }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Search))
