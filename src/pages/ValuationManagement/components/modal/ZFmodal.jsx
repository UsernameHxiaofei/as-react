
import React,{Component} from 'react'
import {Modal, message} from 'antd'
import {invalidEvaluateOrder} from '@/services/getData'
import {connect} from 'react-redux'


class ZFmodal extends Component{

 async InvalidEvaluateOrder(eoId){
   const res = await invalidEvaluateOrder({eoId})
   if (res.success) {
     this.props.SET_STATE({
        ZFVisible:false,
        id:'',
        woNo:'',
        carPlateNo:'',
        vin:''
     })
     message.success('作废成功')
     this.props.ListEvaluateOrder(this.props.data)
   } else {
    this.props.SET_STATE({
      ZFVisible:false,
      id:'',
      woNo:'',
      carPlateNo:'',
      vin:''
   })
     message.error(res.msg)
   }
 }

  // 确定作废发送请求关闭页面
  handleOk = () => {
    this.InvalidEvaluateOrder(this.props.id)
  }

  // 关闭
  handleCancel = () => {
    this.props.SET_STATE({
      ZFVisible:false,
      id:'',
      woNo:'',
      carPlateNo:'',
      vin:''
    })
  }

  render () {
    return (
      <Modal
          title="作废工单"
          maskClosable={false}
          visible={this.props.ZFVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        <p>您确定要作废该估价单吗？</p>
         <div style={{marginBottom:'10px'}}>
            <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>估价单号:</label>
            <span style={{display: 'inline-block', width: '300px', height: '30px', borderRadius:'3px', lineHeight: '30px', backgroundColor: '#f5f5f5',}}>{this.props.eoNo}</span>
          </div>
          <div style={{marginBottom:'10px'}}>
            <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>车牌号:</label>
            <span style={{display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px',  borderRadius:'3px', backgroundColor: '#f5f5f5',}}>{this.props.carPlateNo}</span>
          </div>
          <div style={{marginBottom:'10px'}}>
            <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>VIN:</label>
            <span style={{display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px',  borderRadius:'3px', backgroundColor: '#f5f5f5',}}>{this.props.vin}</span>
          </div>
        </Modal>
    )
  }
}


const mapStateToProps = (state)=> {
  const {ZFVisible,woNo,id,carPlateNo,vin,data,eoNo} = state.valuationManagement
  return {ZFVisible,woNo,id,carPlateNo,vin,data,eoNo}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,ListEvaluateOrder} = dispatch.valuationManagement
  return {SET_STATE,ListEvaluateOrder}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZFmodal)
