
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Modal, message } from 'antd'
import { connect } from 'react-redux'
import { env } from '../../../../config/env/'
const { REDIRECTION_URL: { JupOrder, QuickOrder }, HOST } = env;

class ZGDmodal extends Component {
  handleOk = () => {  // 确定事件
    // 判断是否是已转工单
    if (this.props.eoStatusName == '已转工单') {
      message.error('已转过工单')
      this.props.SET_STATE({
        ZGDVisible: false,
        id: '',
        eoNo: '',
        carPlateNo: '',
        vin: '',
        eoStatusName: ''
      })
    } else {
      message.success('转工单完成')
      // 拿到页面跳转到维修开单页查询
      this.props.SET_STATE({
        ZGDVisible: false,
        id: '',
        eoNo: '',
        carPlateNo: '',
        vin: '',
        eoStatusName: ''
      })
      // 跳转页面
      const data = {
        id: '',
        type: 'editEo',
        eoId: this.props.id,
        jumpFlag: true,
      };
      // const _data = JSON.stringify(data)// 转为字符串
      // const autoMessage = {
      //   name: '维修开单', index: `zhuan${this.props.id}`, url: 'QuickOrder', resId: 'ZGD', infoData: _data,
      // }
      // window.parent.postMessage(autoMessage, HOST) 
      if (envRouter) { //预发环境
        this.props.history.push({ pathname: '/QuickOrder', query: data });
      } else {
        menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
          menuRouter.open(QuickOrder, data, { title: '维修开单' });
        });
      }
    }
  }
  handleCancel = () => {
    this.props.SET_STATE({
      ZGDVisible: false,
      id: '',
      eoNo: '',
      carPlateNo: '',
      vin: ''
    })
  }
  render() {
    return (
      <Modal
        title="转工单"
        maskClosable={false}
        visible={this.props.ZGDVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>您确定要将改估价单转工单吗？</p>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right', }}>估价单号:</label>
          <span style={{ display: 'inline-block', width: '300px', height: '30px', borderRadius: '3px', lineHeight: '30px', backgroundColor: '#f5f5f5', }}>{this.props.eoNo}</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right', }}>车牌号:</label>
          <span style={{ display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', borderRadius: '3px', backgroundColor: '#f5f5f5', }}>{this.props.carPlateNo}</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right', }}>VIN:</label>
          <span style={{ display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', borderRadius: '3px', backgroundColor: '#f5f5f5', }}>{this.props.vin}</span>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { ZGDVisible, id, eoNo, carPlateNo, vin, eoStatusName } = state.valuationManagement
  return { ZGDVisible, id, eoNo, carPlateNo, vin, eoStatusName }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE } = dispatch.valuationManagement
  return { SET_STATE }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ZGDmodal))
