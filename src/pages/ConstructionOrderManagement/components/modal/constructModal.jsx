
import React, { Component } from 'react'
import { Modal, Button, Row, Col, Table, message, Select, InputNumber, Form } from 'antd'
import { connect } from 'react-redux'
import { DatePicker } from 'antd'
import * as _ from 'lodash';
import { getEmployeeByWorkLocations, getStationList, dispatchingWorkProcessOrder, findMdmWorkTeamAndLocationByEmpId } from '@/services/getData'

const Option = Select.Option
const FormItem = Form.Item

class SGmodals extends Component {

  componentWillMount = () => {
    this.props.GetStationList()
    this.props.FindListMdmWorkTeamEmployee()
    this.props.FindListMdmWorkTeamNoPage()
    // let obj = {
    //   index:1,
    //   pageSize:10000,
    //   keyWord:'',
    //   deptId:'',
    //   dutyId:''
    // }
    // this.props.GetTechnicianVo(obj)
  }

  workHourChange = (record, value) => { // 派工工时改变事件
    if (!value) {
      value = 0
    }
    let arr = _.cloneDeep(this.props.dispatchingItems)
    let listArr = _.cloneDeep(this.props.lookList)
    let Opt = listArr.find((item) => { return item.id == record.id })
    let idx = listArr.findIndex((item) => { return item.id == record.id })
    listArr[idx] = { ...Opt, workHour: value }
    let Option = arr.find((item) => { return item.workProcessOrderDetId == record.id })
    let index = arr.findIndex((item) => { return item.workProcessOrderDetId == record.id })
    arr[index] = { ...Option, workHour: value }
    this.props.SET_STATE({
      dispatchingItems: arr,
      lookList: listArr
    })
    let Num = 0
    listArr.map((item, index) => {
      Num += (+item.workHour) * 100
    })
    this.props.SET_STATE({
      lookObj: { ...this.props.lookObj, totalWorkHour: Num / 100 }
    })
  }





  overTimeChange = (date, dateString) => { // 完工时间改变
    this.props.SET_STATE({
      PGobj: { ...this.props.PGobj, estimateFinishDate: dateString }
    })
  }

  printCancel = () => { // 关闭
    this.props.SET_STATE({
      SGVisible: false,
      lookObj: {
        procNo: '',
        procStatusName: '',
        createEmpName: '',
        createDate: '',
        cusName: '',
        carPlateNo: '',
        vin: '',
        carBrandName: '',
        carSeriesName: '',
        carModelName: '',
        memberNo: '',
        woNo: '',
        cusDesc: '',
        repairAdvice: '',
        precheckResult: '',
        totalWorkHour: '',
        estimatedCarDeliveryDate: '',
        estimateFinishDate: ''
      },
      // peoperList:[],
      PGobj: {
        procId: '',
        estimateFinishDate: ''
      }
    })
    this.props.form.resetFields()
  }


  async DispatchingWorkProcessOrder(obj) { // 施工单派工
    const res = await dispatchingWorkProcessOrder(obj)
    if (res.success) {
      message.success('施工单派工成功')
      this.props.SET_STATE({
        SGVisible: false,
        PGobj: { //派工的请求参数
          procId: '',
          estimateFinishDate: ''
        },
        dispatchingItems: [],
      })
      // 重新加载页面
      this.props.form.resetFields()
      this.props.ListWorkProcessOrder(this.props.data)
    } else {
      message.error(res.msg)
      this.props.SET_STATE({
        SGVisible: false,
        PGobj: { //派工的请求参数
          procId: '',
          estimateFinishDate: ''
        },
        dispatchingItems: [],
      })
      this.props.form.resetFields()
    }
  }


  Sure = () => { // 确认派工
    // 在表单验证通过的情况下拿到所有的数据发送请求提示用户结果关闭清空字段
    this.props.form.validateFields(
      (err) => {
        if (!err) {
          // 发送请求
          let arr = _.cloneDeep(this.props.dispatchingItems)
          let PGobj = _.cloneDeep(this.props.PGobj)
          console.log(PGobj)
          PGobj['dispatchingItems'] = arr
          let index = arr.filter((item, index) => {
            return item.workTeamName == '' && item.workTeamNo == '' && item.workTeamId == ''
          })
          let index1 = arr.filter((item, index) => {
            return item.workLocationName == '' && item.workLocationNo == '' && item.workLocationId == ''
          })
          let index2 = arr.filter((item, index) => {
            return item.workTechnicianName == '' && item.workTechnicianNo == '' && item.workTechnicianId == ''
          })
          if (index.length == 0 && index1.length == 0 & index2.length == 0) {
            this.DispatchingWorkProcessOrder(PGobj)
          } else {
            if (index.length > 0 && index1.length > 0 && index2.length > 0) {
              message.error('请输入班组，技师， 工位')
            } else if (index.length > 0 && index1.length > 0) {
              message.error('请输入班组， 技师')
            } else if (index1.length > 0 && index2.length > 0) {
              message.error('请输入技师， 工位')
            } else if (index.length > 0 && index2.length > 0) {
              message.error('请输入班组， 工位')
            } else if (index.length > 0) {
              message.error('请输入班组')
            } else if (index2.length > 0) {
              message.error('请输入技师')
            } else if (index1.length > 0) {
              message.error('请输入工位')
            }
          }
        }
      },
    )
  }


  xtChange = (record) => { // 同上功能
    let listArr = _.cloneDeep(this.props.lookList)
    let arr = _.cloneDeep(this.props.dispatchingItems)
    let index = record.key - 1
    let obj = listArr[index]
    let option = arr[index]
    listArr[index + 1] = {
      ...listArr[index + 1],
      workLocationId: obj.workLocationId, workLocationNo: obj.workLocationNo, workLocationName: obj.workLocationName,
      workTeamId: obj.workTeamId, workTeamNo: obj.workTeamNo, workTeamName: obj.workTeamName,
      workTechnicianId: obj.workTechnicianId, workTechnicianNo: obj.workTechnicianNo, workTechnicianName: obj.workTechnicianName
    }
    arr[index + 1] = {
      ...arr[index + 1],
      workLocationId: option.workLocationId, workLocationNo: option.workLocationNo, workLocationName: option.workLocationName,
      workTeamId: option.workTeamId, workTeamNo: option.workTeamNo, workTeamName: option.workTeamName,
      workTechnicianId: option.workTechnicianId, workTechnicianNo: option.workTechnicianNo, workTechnicianName: option.workTechnicianName
    }
    this.props.SET_STATE({
      lookList: listArr,
      dispatchingItems: arr
    })
  }

  async GetEmployeeByWorkLocations(workLocationId, record, value, option) {
    const res = await getEmployeeByWorkLocations({ workLocationId })
    console.log(option)
    if (res.success) {
      let data = res.data
      let arr = _.cloneDeep(this.props.dispatchingItems)
      let listArr = _.cloneDeep(this.props.lookList)
      let Opt = listArr.find((item) => { return item.id == record.id })
      let idx = listArr.findIndex((item) => { return item.id == record.id })
      listArr[idx] = { ...Opt, workLocationId: option.props.workLocationId, workLocationNo: value, workLocationName: option.props.children }
      let Option = arr.find((item) => { return item.workProcessOrderDetId == record.id })
      let index = arr.findIndex((item) => { return item.workProcessOrderDetId == record.id })
      arr[index] = { ...Option, workLocationId: option.props.workLocationId, workLocationNo: value, workLocationName: option.props.children }
      this.props.SET_STATE({
        peoperList: data,
        dispatchingItems: arr,
        lookList: listArr
      })
    }
  }

  workLocationNoHandleChange = (record, value, option) => { //工位发生改变
    let id = option.props.workLocationId
    this.GetEmployeeByWorkLocations(id, record, value, option)
  }


  workTeamNoHandleChange = (record, value, option) => { //班组发生改变
    // 班组发生改变的时候跟新record中班组的取值， 拿到班组的id请求接口获取对应的技师
    let id = option.props.workTeamId
    let No = value
    let name = option.props.children
    this.props.FindListMdmWorkTeamEmployeeByWorkTeamId(id)
    let arr = _.cloneDeep(this.props.dispatchingItems)
    let listArr = _.cloneDeep(this.props.lookList)
    let Opt = listArr.find((item) => { return item.id == record.id })
    let idx = listArr.findIndex((item) => { return item.id == record.id })
    listArr[idx] = { ...Opt, workTeamId: id, workTeamNo: No, workTeamName: name, workTechnicianId: '', workTechnicianNo: '', workTechnicianName: '', workLocationId: '', workLocationNo: '', workLocationName: '' }
    let Option = arr.find((item) => { return item.workProcessOrderDetId == record.id })
    let index = arr.findIndex((item) => { return item.workProcessOrderDetId == record.id })
    arr[index] = { ...Option, workTeamId: id, workTeamNo: No, workTeamName: name, workTechnicianId: '', workTechnicianNo: '', workTechnicianName: '', workLocationId: '', workLocationNo: '', workLocationName: '' }
    this.props.SET_STATE({
      dispatchingItems: arr,
      lookList: listArr
    })
  }


  async FindMdmWorkTeamAndLocationByEmpId(empId, record, value, option) { //根据技师id查询工位班组
    const res = await findMdmWorkTeamAndLocationByEmpId({ empId })
    if (res.success) {
      let data = res.data
      let arr = _.cloneDeep(this.props.dispatchingItems)
      let listArr = _.cloneDeep(this.props.lookList)
      let Opt = listArr.find((item) => { return item.id == record.id })
      let idx = listArr.findIndex((item) => { return item.id == record.id })
      listArr[idx] = { ...Opt, workTeamId: data.workTeamId, workTeamNo: data.workTeamNo, workTeamName: data.workTeamName, workTechnicianId: option.props.id, workTechnicianNo: value, workTechnicianName: option.props.children, workLocationId: data.workLocationId, workLocationNo: data.workLocationNo, workLocationName: data.workLocationName }
      let Option = arr.find((item) => { return item.workProcessOrderDetId == record.id })
      let index = arr.findIndex((item) => { return item.workProcessOrderDetId == record.id })
      arr[index] = { ...Option, workTeamId: data.workTeamId, workTeamNo: data.workTeamNo, workTeamName: data.workTeamName, workTechnicianId: option.props.id, workTechnicianNo: value, workTechnicianName: option.props.children, workLocationId: data.workLocationId, workLocationNo: data.workLocationNo, workLocationName: data.workLocationName }
      this.props.SET_STATE({
        dispatchingItems: arr,
        lookList: listArr
      })
      // // 从新查询一下
      // let obj = {
      //   index:1,
      //   pageSize:10000,
      //   keyWord:'',
      //   deptId:'',
      //   dutyId:''
      // }
      // this.props.GetTechnicianVo(obj)
      this.props.FindListMdmWorkTeamEmployee()
    }
  }

  workTechnicianNoHandleChange = (record, value, option) => { //技师发生改变
    let id = option.props.id
    this.FindMdmWorkTeamAndLocationByEmpId(id, record, value, option)
  }



  render() {
    const { getFieldDecorator } = this.props.form
    const {
      procNo,
      procStatusName,
      createEmpName,
      createDate,
      cusName,
      carPlateNo, //车牌号
      vin,
      carBrandName,
      carModelName,
      carSeriesName,
      memberNo,
      woNo,
      cusDesc,
      repairAdvice,
      precheckResult,
      totalWorkHour,
      estimatedCarDeliveryDate,
      estimateFinishDate
    } = this.props.lookObj
    const columns = [{
      title: '',
      key: '1111111111',
      render: (record) => (
        <a href="javascript:;" onClick={this.xtChange.bind(this, record)}>{record.key == 0 ? '' : '同上'}</a>
      )
    }, {
      title: '序号',
      key: '2222222222222222',
      render: (record) => (
        <div>
          {record.key + 1}
        </div>
      )
    }, {
      title: '维修类型',
      key: '333333333',
      render: (record) => (
        <div>
          {record.bizTypeName}
        </div>
      )
    },
    {
      title: '工项编码',
      key: '4444444444',
      render: (record) => (
        <div>
          {record.goodsNo}
        </div>
      )
    }, {
      title: '工项名称',
      key: '55555555',
      render: (record) => (
        <div>
          {record.goodsName}
        </div>
      )
    }, {
      title: '班组',
      key: '66666666666',
      render: (record) => (
        <Select
          showSearch
          style={{ width: 140 }}
          placeholder="请选择班组"
          value={record.workTeamName}
          onChange={this.workTeamNoHandleChange.bind(this, record)}
        >
          {this.props.classList.map((item, index) => {
            return <Option value={item.workTeamNo} workTeamId={item.id} key={index}>{item.workTeamName}</Option>
          })}
        </Select>
      )
    }, {
      title: '技师',
      key: '7777777777',
      render: (record) => (
        <Select
          showSearch
          style={{ width: 140 }}
          placeholder="请选择技师"
          optionFilterProp="children"
          value={record.workTechnicianName}
          onChange={this.workTechnicianNoHandleChange.bind(this, record)}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {this.props.peoperList.map((item, index) => {
            return <Option key={index + 1} value={item.empId} id={item.empId}>{item.empName}</Option>
          })}
        </Select>
      )
    }, {
      title: '工位',
      key: '88888888888',
      render: (record) => (
        <Select
          showSearch
          style={{ width: 140 }}
          value={record.workLocationName}
          onChange={this.workLocationNoHandleChange.bind(this, record)}
        >
          {this.props.workList.map((item, index) => {
            return <Option value={item.workLocationNo} workLocationId={item.id} key={index}>{item.workLocationName}</Option>
          })}
        </Select>
      )
    }, {
      title: '派工工时',
      key: '999999999',
      render: (record) => (
        <InputNumber value={record.workHour} min={0} onChange={this.workHourChange.bind(this, record)} />
      )
    }]

    return (
      <Modal
        title='施工单派工'
        visible={this.props.SGVisible}
        onCancel={this.printCancel}
        // maskClosable={false}
        // destroyOnClose={true}
        width='80%'
        footer={[
          <Button type='primary' onClick={this.Sure}>
            确认派工
                    </Button>
        ]}
      >
        <div style={{ maxHeight: '460px', overflow: 'auto' }}>
          <Row>
            <Col span={12}>
              <span>施工单号:{procNo}</span>
            </Col>
            <Col span={12}>
              <span>状态:{procStatusName}</span>
              <span style={{ marginLeft: '20px' }}>制单人:{createEmpName}</span>
              <span style={{ marginLeft: '20px' }}>开单时间:{createDate}</span>
            </Col>
          </Row>

          <div style={{ marginTop: '20px' }}>

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
            <div style={{ marginTop: '20px' }}>
              <Row>
                <Col span={8}>
                  <span>车型:{carModelName}</span>
                  {/* <span>车型:{carBrandName + ' ' + carSeriesName + ' ' + carModelName}</span> */}
                </Col>
                <Col span={8}>
                  <span>会员号:{memberNo}</span>
                </Col>
              </Row>
            </div>
            <hr />
          </div>


          <div style={{ marginTop: '20px' }}>
            <Row>
              <Col span={8}>
                <span>工单号:{woNo}</span>
              </Col>
              <Col span={8}>
                <span>客户描述:{cusDesc}</span>
              </Col>
            </Row>
            <div style={{ marginTop: '20px' }}>
              <Row>
                <Col span={8}>
                  <span>维修建议:{repairAdvice}</span>
                </Col>
                <Col span={8}>
                  <span>预检结果:{precheckResult}</span>
                </Col>
                <Col span={8}>
                  <span>工时合计:{(+totalWorkHour).toFixed(2)}</span>
                </Col>

              </Row>
              <div style={{ marginTop: '20px' }}>
                <Row>
                  <Col span={8}>
                    <span>预计交车时间:{estimatedCarDeliveryDate}</span>
                  </Col>
                </Row>
              </div>
            </div>
            <hr />
            <Form>
              <FormItem label='预计完工时间'>
                {getFieldDecorator('time', {
                  // initialValue: this.props.PGobj.estimateFinishDate,
                  rules: [{
                    required: true, message: '请选择时间!',
                  }],
                })(
                  <DatePicker format="YYYY-MM-DD HH:mm" showTime onChange={this.overTimeChange} />
                )}
              </FormItem>
            </Form>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Table
              dataSource={this.props.lookList}
              columns={columns}
              scroll={{ x: 1500 }}
              pagination={false}
              bordered />
          </div>
        </div>
      </Modal>
    )
  }
}



const mapStateToProps = (state) => {
  const { data, dispatchingItems, object, Obj, PGobj, SGVisible, lookObj, lookList, id, workList, classList, workVlaue, classVlue, peoperList } = state.constructionordermanagement
  return { data, dispatchingItems, object, Obj, PGobj, SGVisible, lookObj, lookList, id, workList, classList, workVlaue, classVlue, peoperList }
}

const mapDispatchToProps = (dispatch) => {
  const { FindListMdmWorkTeamEmployee, GetTechnicianVo, SET_STATE, GetStationList, FindListMdmWorkTeamNoPage, FindListMdmWorkTeamEmployeeByWorkTeamId, ListWorkProcessOrder } = dispatch.constructionordermanagement
  return { FindListMdmWorkTeamEmployee, GetTechnicianVo, SET_STATE, GetStationList, FindListMdmWorkTeamNoPage, FindListMdmWorkTeamEmployeeByWorkTeamId, ListWorkProcessOrder }
}

const SGmodal = Form.create()(SGmodals)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SGmodal)
