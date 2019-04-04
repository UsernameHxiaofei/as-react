import React,{Component} from 'react'
import { Form, Row, Col, Button,  Input,  Modal,  InputNumber, message } from 'antd';
import {connect} from 'react-redux'
import {pushWorkOrderDeposit} from '@/services/getData'


class MoneySend extends Component{

  MoneyhandleCancel = () => {
    this.props.SET_STATE({
      moneyVisible: false
    })
  }

  async PushWorkOrderDeposit (obj) {
    const res = await pushWorkOrderDeposit (obj)
    if (res.success) {
      message.success('本次定金推送成功')
      this.props.SET_STATE({
        object: {
          woId:'',
          deposit:'',
        },
        moneyVisible: false,
        DJconfirmLoading: false
      })
    } else {
      message.error(res.msg)
      this.props.SET_STATE({
        DJconfirmLoading: false
      })
    }
  }

  MoneyhandleOk = () => { //确定事件
    if (this.props.object.deposit > 0) {
      // 校验通过获取到数据发送请求
      //console.log(this.props.object)
      this.props.SET_STATE({
        DJconfirmLoading: true
      })
      this.PushWorkOrderDeposit(this.props.object)
    } else {
      // 提示用户不用关闭弹框清空输入框的数据
      message.error('本次定金要大于0')
      this.props.SET_STATE({
        moneyVisible: true,
        object: {...this.props.object, deposit: ''}
      })
    }
  }


  moneyChange = (value) => {
    this.props.SET_STATE({
      object: {...this.props.object,deposit: value}
    })
  }



  render () {
    return (
      <Modal
          title="订金推送"
          confirmLoading={this.props.DJconfirmLoading}
          visible={this.props.moneyVisible}
          onOk={this.MoneyhandleOk}
          onCancel={this.MoneyhandleCancel}
        >
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
}}
          >工单号:</span><span style={{
display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', backgroundColor: '#f5f5f5',
 }}
          >{this.props.obj.woNo}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
 display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
 }}
          >客户姓名:</span><span style={{
 display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', backgroundColor: '#f5f5f5',
}}
          >{this.props.obj.cusName}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}>
            <label style={{
 display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
}}
            >已收订金:</label><Input disabled value={this.props.basemoney} style={{ dispaly: 'inline-block', width: '300px' }} />
          </div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}>
            <label style={{
 display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
}}
            >本次订金:</label>
            <InputNumber placeholder='请输入大于0的金额'  value={this.props.object.deposit} precision={2}  style={{ dispaly: 'inline-block', width: '300px' }} onChange={this.moneyChange} />
          </div>
        </Modal>
    )
  }
}

const mapStateToProps = (state) => {
    const {moneyVisible,DJconfirmLoading,basemoney,obj,object} = state.decorationWorkOrderManagement
    return {moneyVisible,DJconfirmLoading,basemoney,obj,object}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.decorationWorkOrderManagement
  return {SET_STATE}
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (MoneySend)
