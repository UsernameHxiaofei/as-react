
import React,{Component} from 'react'
import {Modal,Button, Row, Col, Table, Select,InputNumber, Form} from 'antd'

import {connect} from 'react-redux'
import { DatePicker } from 'antd';


class CKmodal extends Component {


// 关闭
  printCancel = () => {
    this.props.SET_STATE({
      CKVisible: false,
      lookObj:{
        procNo:'',
        procStatusName:'',
        createEmpName:'',
        createDate:'',
        cusName:'',
        carPlateNo:'', //车牌号
        vin:'',
        carBrandName:"",
        carSeriesName:'',
        carModelName:'',
        memberNo:'',
        woNo:'',
        cusDesc:'',
        repairAdvice:'',
        precheckResult:'',
        totalWorkHour :'',
        estimatedCarDeliveryDate:'',
        estimateFinishDate:''
      },
      lookList:[]
    })
  }
  render () {
    const {
      procNo,
      procStatusName,
      createEmpName,
      createDate,
      cusName,
      carPlateNo, //车牌号
      vin,
      carBrandName,
      carSeriesName,
      carModelName,
      memberNo,
      woNo,
      cusDesc,
      repairAdvice,
      precheckResult,
      totalWorkHour,
      estimatedCarDeliveryDate,
      estimateFinishDate
    } = this.props.lookObj
    console.log('aaaaa',this.props.lookObj)
    const columns = [{
      title: '序号',
      key: 'age',
      width:50,
      render: (record) => (
        <div>
          {record.key + 1}
        </div>
      )
    }, {
      title: '维修类型',
      key: 'address',
      render: (record) => (
        <div>
        {record.bizTypeName}
        </div>
      )
    },
    {
      title: '工项编码',
      key: 'name',
      render: (record) => (
        <div>
          {record.goodsNo}
        </div>
      )
    }, {
      title: '工项名称',
      key: '9999',
      render: (record) => (
        <div>
          {record.goodsName}
        </div>
      )
    }, {
      title: '班组',
      key: 'action',
      render: (record) => (
        <div>
          {record.workTeamName}
        </div>
      )
    } , {
      title: '技师',
      key: 'teacher',
      render: (record) => (
        <div>
          {record.workTechnicianName}
        </div>
      )
    } , {
      title: '工位',
      key: 'weiiz',
      render: (record) => (
        <div>
          {record.workLocationName}
        </div>
      )
    }, , {
      title: '派工工时',
      key: 'time',
      render: (record) => (
        <div>
         { record.workHour}
        </div>
      )
    }]

    return (
      <Modal
                title='施工单详情'
                visible={this.props.CKVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                width='80%'
                footer={[
              ]}
                >

                <div>
                  <Row>
                    <Col span={12}>
                      <span>施工单号:{procNo}</span>
                    </Col>
                    <Col span={12}>
                      <span>状态:{procStatusName}</span>
                      <span style={{marginLeft:'20px'}}>制单人:{createEmpName}</span>
                      <span style={{marginLeft:'20px'}}>开单时间:{createDate}</span>
                    </Col>
                    </Row>

                    <div style={{marginTop: '20px'}}>
                    <Row>
                    <Col span={8}>
                      <span>客户姓名:{cusName}</span>
                    </Col>
                    <Col span={8}>
                      <span>车牌号:{carPlateNo}</span>
                    </Col>
                    <Col span={8}>
                      <span>VIN:{vin}</span>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={8}>
                      <span>车型:{carModelName}</span>
                      {/* <span>车型:{carBrandName  + ' '  + carSeriesName + ' '  + carModelName}</span> */}
                    </Col>
                    <Col span={8}>
                      <span>会员号:{memberNo}</span>
                    </Col>
                    </Row>
                    <hr/>
                    </div>
                    <div style={{marginTop: '20px'}}>
                    <Row>
                    <Col span={8}>
                      <span>工单号:{woNo}</span>
                    </Col>
                    <Col span={8}>
                      <span>客户描述:{cusDesc}</span>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={8}>
                      <span>维修建议:{repairAdvice}</span>
                    </Col>
                    <Col span={8}>
                      <span>预检结果:{precheckResult}</span>
                    </Col>
                    <Col span={8}>
                      <span>工时合计:{totalWorkHour}</span>
                    </Col>
                    <Col span={8}>
                      <span>预计交车时间:{estimatedCarDeliveryDate}</span>
                    </Col>
                    </Row>
                    <hr/>
                    </div>

                  <div style={{marginTop: '20px'}}>
                  <Table
                    dataSource={this.props.lookList}
                    columns={columns}
                    scroll={{x:1500}}
                    pagination={false}
                    bordered />
                    <hr/>
                  </div>

                  <div>
                    预计完工时间:{estimateFinishDate}
                  </div>
                </div>
        </Modal>
    )
  }
}



const mapStateToProps = (state) => {
  const {CKVisible,id,lookObj,lookList}  = state.constructionordermanagement
  return {CKVisible,id,lookObj,lookList}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.constructionordermanagement
  return {SET_STATE}
}


export default connect (
  mapStateToProps,
  mapDispatchToProps
)(CKmodal)
 