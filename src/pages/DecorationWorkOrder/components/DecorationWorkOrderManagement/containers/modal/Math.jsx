import React,{Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'


class Math extends Component{

  MathhandleCancel = () => {
    this.props.SET_STATE({
      Mathvisible: false
    })
  }

  render () {
    return (
      <Modal
          title='取消结算'
          visible={this.props.Mathvisible}
          onCancel={this.MathhandleCancel}
          onOk={this.MathhandleCancel}
        >
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>工单已关闭无法取消结算</div>
        </Modal>
    )
  }
}

const mapStateToProps = (state) => {
    const {Mathvisible} = state.decorationWorkOrderManagement
    return {Mathvisible}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.decorationWorkOrderManagement
  return {SET_STATE}
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Math)
