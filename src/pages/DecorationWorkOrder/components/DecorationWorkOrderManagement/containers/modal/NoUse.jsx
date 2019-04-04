import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Modal, message} from 'antd'
import {invalidWorkOrder} from '@/services/getData'

class NoUse extends Component{


  async InvalidWorkOrder (woId) {
    const res = await invalidWorkOrder({woId})
    if (res.success) {
      message.success('作废成功')
      this.props.SET_STATE({
        NoUseVisible: false,
        NoUseLodaing: false,
        option:{},
      })
      // 重新查询
      this.props.ListDecorationLWorkOrder(this.props.data)
    } else {
      this.props.SET_STATE({
        NoUseLodaing: false,
      })
      message.error(res.msg)
    }
  }

  handleOk = () => {
    this.props.SET_STATE({
      NoUseLodaing: true,
    })
    this.InvalidWorkOrder(this.props.NoUseId)
  }



  handleCancel = () => {
    this.props.SET_STATE({
      NoUseVisible: false
    })
  }


  render () {
    return (
      <Modal
      title="工单作废"
      confirmLoading={this.props.NoUseLodaing}
      maskClosable={false}
      visible={this.props.NoUseVisible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
    >
    <p>您确定要作废该工单吗？</p>
     <div style={{marginBottom:'10px'}}>
        <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>工单号:</label>
        <span style={{display: 'inline-block', width: '300px', height: '30px', borderRadius:'3px', lineHeight: '30px', backgroundColor: '#f5f5f5',}}>{this.props.option.woNo}</span>
      </div>
      <div style={{marginBottom:'10px'}}>
        <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>车牌号:</label>
        <span style={{display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px',  borderRadius:'3px', backgroundColor: '#f5f5f5',}}>{this.props.option.carPlateNo}</span>
      </div>
      <div style={{marginBottom:'10px'}}>
        <label style={{display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',}}>VIN:</label>
        <span style={{display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px',  borderRadius:'3px', backgroundColor: '#f5f5f5',}}>{this.props.option.vin}</span>
      </div>
    </Modal>
    )
  }
}


const mapStateToProps  = (state) => {
  const {NoUseVisible,NoUseLodaing,data,NoUseId,option} = state.decorationWorkOrderManagement
  return {NoUseVisible,NoUseLodaing,data,NoUseId,option}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,ListDecorationLWorkOrder} = dispatch.decorationWorkOrderManagement
  return {SET_STATE,ListDecorationLWorkOrder}
}


export default connect (
  mapStateToProps,
  mapDispatchToProps
) (NoUse)
