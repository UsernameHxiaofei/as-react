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
const {
  REDIRECTION_URL: { MaintenanceHistory }, HOST,
} = env;
// UI组件
import {
  Form, Select, Button, Icon, Modal, Row, Table, 
} from 'antd'

// API
import {

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
const Style = styled.div`

`;

class UnderStock extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  // 关闭弹窗
  underStockCancel = () => {
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({ historyVisible: false, });
    this.props.MODAL_RESET_STATE();
  };

  render() {
   const {
      stockVisible, stockDataSource,
    } = this.props;
    const stockColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '商品编码',
        width: 65,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '商品名称',
        width: 65,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '商品类型',
        width: 50,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 50,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '需求数量',
        width: 25,
      },
      {
        key: 'inventoryQty',
        dataIndex: 'inventoryQty',
        title: '库存数量',
        width: 25,
      },
    ];
  
    return (
      <Style>
        <Modal
          visible={stockVisible}
          onCancel={this.underStockCancel}
          width='820px'
          footer={[
            <Button type='primary' key='save' onClick={this.underStockCancel}>
              确认
            </Button>,
          ]}>
          <div
            style={{
              maxHeight: '540px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '15px',
            }}
          >
            <Row span={24}>
              <h3>商品库存不足</h3>
            </Row>
            <hr />
            <Table bordered dataSource={stockDataSource} columns={stockColumns} size='small' />
          </div>
        </Modal>
      </Style>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    stockVisible, queryLoading, stockDataSource,
  } = state.modalInfo

  return {
    stockVisible, queryLoading, stockDataSource,
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

const UnderStocks = Form.create()(UnderStock);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnderStocks)