import React,{Component} from 'react'

import {Modal,Button, Form, Select, Input, Row, Col,message} from 'antd'
import {connect} from 'react-redux'
import {deleteWorkLocation} from '@/services/getData'


class SCmodal extends Component{

  delete = () => {
    let id = this.props.id
    this.DeleteWorkLocation(id)
  }

  async DeleteWorkLocation (id) {
    const res = await deleteWorkLocation ({id})
    if (res.success) {
      message.success('删除成功')
      this.props.SET_STATE({
        SCVisible: false,
        id:''
      })
      this.props.GetMdmWorkLocationForPage(this.props.data)
    } else {
      message.error('删除失败')
      this.props.SET_STATE({
        SCVisible: false,
        id:''
      })
    }
  }
  printCancel = () => {
    this.props.SET_STATE({
      SCVisible: false,
      id:''
    })
  }
  render () {


    return (
      <Modal
                title='删除班组'
                visible={this.props.SCVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.delete}
                width='500px'
                >
                <h3 style={{marginLeft:'30px'}}>你确定要删除吗？</h3>

            </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const {SCVisible,id} = state.stationManagement
  return {SCVisible,id}
}

const mapDispatchToPros = (dispatch) => {
  const {SET_STATE,GetMdmWorkLocationForPage,data} = dispatch.stationManagement
  return {SET_STATE,GetMdmWorkLocationForPage,data}
}

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(SCmodal)
