

import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Row, Col, Form, Input, DatePicker, Button, Icon, Select } from 'antd'
import { connect } from 'react-redux'
import { env } from '../../../config/env/'
const { REDIRECTION_URL: { AddEvaluationOrder }, HOST } = env

// 修改的样式
import { searchFormCreate } from '@/shared/hoc'
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class Searchs extends Component {

  componentDidMount = () => {
    this.props.GetDicDataByCategoryCode("7160")
    this.props.GetBasValueByBasCategoryNo('AS1000')
  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }

  //时间改变的事件
  TimeChange = (dates, dateStrings) => {
    this.props.SET_STATE({
      data: { ...this.props.data, crtDateStart: dateStrings[0], crtDateEnd: dateStrings[1] }
    })
  }

  // 估价单改变事件
  eoNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: { ...this.props.data, eoNo: value }
    })
  }
  // 车牌号
  carPlateNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: { ...this.props.data, carPlateNo: value }
    })
  }
  // vin
  vinChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: { ...this.props.data, vin: value }
    })
  }
  // 业务类型
  bizTypeCodeChange = (value) => {
    this.props.SET_STATE({
      data: { ...this.props.data, bizTypeCode: value }
    })
  }
  //单据状态
  stateChange = (value) => {
    this.props.SET_STATE({
      data: { ...this.props.data, eoStatusCode: value }
    })
  }

  woNOChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data: { ...this.props.data, woNO: value }
    })
  }

  // 重置表单的值
  handleResetForm = () => {
    this.props.SET_STATE({
      data: {
        eoNo: '', //估计单号
        woNO: '',
        crtDateStart: '', //开单日期,
        crtDateEnd: '', //开单结束
        carPlateNo: '', //车牌号
        vin: '', //车架号
        eoStatusCode: '',//单据状态编码
        bizTypeCode: '',//业务类型编码
        pageSize: 10,
        currentIndex: 1
      }
    })
    this.props.form.resetFields()
  }

  // 查询事件
  searchTabled = () => {
    this.props.SET_STATE({
      data: { ...this.props.data, currentIndex: 1, }
    })
    let data = this.props.data
    this.props.ListEvaluateOrder(data)
  }

  // 新增
  Add = () => {
    // 跳页面
    // const autoMessage = {
    //   name: '估价单', index: `jupAdd${Math.random()}`, url: AddEvaluationOrder, resId: 'addOrder',
    // };
    // window.parent.postMessage(autoMessage, HOST)
    
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/AddEvaluationOrder', query: '' });
    }else{
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(AddEvaluationOrder, { jumpFlag: false, }, { title: '新增估价单' });
      });
    }
  }

  render() {
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
        <div style={{ overflow: 'hidden', marginBottom: '10px' }}>
          <Button style={{ marginLeft: '10px', float: 'right' }} onClick={this.Add} type="primary">新增</Button>
        </div>
        <Form className={searchFormClassName}  >
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem label='开单日期'>
                {getFieldDecorator('crtDate', {
                  initialValue: this.props.data.TimeData
                })(
                  <RangePicker onChange={this.TimeChange} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='估价单号:'>
                {getFieldDecorator('eoNo', {
                  initialValue: this.props.data.eoNo
                })(
                  <Input onChange={this.eoNoChange} placeholder="请输入估价单号" />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='车牌号'>
                {getFieldDecorator('carPlateNo', {
                  initialValue: this.props.data.carPlateNo
                })(
                  <Input onChange={this.carPlateNoChange} placeholder="请输入车牌号" />
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
                    {this.props.bizTypeList.map((item, index) => {
                      return <Option key={index} value={item.basCode}>{item.basText}</Option>
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='工单号'>
                {getFieldDecorator('woNO', {
                  initialValue: this.props.data.woNO
                })(
                  <Input onChange={this.woNOChange} placeholder="请输入工单号" />
                )}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem label='VIN'>
                {getFieldDecorator('vin', {
                  initialValue: this.props.data.vin
                })(
                  <Input onChange={this.vinChange} placeholder="请输入VIN" />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='单据状态' >
                {getFieldDecorator('eoStatusCode', {
                  initialValue: this.props.data.eoStatusCode
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
          </Row>
          <Row>
            <Col className={buttonColClassName}>
              <Button onClick={this.handleResetForm}>重置</Button>
              <Button type='primary' onClick={this.searchTabled}> 查询 </Button>
            </Col>
          </Row>
        </Form>

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const { data, stateList, bizTypeList, TimeData } = state.valuationManagement
  return { data, stateList, bizTypeList, TimeData }
}

const mapDispatchToProps = (dispatch) => {
  const { GetBasValueByBasCategoryNo, SET_STATE, RESET_STATE, GetDicDataByCategoryCode, RESET_FORM, ListEvaluateOrder } = dispatch.valuationManagement
  return { GetBasValueByBasCategoryNo, SET_STATE, RESET_STATE, GetDicDataByCategoryCode, RESET_FORM, ListEvaluateOrder }
}

const Search = Form.create()(searchFormCreate()(Searchs));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Search))
