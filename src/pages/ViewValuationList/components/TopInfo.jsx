

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Row, Col, Anchor } from 'antd'
const { Link } = Anchor



class TopInfo extends Component {


  componentWillMount = () => {
    // this.props.QueryWorkOrderNoPage('f1db20ee48a44e7db0919863da30f2fe')

    const _th = this;
    // 跳转页面的逻辑
    // window.addEventListener('message', (e) => {
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     this.props.SET_STATE({
    //       isDefaultValue: { ...this.props.isDefaultValue, editId: data.id },
    //     });
    //     // 就发送请求获取数据(渲染页面)
    //     _th.props.QueryWorkOrderNoPage(data.id)
    //   }
    // })

    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        this.props.SET_STATE({
          isDefaultValue: { ...this.props.isDefaultValue, editId: data.id },
        });
        // 就发送请求获取数据(渲染页面)
        _th.props.QueryWorkOrderNoPage(data.id)
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          this.props.SET_STATE({
            isDefaultValue: { ...this.props.isDefaultValue, editId: data.id },
          });
          // 就发送请求获取数据(渲染页面)
          _th.props.QueryWorkOrderNoPage(data.id)
        }
      });
    }
  }




  render() {
    const { mstrVO } = this.props
    return (
      <div style={{ marginBottom: '20px' }}>
        <div>
        <p className='list-page_title'>查看估价单</p>
          <Col span={22}>
            <Row style={{ marginBottom: '10px' }}>
              <Col span={6}>
                <div>估价单号:{mstrVO.eoNo}</div>
              </Col>
              <Col span={5}>
                <div>状态:{mstrVO.eoStatusName}</div>
              </Col>
              <Col span={5}>
                <div>制单人:{mstrVO.eoCreatorEmpName}</div>
              </Col>
              <Col span={6}>
                <div>创建时间:{mstrVO.eoCreateDate}</div>
              </Col>
            </Row>
            <Row>
              <Col span={20}><h3>客户信息检索</h3></Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>客户姓名:{mstrVO.cusName}</div>
              </Col>
              <Col span={5}>
                <div>联系电话:{mstrVO.cusContactPhone}</div>
              </Col>
              <Col span={5}>
                <div>会员号:{mstrVO.memberNo}</div>
              </Col>
              <Col span={5}>
                <div>车牌号:{mstrVO.carPlateNo}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>车型:{mstrVO.carModelName}</div>
              </Col>
              <Col span={5}>
                <div>VIN:{mstrVO.vin}</div>
              </Col>
              <Col span={5}>
                <div>发动机号:{mstrVO.carEngineeNo}</div>
              </Col>
              <Col span={5}>
                <div>车辆颜色:{mstrVO.carColorName}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>动力类型:{mstrVO.carPowerTypeName}</div>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col span={20}><h3>基本信息检索</h3></Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>业务类型:{mstrVO.bizTypeName}</div>
              </Col>
              <Col span={5}>
                <div>服务接待:{mstrVO.scEmpName}</div>
              </Col>
              <Col span={5}>
                <div>工时单价:{mstrVO.workHourlyPrice}</div>
              </Col>
              <Col span={5}>
                <div>送修人:{mstrVO.carSenderName}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>送修人电话:{mstrVO.carSenderPhone}</div>
              </Col>
              <Col span={5}>
                <div>进店里程:{mstrVO.inStoreMileage}</div>
              </Col>
              <Col span={5}>
                <div>油表信息:{mstrVO.fuelMeterScaleName}</div>
              </Col>
              <Col span={5}>
                <div>预计交车:{mstrVO.estimatedCarDeliveryDate}</div>
              </Col>
            </Row>
            <Row style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <div>客户描述:{mstrVO.cusDesc}</div>
              </Col>
              <Col span={5}>
                <div>预检结果:{mstrVO.precheckResult}</div>
              </Col>
              <Col span={5}>
                <div>维修建议:{mstrVO.repairAdvice}</div>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <hr />
              </Col>
            </Row>
          </Col>


          < Col span={2}>
            <Anchor affix={false} style={{ float: 'right' }}>
              <Link href="#" title="客户信息检索" />
              <Link href="#" title="基本信息填写" />
              <Link href="#" title="选择维修工项" />
              <Link href="#" title="选择维修材料" />
              <Link href="#" title="估价金额" />
            </Anchor>
          </ Col>

          <Row>
            <Col span={24}>
              <h3>维修工项</h3>
            </Col>
          </Row>


        </div>


      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const { mstrVO, settlementVO, listGoodsVO, listWorkItemVO } = state.viewValuationList
  return { mstrVO, settlementVO, listGoodsVO, listWorkItemVO }
}

const mapDispatchToProps = (dispatch) => {
  const { QueryWorkOrderNoPage, SET_STATE } = dispatch.viewValuationList
  return { QueryWorkOrderNoPage, SET_STATE }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TopInfo))
