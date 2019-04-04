import React,{Component} from 'react'
import {Form, Input, Select, Row, Col, DatePicker, Button} from 'antd'
import {connect} from 'react-redux'
import { searchFormCreate } from '@/shared/hoc'
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker


class Searchs extends Component{

  componentDidMount = () => {
    this.props.GetDicDataByCategoryCode('7020')
    this.props.GetBasValueByBasCategoryNo('AS1000')
    this.props.ListDecorationLWorkOrder(this.props.data)
  }

  stateTime = (date,dateString) => { // 时间发生改变
    this.props.SET_STATE({
      data:{...this.props.data, workOrderStartDate:dateString[0], workOrderEndDate:dateString[1]}
    })
  }

  endTime = (date, dateString) => {
    this.props.SET_STATE({
      data:{...this.props.data, settleateStartDate:dateString[0], settleateEndDate:dateString[1]}
    })
  }

  woNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, woNo:value}
    })
  }

  refWoNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, refWoNo: value}
    })
  }
  vinChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, vin: value}
    })
  }

  bizTypeCodeChange = (value) => {
    if (value ==undefined) {
      this.props.SET_STATE({
        data: {...this.props.data, bizTypeCode: ''}
      })
    } else {
      this.props.SET_STATE({
        data: {...this.props.data, bizTypeCode: value}
      })
    }
  }

  stateChange = (value) => {
    if (value ==undefined) {
      this.props.SET_STATE({
        data: {...this.props.data, woStatusCode: ''}
      })
    } else {
      this.props.SET_STATE({
        data: {...this.props.data, woStatusCode: value}
      })
    }
  }
  // 查询
  SearchTab = () => {
    this.props.SET_STATE({
      loading: true
    })
    let data = {...this.props.data,  currentIndex:1,}
    this.props.ListDecorationLWorkOrder(data)
  }
  // 重置
  reset = () => {
    this.props.SET_STATE({
      data: {
        workOrderStartDate:'',
        workOrderEndDate:'',
        settleateStartDate:'',
        settleateEndDate:'',
        bizTypeCode:'',
        woStatusCode:'',
        woNo:'',
        refWoNo:'',
        vin:'',
        pageSize:10,
        currentIndex:1
      },
    })
    this.props.form.resetFields()
  }

    render () {
      const { getFieldDecorator } = this.props.form
      const {
        handleSearchFormResetForm,   // 重置按钮回调函数
        toggleSearchFormCollapse,    // 筛选项收起/展开按钮回调函数
        gutter,                      // 左右间隔
        searchFormClassName,             // 控件区域className
        buttonColClassName,              // 按钮区域（右边的查询、重置）className
        colLayout,                   // 控件响应式配置
        collapseClassName,           // 按钮区域（左边的收起展开）className
        collapseIconType,            // 收起/展开按钮图标
        collapseText,                // 收起/展开按钮文案
        hide,                        // 控制每个控件是否隐藏（使用方法见下）
      } = this.props
      return (
        <div>
        <Form className={searchFormClassName}  >
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem label='开单日期'>
                {getFieldDecorator('crtDate', {
                  initialValue:this.props.Time
                })(
                  <RangePicker  onChange={this.stateTime}/>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='结算日期'>
                {getFieldDecorator('endDate', {
                  initialValue:this.props.endTime
                })(
                  <RangePicker onChange={this.endTime} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='业务类型'>
                {getFieldDecorator('bizTypeCode', {
                  initialValue: this.props.data.bizTypeCode
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择业务类型"
                    optionFilterProp="children"
                    onChange={this.bizTypeCodeChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.props.yewuList.map((item, index) => {
                      return <Option key={index} value={item.basCode}>{item.basText}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='单据状态'>
                {getFieldDecorator('state', {
                  initialValue: this.props.data.woStatusCode
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择单据状态"
                    optionFilterProp="children"
                    onChange={this.stateChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {this.props.stateList.map((item, index) => {
                      return <Option key={index} value={item.dicCode}>{item.dicValue}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='工单号:'>
                {getFieldDecorator('eoNo', {
                  initialValue: this.props.data.woNo
                })(
                  <Input placeholder="请输入工单号"onChange={this.woNoChange}  />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='关联单号'>
                {getFieldDecorator('carPlateNo', {
                  initialValue: this.props.data.refWoNo
                })(
                  <Input  placeholder="请输入关联单号" onChange={this.refWoNoChange} />
                )}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem label='VIN'>
                {getFieldDecorator('vin', {
                  initialValue: this.props.data.vin
                })(
                  <Input  placeholder="请输入VIN" onChange={this.vinChange} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className={buttonColClassName}>
              <Button onClick={this.reset}>重置</Button>
              <Button type='primary' loading={this.props.loading} onClick={this.SearchTab}> 查询 </Button>
            </Col>
          </Row>
        </Form>
      </div>
      )
    }
}


const mapStateToProps = (state) => {
  const {data,Time,endTime,stateList,yewuList,loading} = state.decorationWorkOrderManagement
  return {data,Time,endTime,stateList,yewuList,loading}
}
const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,GetDicDataByCategoryCode,GetBasValueByBasCategoryNo,ListDecorationLWorkOrder} = dispatch.decorationWorkOrderManagement
  return {SET_STATE,GetDicDataByCategoryCode,GetBasValueByBasCategoryNo,ListDecorationLWorkOrder}
}
const Search = Form.create()(searchFormCreate()(Searchs))

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
