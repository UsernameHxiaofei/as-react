import React,{Component} from 'react'
import {Modal, Button} from 'antd'
import {connect} from 'react-redux'
import { env } from '../../../../../../config/env/'
const { REDIRECTION_URL: {GoodsOutAdrees}, HOST } = env

class PlayCory extends Component{

  printCancel = () => {
    this.props.SET_STATE({
      palyVisible: false
    })
  }

  render () {
    return (
      <Modal
                title='打印'
                visible={this.props.palyVisible}
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
                    src={ GoodsOutAdrees +'&id=' + `${this.props.ID}`}
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
    const {palyVisible,ID} = state.beforeWork
    return {palyVisible,ID}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE} = dispatch.beforeWork
  return {SET_STATE}
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
) (PlayCory)
