
import React,{Component} from 'react'
import {Modal,Button, Row, Col, Table, Select, Form, Input, message} from 'antd'
import {connect} from 'react-redux'
import { DatePicker } from 'antd'
import {checkWorkProcessOrder} from '@/services/getData'

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item

class YSmodals extends Component {

  componentWillMount = () => {
    this.props.GetHrEmpMstrByOrgId()
    this.props.GetDicDataByCategoryCode('7175')
    let obj = JSON.parse(localStorage.getItem('loginInfo')).login 
    this.props.SET_STATE({
      name: obj.empName,
      ID:obj.empId,
      YSdata:{...this.props.YSdata,checkEmpId:obj.empId, checkEmpName:obj.empName}
    })
  }

  // async GetHrEmpMstrByOrgId () {
  //   const res = await getHrEmpMstrByOrgId()
  //   console.log(res)
  //   if (res.success) {
  //     res.data.map((item, index) => {
  //       item['key'] = index
  //     })
  //     this.props.SET_STATE({
  //       peoperList:res.data
  //     })
  //   }
  // }

  // 验收施工单
  async CheckWorkProcessOrder (obj) {
    const res = await checkWorkProcessOrder (obj)
    if (res.success) {
      message.success('验收成功')
      this.props.SET_STATE({
        lookObj:{
          procNo:'',
          procStatusName:'',
          createEmpName:'',
          createDate:'',
          cusName:'',
          carPlateNo:'',
          vin:'',
          carBrandName:'',
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
        lookList:[],
        YSdata:{
          procId:'',
          checkResultId :'4e1996aea03c4e639d6b28d80eeb9138',
          checkResultCode :'71750000',
          checkResultName :'首验合格',
          checkRemark :'',
          checkEmpId :'',
          checkEmpName:''
        },
        YSVisible: false
      })
      this.props.ListWorkProcessOrder(this.props.data)
    } else {
      message.error(res.msg)
    }
  }

  // 验收结果改变
  checkResultCodeChange = (value, option) => {
    this.props.SET_STATE({
      YSdata:{...this.props.YSdata, checkResultCode:value,checkResultId:option.props.id,checkResultName:option.props.children}
    })
  }

  peoperhandleChange = (value, option) => {
    this.props.SET_STATE({
      YSdata:{...this.props.YSdata, checkEmpId:option.props.id,checkEmpName:option.props.children}
    })
  }

  checkRemarkChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      YSdata:{...this.props.YSdata, checkRemark:value}
    })
  }


  printCancel = () => {
    this.props.SET_STATE({
      YSVisible: false,
      YSdata:{
        procId:'',
        checkResultId :'4e1996aea03c4e639d6b28d80eeb9138',
        checkResultCode :'71750000',
        checkResultName :'首验合格',
        checkRemark :'',
        checkEmpId :'',
        checkEmpName:''
      },
      lookObj:{
        procNo:'',
        procStatusName:'',
        createEmpName:'',
        createDate:'',
        cusName:'',
        carPlateNo:'', //车牌号
        vin:'',
        carBrandName:'',
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
      lookList:[],
    })
  }

  // 确认派工
  Sure = () => {
    // 在表单验证通过的情况下拿到所有的数据发送请求
    this.props.form.validateFields(
      ['result', 'ren'],
      (err) => {
        if (!err) {
          // 发送请求
          this.CheckWorkProcessOrder(this.props.YSdata)
        }
      },
    );

  }

  render () {
    const {
      procNo,
      procStatusName,
      createEmpName,
      createDate,
      cusName,
      carPlateNo,
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
    const { getFieldDecorator } = this.props.form
    const formLeftLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
      },
    }


    const columns = [{
      title: '序号',
      key: 'age',
      width:50,
      render: (record) => (
        <div>
          {record.key+1}
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
        <span>
          {record.workTeamName}
        </span>
      )
    } , {
      title: '技师',
      key: 'teacher',
      render: (record) => (
        <span>
          {record.workTechnicianName}
        </span>
      )
    } , {
      title: '工位',
      key: 'weiiz',
      render: (record) => (
        <span>
          {record.workLocationName}
        </span>
      )
    }, , {
      title: '派工工时',
      key: 'time',
      render: (record) => (
        <span>
          {record.workHour}
        </span>
      )
    }]

    return (
      <Modal
                title='施工单验收'
                visible={this.props.YSVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                width='80%'
                footer={[
                    <Button type='primary' onClick={this.Sure}>
                      确认验收
                    </Button>,
                ]}
                >

                <div style={{maxHeight:'460px', overflow:'auto'}}>
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
                      {/* <span>车型:{carBrandName  + ' '  + carSeriesName + ' '  + carModelName}</span> */}
                      <span>车型:{carModelName}</span>
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

                  <Form>
                  <Row>

                    <Col span={6}>
                    <FormItem label='验收结果' {...formLeftLayout}>
                    {getFieldDecorator('result', {
                      initialValue: this.props.YSdata.checkResultCode,
                      rules: [{
                        required: true, message: '请选择验收结果!',
                      }],
                    })(
                      <Select
                          showSearch
                          placeholder="请选择验收结果"
                          optionFilterProp="children"
                          // value={this.props.YSdata.checkResultCode}
                          onChange={this.checkResultCodeChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {this.props.result.map((item, index) => {
                            return <Option key={index} id={item.id} value={item.dicCode}>{item.dicValue}</Option>
                          })}
                        </Select>
                    )}
              </FormItem>
                    </Col>

                    <Col span={6}>
                    <FormItem label='验收人' {...formLeftLayout}>
                    {getFieldDecorator('ren', {
                      initialValue: this.props.name,
                      rules: [{
                        required: true, message: '请选择验收人!',
                      }],
                    })(
                      <Select
                          showSearch
                          placeholder="请选择验收人"
                          optionFilterProp="children"
                          onChange={this.peoperhandleChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                         {this.props.list.map((item, index) => {
                           return <Option key={index} value={item.empNo} id={item.empId}>{item.empName}</Option>
                         })}
                        </Select>
                    )}
              </FormItem>
                    </Col>


                    <Col span={12}>
                    <FormItem label='验收备注' {...formLeftLayout}>
                    {getFieldDecorator('beizu', {
                      initialValue: this.props.YSdata.checkRemark
                    })(
                      <Input placeholder='请输入验收备注' onChange={this.checkRemarkChange} />
                    )}
              </FormItem>
                    </Col>
                    </Row>


                  </Form>



                </div>
        </Modal>
    )
  }
}



const mapStateToProps = (state) => {
  const {list,name, ID,YSVisible,result,YSdata,lookObj,lookList,peoperList,data}  = state.constructionordermanagement
  return {list,name,ID,YSVisible,result,YSdata,lookObj,lookList,peoperList,data}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,
          GetDicDataByCategoryCode,
          ListWorkProcessOrder,
          GetHrEmpMstrByOrgId} = dispatch.constructionordermanagement
  return {SET_STATE,
    GetDicDataByCategoryCode,
    ListWorkProcessOrder,
    GetHrEmpMstrByOrgId}
}

const YSmodal = Form.create()(YSmodals)
export default connect (
  mapStateToProps,
  mapDispatchToProps
)(YSmodal)
