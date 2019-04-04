

import React,{Component} from 'react'

import {Modal,Button, Form, Select, Input, Row, Col,message} from 'antd'
import {saveMdmWorkTeam} from '@/services/getData'
import {connect} from 'react-redux'
const FormItem = Form.Item
const Option = Select.Option

class EDTmodals extends Component{

  // 确定事件
  ADD = () => {
    this.props.form.validateFields(
      ['beizu','ren','isYONG'],
      (err, values) => {
      if (!err) {
        this.SaveMdmWorkTeam (this.props.AddData)
      }
    })
  }

  async SaveMdmWorkTeam (data) {
    const res = await saveMdmWorkTeam (data)
    if (res.success) {
      this.props.SET_STATE({
        ADDVisible:false,
        AddData:{
          id:'',
          workTeamNo :'',
          workTeamName :'',
          isEnabled:''
        }
      })
      message.success('编辑成功')
      // 重新查询
      this.props.FindListMdmWorkTeamByPage(this.props.data)
    } else {
      message.error(res.msg)
      this.props.SET_STATE({
        ADDVisible:false,
        AddData:{
          id:'',
          workTeamNo :'',
          workTeamName :'',
          isEnabled:''
        }
      })
    }
  }

  printCancel = () => {
    this.props.SET_STATE({
      ADDVisible: false,
      AddData:{
        id:'',
        workTeamNo :'',
        workTeamName :'',
        isEnabled:''
      }
    })
  }

  workTeamNoChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      AddData: {...this.props.AddData, workTeamNo:value}
    })
  }

  workTeamNameChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      AddData: {...this.props.AddData, workTeamName:value}
    })
  }

  handleChange = (value) => {
    this.props.SET_STATE({
      AddData: {...this.props.AddData, isEnabled:value}
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
                title='编辑班组'
                visible={this.props.ADDVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.ADD}
                >

                 <Form>
                  <Row>
                    <Col span={24}>
                    <FormItem label='班组编号' {...formLeftLayout}>
                    {getFieldDecorator('beizu', {
                      initialValue: this.props.AddData.workTeamNo,
                      rules: [{
                        required: true, message: '请输入班组编号!',
                      }],
                    })(
                      <Input placeholder='请输入班组编号' onChange={this.workTeamNoChange} />
                    )}
              </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem label='班组名称' {...formLeftLayout}>
                    {getFieldDecorator('ren', {
                      initialValue: this.props.AddData.workTeamName,
                      rules: [{
                        required: true, message: '请输入班组名称!',
                      }],
                    })(
                      <Input placeholder='请输入班组名称' onChange={this.workTeamNameChange} />
                    )}
              </FormItem>
                    </Col>

                    <Col span={24}>
                    <FormItem label='是否启用' {...formLeftLayout}>
                    {getFieldDecorator('isYONG', {
                      initialValue: this.props.AddData.isEnabled == 1? '是':'否',
                      rules: [{
                        required: true, message: '请选择是否启用!',
                      }],
                    })(
                      <Select
                          showSearch
                          placeholder="请选择是否启用"
                          optionFilterProp="children"
                          onChange={this.handleChange}
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
  const {ADDVisible,AddData,data} = state.team
  return {ADDVisible,AddData,data}
}

const mapDispatchToPros = (dispatch) => {
  const {SET_STATE,SaveMdmWorkTeam,FindListMdmWorkTeamByPage} = dispatch.team
  return {SET_STATE,SaveMdmWorkTeam,FindListMdmWorkTeamByPage}
}


const EDTmodal = Form.create()(EDTmodals)
export default connect(
  mapStateToProps,
  mapDispatchToPros
)(EDTmodal)
