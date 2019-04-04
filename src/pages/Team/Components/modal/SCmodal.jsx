

import React,{Component} from 'react'

import {Modal,Button, Form, Select, Input, Row, Col} from 'antd'
import {connect} from 'react-redux'
import {deleteMdmWorkTeam} from '@/services/getData'


class SCmodal extends Component{

  delete = () => {
    console.log(1111)
    // 掉接口删除
    let id = this.props.id
    // console.log(id)
    this.props.DeleteMdmWorkTeam(id)

  }

  printCancel = () => {
    this.props.SET_STATE({
      SCVisible: false
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
  const {SCVisible,id} = state.team
  return {SCVisible,id}
}

const mapDispatchToPros = (dispatch) => {
  const {SET_STATE,DeleteMdmWorkTeam} = dispatch.team
  return {SET_STATE,DeleteMdmWorkTeam}
}

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(SCmodal)
