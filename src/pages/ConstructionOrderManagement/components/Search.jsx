
import React,{Component} from 'react'
import {Form, Input, Select, Row, Col, DatePicker, Button} from 'antd'
import {connect} from 'react-redux'


import { searchFormCreate } from '@/shared/hoc'
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class Searchs extends Component{

  componentWillMount = () => {
    this.props.GetDicDataByCategoryCode('7165')
    this.props.GetBasValueByBasCategoryNo('AS1000')
    this.props.ListWorkProcessOrder(this.props.data)
  }

  TimeChange = (date,dateString) => { // 时间发生改变
      this.props.SET_STATE({
        data:{...this.props.data, crtDateStart:dateString[0], crtDateEnd:dateString[1]}
      })
  }
  woNOChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, woNO: value}
    })
  }
  procNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, procNo: value}
    })
  }
  vinChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, vin: value}
    })
  }
  carPlateNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: {...this.props.data, carPlateNo: value}
    })
  }
  stateChange = (value) => {
    this.props.SET_STATE({
      data: {...this.props.data, procStatusCode: value}
    })
  }
  bizTypeCodeChange = (value) => {
    this.props.SET_STATE({
      data: {...this.props.data, bizTypeCode : value}
    })
  }
  resetForm = () => { //重置表单
    this.props.SET_STATE({
      data: {
        procNo:"", //施工单号,
        woNO : "", //工单号,
        crtDateStart : '',// 开单日期
        crtDateEnd:'', //开单结束日期
        carPlateNo: '', // 车牌号
        vin:'', //VIN码
        procStatusCode:'', //施工单状态码
        bizTypeCode:'', //业务类型
        pageSize:10, //每页的记录页
        currentIndex:1, //当前页
      },
    })
    this.props.form.resetFields()
  }

  search = () => {
    let data = {...this.props.data, currentIndex:1}
    this.props.ListWorkProcessOrder(data)
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
    const {
      procNo,
      woNO,
      crtDateStart,
      crtDateEnd,
      carPlateNo,
      vin,
      procStatusCode,
      bizTypeCode,
    } = this.props.data


    return (
      <div>
        <Form className={searchFormClassName}  >
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem label='开单日期'>
                {getFieldDecorator('crtDate', {
                  initialValue:this.props.Time
                })(
                  <RangePicker onChange={this.TimeChange} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='工单号:'>
                {getFieldDecorator('eoNo', {
                  initialValue: this.props.woNO
                })(
                  <Input placeholder="请输入工单号" onChange={this.woNOChange}/>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='施工单号'>
                {getFieldDecorator('carPlateNo', {
                  initialValue: this.props.procNo
                })(
                  <Input  placeholder="请输入施工单号" onChange={this.procNoChange}/>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='业务类型'>
                {getFieldDecorator('bizTypeCode', {
                  initialValue: this.props.bizTypeCode
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
              <FormItem label='车牌号'>
                {getFieldDecorator('woNO', {
                  initialValue: this.props.carPlateNo
                })(
                  <Input placeholder="请输入车牌号" onChange={this.carPlateNoChange} />
                )}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem label='VIN'>
                {getFieldDecorator('vin', {
                  initialValue: this.props.vin
                })(
                  <Input  placeholder="请输入VIN" onChange={this.vinChange} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='施工状态' >
                {getFieldDecorator('eoStatusCode', {
                  initialValue: this.props.procStatusCode
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择施工状态"
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
          </Row>
          <Row>
            <Col className={buttonColClassName}>
              <Button onClick={this.resetForm}>重置</Button>
              <Button type='primary' onClick={this.search} > 查询 </Button>
            </Col>
          </Row>
        </Form>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
const {data,Time,stateList,yewuList} = state.constructionordermanagement
  return {data,Time,stateList,yewuList}
}

const mapDispatchToProps = (dispatch) => {
  const {GetBasValueByBasCategoryNo,SET_STATE,GetDicDataByCategoryCode,ListWorkProcessOrder} = dispatch.constructionordermanagement
  return {GetBasValueByBasCategoryNo, SET_STATE,GetDicDataByCategoryCode,ListWorkProcessOrder}
}

const Search = Form.create()(searchFormCreate()(Searchs))


export default connect (
  mapStateToProps,
  mapDispatchToProps,
) (Search)
