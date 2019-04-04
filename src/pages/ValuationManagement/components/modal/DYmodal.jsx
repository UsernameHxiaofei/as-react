import React,{Component} from 'react'
import {Modal,Button} from 'antd'
import {connect} from 'react-redux'


class DYmodal extends  Component{

  printCancel = () => {
    this.props.SET_STATE({
      id:'',
      DYprintVisible:false
    }) 
  }
  render () {
    return (
      <Modal
                title='打印'
                visible={this.props.DYprintVisible}
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
                        '&id='}${this.props.id}`}
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
  const {DYprintVisible,id} = state.valuationManagement
  return {DYprintVisible,id}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.valuationManagement
  return { SET_STATE}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DYmodal)
