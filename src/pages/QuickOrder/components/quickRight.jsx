// 基础模块
import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import { PersonAndCar } from '@/components/Common';
import * as _ from 'lodash';

// 方法
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import { getOptionRender, getTotal, getReceiveTotal, getSelectedItemsInfo, calculateTable } from '../common/methods';

// UI组件
import {
  Anchor, Form, message,
} from 'antd'

// API
import {
  findCustomerById,
  findCusCarInfoFastlyByCusId,
  listWorkOrderHistoryFastlyByCusId,

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { DelErrorMsg } from '../common/components'
const Style = styled.div`

`;

class QuickRight extends Component {
  componentDidMount = () => {
    this.props.listCustomer();

  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }

  // 客户更新
  cusUpdateClick = () => {
    const cusId = this.props.cusAndCarInfo.cusId;
    const cusUpdateInfo = this.props.cusUpdateInfo;
    this.props.MODAL_SET_STATE({
      cusUpdateVisible: true,
      queryLoading: true,
    });
    findCustomerById({ cusId }).then((res) => {
      if (res.success) {
        this.props.MODAL_SET_STATE({ queryLoading: false });
        if (res.data) {
          // 调用对应的市区
          this.props.getGlobalMdmRegion(res.data.cusProvinceId, 'cusCity')
          this.props.getGlobalMdmRegion(res.data.cusCityId, 'cusRegion')
          this.props.MODAL_SET_STATE({
            cusUpdateInfo: {
              ...cusUpdateInfo,
              id: res.data.id, // 客户id
              cusName: res.data.cusName, // 客户姓名
              cusMobileNo: res.data.cusMobileNo, // 客户联系电话
              cusProvinceId: res.data.cusProvinceId, // 省份id
              cusProvinceName: res.data.cusProvinceName, // 省份名
              cusCityId: res.data.cusCityId, // 市id
              cusCityName: res.data.cusCityName, // 市名
              cusRegionId: res.data.cusRegionId, // 区/县id
              cusRegionName: res.data.cusRegionName, // 区/县名
              cusStreetAddress: res.data.cusStreetAddress, // 客户详细地址
            },
          });
        }
      } else {
        DelErrorMsg(res.msg);
      }
    });
  };

  // 更新车辆
  carUpdateClick = () => {
    this.props.MODAL_SET_STATE({
      carUpdateVisible: true,
      queryLoading: true,
    });
    this.findCusCarInfoFastlyByCusId(this.props.cusAndCarInfo.cusId);
  };

  findCusCarInfoFastlyByCusId = (id) => {
    const carUpdateInfo = this.props.carUpdateInfo;
    findCusCarInfoFastlyByCusId({ cusId: id }).then((res) => {
      if (res.success) {
        this.props.MODAL_SET_STATE({ queryLoading: false });
        if (res.data) {
          const datas = res.data;
          datas.cusCarInfoFastlyDto.forEach((item, index) => {
            (item.key = item.id + index), (item.carPlateNo = item.carPlateTypeName + item.carPlateNo);
          });
          this.props.MODAL_SET_STATE({
            carUpdateInfo: {
              ...carUpdateInfo,
              cusId: datas.cusId,
              cusName: datas.cusName,
              cusMobileNo: datas.cusMobileNo,
              cusCarInfoFastlyDto: datas.cusCarInfoFastlyDto,
            },
          });
        }
      } else {
        DelErrorMsg(res.msg);
      }
    });
  };

  // 维修历史
  historyUpdateClick = () => {
    this.props.MODAL_SET_STATE({
      historyVisible: true,
    });
    this.getWorkOrderHistoryFastlyByCusId();
  };
  // 客户预约
  customerAppointmentClick = () => {
    const { queryAppointmentOrderVO, cusAndCarInfo, appointSaveState } = this.props;
    if (cusAndCarInfo.id != '' && cusAndCarInfo.appointmentOrderNo && appointSaveState == true) return message.error('预约单已选，无法更改！');
    this.props.MODAL_SET_STATE({ appointmentVisible: true })
    for (const item in queryAppointmentOrderVO) {
      if (queryAppointmentOrderVO[item] != '') this.props.getAppointmentOrder();
    }
  }

  // 获取历史信息
  getWorkOrderHistoryFastlyByCusId = () => {
    this.props.MODAL_SET_STATE({ queryLoading: true, historyFastlyInfo: [] });
    listWorkOrderHistoryFastlyByCusId({ vin: this.props.cusAndCarInfo.vin }).then((res) => {
      if (res.success) {
        const list = res.data || [];
        if (res.data) {
          list.map((item) => {
            item.key = item.id;
            item.settleDate = item.settleDate ? moment(item.settleDate).format('YYYY-MM-DD') : '';
          });
        }
        this.props.MODAL_SET_STATE({
          queryLoading: false,
          historyFastlyInfo: list,
        });
      }
    });
  };

  render() {
    const {

    } = this.props

    return (
      <Style>
        <Anchor offsetTop={0} affix={false}>
          <p
            onClick={this.cusUpdateClick.bind(event)}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          >客户更新</p>
          <p
            onClick={this.carUpdateClick.bind(event)}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          >车辆信息 </p>
          <p
            onClick={this.historyUpdateClick.bind(event)}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          > 维修历史 </p>
          <p
            onClick={this.customerAppointmentClick.bind(event)}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          > 客户预约 </p>
        </Anchor>

      </Style>
    )


  }
}

const mapStateToProps = (state) => {
  const {
    cusAndCarInfo, appointSaveState,
  } = state.tableInfo
  const {
    cusUpdateVisible, queryLoading, carUpdateVisible, historyVisible, cusUpdateInfo,
    appointmentVisible, queryAppointmentOrderVO,
  } = state.modalInfo

  return {
    cusAndCarInfo, cusUpdateVisible, queryLoading, carUpdateVisible, historyVisible,
    cusUpdateInfo, appointmentVisible, queryAppointmentOrderVO, appointSaveState,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    SET_STATE, RESET_STATE,
  } = dispatch.baseData
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, getGlobalMdmRegion, getAppointmentOrder,
    listCustomer,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, MODAL_SET_STATE, MODAL_RESET_STATE, getGlobalMdmRegion,
    getAppointmentOrder, listCustomer,
  }
}

const QuickRights = Form.create()(QuickRight);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickRights)