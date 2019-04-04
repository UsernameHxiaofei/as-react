import React,{Component} from 'react'
import {Modal,message, Button} from 'antd'
import {connect} from 'react-redux'
import {cancelWorkOrderSettlement} from '@/services/getData'


class MathTrue extends Component{

  MathTrueshandleCancel = () => {
    this.props.SET_STATE({
      MathTruevisible: false,
      OPt:{}
    })
  }

  async CancelWorkOrderSettlement (woId) {
    const res = await cancelWorkOrderSettlement ({woId})
    if (res.success) {
      message.success('取消结算成功')
      // 重新查询一遍列表
      this.props.ListDecorationLWorkOrder(this.props.data)
      this.props.SET_STATE({
        MathTruevisible: false,
        OPt:{}
      })
    } else {
      message.error(res.msg)
    }
  }
  MathTrueshandleOk = () => {//确定事件
    this.CancelWorkOrderSettlement(this.props.OPt.id)
  }

  render () {
    return (
      <Modal
      title='取消结算'
      visible={this.props.MathTruevisible}
      onOk={this.MathTrueshandleOk}
      onCancel={this.MathTrueshandleCancel}
    >
      <div style={{ marginBottom: '10px' }}><span style={{
display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
}}
      >工单号:</span><span style={{
display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
}}
      >{this.props.OPt.woNo}</span></div>
      <div style={{ marginBottom: '10px' }}><span style={{
display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
}}
      >车牌号:</span><span style={{
display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
}}
      >{this.props.OPt.carPlateNo}</span></div>
      <div style={{ marginBottom: '10px' }}><span style={{
display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
}}
      >VIN:</span><span style={{
display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
}}
      >{this.props.OPt.vin}</span></div>
    </Modal>
    )
  }
}

const mapStateToProps = (state) => {
    const {MathTruevisible,OPt,data} = state.decorationWorkOrderManagement
    return {MathTruevisible,OPt,data}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,ListDecorationLWorkOrder} = dispatch.decorationWorkOrderManagement
  return {SET_STATE,ListDecorationLWorkOrder}
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (MathTrue)
