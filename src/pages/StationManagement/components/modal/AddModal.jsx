

import React,{Component} from 'react'

import {Modal,Button, Form, Select, Input, Row, Col,message} from 'antd'
import {saveWorkLocation} from '@/services/getData'
import {} from '@/services/getData'
import {connect} from 'react-redux'
const FormItem = Form.Item
const Option = Select.Option

class EDTmodals extends Component{
  componentWillMount = () => {
    this.props.GetDicDataByCategoryCode('7180')
  }


  // 确定事件
  ADD = () => {
    this.props.form.validateFields(
      ['beizu','ren','type','isYONG'],
      (err, values) => {
      if (!err) {
        this.SaveWorkLocation (this.props.addData)
      }
    })
  }

  workLocationNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      addData:{...this.props.addData, workLocationNo:value}
    })
  }

  workLocationNameChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      addData:{...this.props.addData, workLocationName:value}
    })
  }

  typeHandleChange = (value, option) => {
    this.props.SET_STATE({
      addData:{...this.props.addData, workLocationTypeNo:value, workLocationTypeId:option.props.id, workLocationTypeName:option.props.children}
    })
  }




  isEnabledhandleChange = (value) => {
    this.props.SET_STATE({
      addData:{...this.props.addData, isEnabled:value}
    })
  }


  async SaveWorkLocation  (Obj)  {
    const res = await saveWorkLocation (Obj)
    if (res.success) {
      message.success('新增成功')
      this.props.SET_STATE({
        ADDVisible: false,
        addData:{
          id:'',
          workLocationNo:'',
          workLocationName:'',
          workLocationTypeId:'',
          workLocationTypeNo:'',
          workLocationTypeName:'',
          isEnabled:''
        }
      })
      this.props.GetMdmWorkLocationForPage(this.props.data)
    } else {
      message.error(res.msg)
      this.props.SET_STATE({
        ADDVisible: false,
        addData:{
          id:'',
          workLocationNo:'',
          workLocationName:'',
          workLocationTypeId:'',
          workLocationTypeNo:'',
          workLocationTypeName:'',
          isEnabled:''
        }
      })
    }
  }



  printCancel = () => {
    this.props.SET_STATE({
      ADDVisible: false,
      addData:{
        id:'',
        workLocationNo:'',
        workLocationName:'',
        workLocationTypeId:'',
        workLocationTypeNo:'',
        workLocationTypeName:'',
        isEnabled:''
      },
    })
  }



  render () {
    const { getFieldDecorator } = this.props.form
    const formLeftLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
      },
    }
    return (
      <Modal
                title='新增工位'
                visible={this.props.ADDVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.ADD}
                >

                 <Form>
                  <Row>
                    <Col span={24}>
                    <FormItem label='工位编号' {...formLeftLayout}>
                    {getFieldDecorator('beizu', {
                      // initialValue: this.props.AddData.workTeamNo,
                      rules: [{
                        required: true, message: '请输入工位编号!',
                      }],
                    })(
                      <Input placeholder='请输入工位编号' onChange={this.workLocationNoChange}  />
                    )}
              </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem label='工位名称' {...formLeftLayout}>
                    {getFieldDecorator('ren', {
                      // initialValue: this.props.AddData.workTeamName,
                      rules: [{
                        required: true, message: '请输入工位名称!',
                      }],
                    })(
                      <Input placeholder='请输入工位名称' onChange={this.workLocationNameChange} />
                    )}
              </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem label='工位类型' {...formLeftLayout}>
                    {getFieldDecorator('type', {
                      // initialValue: this.props.AddData.isEnabled == 1? '是':'否',
                      rules: [{
                        required: true, message: '请选择工位类型!',
                      }],
                    })(
                      <Select
                          showSearch
                          placeholder="请选择工位类型"
                          optionFilterProp="children"
                          onChange={this.typeHandleChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {this.props.workList.map((item, index) => {
                            return <Option key={index} value={item.dicCode} id={item.id}>{item.dicValue}</Option>
                          })}
                        </Select>
                    )}
              </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem label='是否启用' {...formLeftLayout}>
                    {getFieldDecorator('isYONG', {
                      // initialValue: this.props.AddData.isEnabled == 1? '是':'否',
                      rules: [{
                        required: true, message: '请选择是否启用!',
                      }],
                    })(
                      <Select
                          showSearch
                          placeholder="请选择是否启用"
                          optionFilterProp="children"
                          onChange={this.isEnabledhandleChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          <Option value="1">是</Option>
                          <Option value="0">否</Option>
                        </Select>
                    )}
              </FormItem>
                    </Col>

                    </Row>
                  </Form>

            </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const {ADDVisible,addData,workList,data} = state.stationManagement
  return {ADDVisible,addData,workList,data}
}

const mapDispatchToPros = (dispatch) => {
  const {SET_STATE,GetDicDataByCategoryCode,GetMdmWorkLocationForPage} = dispatch.stationManagement
  return {SET_STATE,GetDicDataByCategoryCode,GetMdmWorkLocationForPage}
}


const EDTmodal = Form.create()(EDTmodals)
export default connect(
  mapStateToProps,
  mapDispatchToPros
)(EDTmodal)
