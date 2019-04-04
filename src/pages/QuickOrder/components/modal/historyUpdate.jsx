// 基础模块
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
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
const {
  REDIRECTION_URL: { MaintenanceHistory }, HOST,
} = env;
// UI组件
import {
  Form, Select, Spin, Icon, Modal, Row, Table, LocaleProvider, DatePicker,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class HistoryUpdate extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  // 取消历史更新
  historyUpdateCancel = () => {
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({ historyVisible: false, });
    this.props.MODAL_RESET_STATE();
  };
  // 查看维修历史
  historyUpdateSee = (record) => {
    // 点击工单号跳转到维修开单的页面将共代号也传过去
    const data = {
      id: record.id,
      type: 'looked',
      woNo: record.vin,
      jumpFlag: true,
    };
    // const _data = JSON.stringify(data);
    // const autoMessage = {
    //   name: '查看维修历史',
    //   index: `looked${record.id}`,
    //   url: 'MaintenanceHistory',
    //   resId: 'lookedOrder',
    //   infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST); 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/MaintenanceHistory', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(MaintenanceHistory, data, { title: '查看维修历史' });
      });
    }
  };

  render() {
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const {
      historyFastlyInfo, historyVisible, queryLoading,
    } = this.props;
    const historyColumns = [
      {
        title: '工单号',
        key: 'woNo',
        dataIndex: 'woNo',
        align: 'center',
        width: 180,
        render: (text, record) => (
          <span
            onClick={this.historyUpdateSee.bind(this, record)}
            style={{ cursor: 'pointer', color: '#352C74' }}
          >
            {record.woNo}
          </span>
        ),
      },
      {
        title: '结算日期',
        key: 'settleDate',
        dataIndex: 'settleDate',
        align: 'center',
        width: 200,
      },
      {
        title: '业务类型',
        key: 'bizTypeName',
        dataIndex: 'bizTypeName',
        align: 'center',
        width: 200,
      },
      {
        title: '结算金额',
        key: 'amount',
        dataIndex: 'amount',
        align: 'center',
        width: 200,
      },
    ];

    return (
      <Style>
        <Modal visible={historyVisible} onCancel={this.historyUpdateCancel} width='820px' footer={[]}>
          {/* 维修历史 */}
          <Spin spinning={queryLoading} indicator={antIcon} tip='加载中'>
            <div style={{
              maxHeight: '540px', overflowY: 'auto',
              overflowX: 'hidden', paddingRight: '15px',
            }} >
              <Row span={24}>
                <h3>维修历史</h3>
              </Row>
              <hr />
              <Table bordered dataSource={historyFastlyInfo} columns={historyColumns} size='small' />
            </div>
          </Spin>
        </Modal>
      </Style>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    historyVisible, queryLoading, historyFastlyInfo,
  } = state.modalInfo

  return {
    historyVisible, queryLoading, historyFastlyInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE,
  }
}

const HistoryUpdates = Form.create()(HistoryUpdate);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HistoryUpdates))