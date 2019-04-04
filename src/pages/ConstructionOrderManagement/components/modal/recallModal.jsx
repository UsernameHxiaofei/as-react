
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Modal,Button,message} from 'antd'
import {revokeWorkProcessOrder} from '@/services/getData'

class DYmodal extends Component{

  printCancel = () => {
    this.props.SET_STATE({
      CXVisible:false,
      type:'',
      procNo:'', 
      carPlateNo :'',
      vin:'',
      id:''
    })
  }

  // 撤销
  async RevokeWorkProcessOrder (procId) {
    const res = await revokeWorkProcessOrder({procId})
    if (res.success) {
      message.success('撤销成功')
      this.props.SET_STATE({
        CXVisible:false,
        type:'',
        procNo:'',
        carPlateNo :'',
        vin:'',
        id:''
      })
    // 重新查询页面
      this.props.ListWorkProcessOrder(this.props.data)
    } else {
      message.error('撤销失败')
      this.props.SET_STATE({
        CXVisible:false,
        type:'',
        procNo:'',
        carPlateNo :'',
        vin:'',
        id:''
      })
      this.props.ListWorkProcessOrder(this.props.data)
    }
  }

  handleOk = () => {
    // 根据类型不同调不通的接口清空字段关闭页面提示用户
    if (this.props.type == '确定要撤销派工单吗？') {
      this.RevokeWorkProcessOrder(this.props.id)
    }
    if (this.props.type == '确定要撤销该施工单吗?') {
      this.RevokeWorkProcessOrder(this.props.id)
    }
    if (this.props.type == '确定要撤销验收吗？') {
      this.RevokeWorkProcessOrder(this.props.id)
    }
  }

  render () {
    return (
      <Modal
                title='提示'
                visible={this.props.CXVisible}
                onCancel={this.printCancel}
                onOk={this.handleOk}
                maskClosable={false}
                destroyOnClose={true}
                >
                <h3>{this.props.type}</h3>
                <div style={{ marginBottom: '10px' }}><span style={{display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',}}>施工单号:</span><span style={{display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',}}>{this.props.procNo}</span></div>
                <div style={{ marginBottom: '10px' }}><span style={{display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',}}>车牌号:</span><span style={{display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',}}>{this.props.carPlateNo}</span></div>
                <div style={{ marginBottom: '10px' }}><span style={{display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',}}>VIN:</span><span style={{display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',}}>{this.props.vin}</span></div>
            </Modal>
    )
  }
}


const mapStateToProps = (state) => {
  const {data,CXVisible,id,type,procNo,carPlateNo,vin} = state.constructionordermanagement
  return {data,CXVisible,id,type,procNo,carPlateNo,vin}
}

const mapDispatchToProps = (dispatch) => {
  const {ListWorkProcessOrder,SET_STATE} =dispatch.constructionordermanagement
  return {ListWorkProcessOrder,SET_STATE}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DYmodal)

