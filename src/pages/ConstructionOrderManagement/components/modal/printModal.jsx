

import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Modal,Button} from 'antd'

class DYmodal extends Component{

  printCancel = () => {
    this.props.SET_STATE({
      DYVisible:false
    }) 
  }
  render () {
    return (
      <Modal
                title='打印'
                visible={this.props.DYVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                width='80%'
                footer={[
                    <Button key='back' onClick={this.printCancel}>
                    关闭
                    </Button>,
                ]}
                >
                <div style={{ width: '100%', height: '600px' ,overflowY:'auto'}}>
                    <iframe
                    className='LeftNavigation'
                    src={`${'http://114.55.2.156:8888/WebReport/ReportServer?reportlet=/saas/cheliangrukudan.cpt' +
                        '&id='}${1111}`}
                    scrolling='auto'
                    frameBorder={0}
                    seamless='seamless'
                    width='100%'
                    height='100%'
                    />
                </div>
            </Modal>
    )
  }
}


const mapStateToProps = (state) => {
  const {DYVisible} = state.constructionordermanagement
  return {DYVisible}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} =dispatch.constructionordermanagement
  return {SET_STATE}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DYmodal)
