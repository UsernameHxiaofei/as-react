// 基础模块
import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import * as _ from 'lodash';

// 方法
const {
  REDIRECTION_URL: { MaintenanceHistory }, HOST,
} = env;
import { DelErrorMsg } from '../../common/components';
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
// UI组件
import {
  Form, Select, Spin, Icon, Modal, Row, Table, Button, Col, InputNumber,
  message,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {
  settlementConfirm,

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class CalculateOrder extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.MODAL_SET_STATE();
  }
  // 取消结算
  calculateOrderCancel = () => {
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({ calculateVisible: false, });
  };

  /** 确认提交工单 */
  calculateOk = () => {
    const { cusAndCarInfo,settlementDto } = this.props;
    this.props.MODAL_SET_STATE({ calculateLoading: true });
    const SettlementConfirmVo = {
      woId: cusAndCarInfo.id, // 工单ID,
      oldMaLingAmount: settlementDto.oldMaLingAmount, // 原抹零金额,
      newMaLingAmount: settlementDto.maLingAmount, // 现抹零金额
    };
    settlementConfirm(SettlementConfirmVo).then((res) => {
      if (res.success && res.code == 200) {
        message.success('结算成功');
      } else {
        DelErrorMsg(res.msg);
      }
      this.props.MODAL_SET_STATE({ calculateLoading: false , calculateVisible: false});
    });
  };

  // 结算修改金额
  modalChange = (type, event) => {
    const { settlementDto } = this.props;
    if (event < 0) return message.error('抹零金额必须大于0');
    if (event > settlementDto.cusPayAmount) return message.error('抹零金额必须小于客户付费');
    this.props.TABLE_SET_STATE({
      settlementDto: {
        ...settlementDto,
        maLingAmount: event,
        payAmount: accSub(settlementDto.cusPayAmount, event),
      },
    });
  };


  render() {
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const {
      calculateVisible, tableLoading, calculateLoading, workModalDataSource,
      goodModalDataSource, settlementDto, cusAndCarInfo,
    } = this.props;
    const workModalColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '工项编码',
        width: 60,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '工项名称',
        width: 60,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '工项类型',
        width: 40,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 40,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '数量',
        width: 15,
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: '单价',
        width: 20,
      },
      {
        key: 'amount',
        dataIndex: 'amount',
        title: '金额',
        width: 25,
      },
      {
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        title: '应收金额',
        width: 25,
      },
    ];
    const goodModalColumns = [
      {
        key: 'goodsNo',
        dataIndex: 'goodsNo',
        title: '商品编码',
        width: 60,
      },
      {
        key: 'goodsName',
        dataIndex: 'goodsName',
        title: '商品名称',
        width: 60,
      },
      {
        key: 'goodsTypeName',
        dataIndex: 'goodsTypeName',
        title: '商品类型',
        width: 40,
      },
      {
        key: 'settleTypeName',
        dataIndex: 'settleTypeName',
        title: '结算方式',
        width: 40,
      },
      {
        key: 'qty',
        dataIndex: 'qty',
        title: '数量',
        width: 15,
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: '单价',
        width: 20,
      },
      {
        key: 'amount',
        dataIndex: 'amount',
        title: '金额',
        width: 25,
      },
      {
        key: 'receivableAmount',
        dataIndex: 'receivableAmount',
        title: '应收金额',
        width: 25,
      },
    ];

    return (
      <Style>
        <Modal visible={calculateVisible} onCancel={this.calculateOrderCancel} width='920px'
          footer={[
            <Button type='primary' key='save' loading={calculateLoading}
              onClick={this.calculateOk}
            > 确认</Button>,
          ]}>
          <Spin spinning={tableLoading} indicator={antIcon} tip='加载中'>
            <div
              style={{
                maxHeight: '540px',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '15px',
              }}
            >
              <Form>
                <Row span={24}>
                  <h3>结算确认</h3>
                </Row>
                <hr />
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.cusName}</span>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='客户手机'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.cusContactPhone}</span>
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='车牌号'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.carPlateNo}</span>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label='VIN'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.vin}</span>
                    </FormItem>
                  </Col>
                  <Col span={16}>
                    <FormItem
                      {...formLayout}
                      label='品牌车型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusAndCarInfo.carModelName}</span>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Table
                bordered
                className='mb16'
                dataSource={workModalDataSource}
                columns={workModalColumns}
                size='small'
              />
              <Table
                bordered
                className='mb16'
                dataSource={goodModalDataSource}
                columns={goodModalColumns}
                size='small'
              />

              <Row>
                <Col span={4}>
                  <FormItem
                    {...formLayout}
                    label='抹零：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <InputNumber
                      min={0}
                      max={Number(settlementDto.cusPayAmount)}
                      value={settlementDto.maLingAmount || 0}
                      precision={2}
                      disabled={cusAndCarInfo.payAmount == 0}
                      onChange={this.modalChange.bind(event, 'maLingAmount')}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='总金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.totalAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='商品金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.goodsAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='施工金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.workItemAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='抹零金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.maLingAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='应付金额：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.receivableAmount}</span>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    {...formLayout}
                    label='客户付费：'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    <span>{settlementDto.payAmount}</span>
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Spin>
        </Modal>
      </Style>
    )
  }
}

const mapStateToProps = (state) => {
  const { 
    cusAndCarInfo, settlementDto, workModalDataSource, goodModalDataSource,tableLoading,
   } = state.tableInfo
  const {
    calculateVisible,calculateLoading,
  } = state.modalInfo

  return {
    calculateVisible, calculateLoading, workModalDataSource,
    goodModalDataSource, settlementDto, cusAndCarInfo,tableLoading,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {TABLE_SET_STATE, } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE,TABLE_SET_STATE,
  }
}

const CalculateOrders = Form.create()(CalculateOrder);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculateOrders)