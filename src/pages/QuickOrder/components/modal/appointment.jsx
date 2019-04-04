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
import { Trim, } from '@/config/methods.js';
import { getOptionRender, } from '../../common/methods';
// UI组件
import {
  Form, Select, Spin, Icon, Modal, Row, Table, Button, Col, Input,
  message,
} from 'antd'
const FormItem = Form.Item;

// API
import {

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colBigLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class Appointment extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  // 取消弹窗
  appointCancel = () => {
    this.props.MODAL_SET_STATE({ appointmentVisible: false })
    // this.handleResetForm();
  };

  /* 选中单号 */
  appointeOk = () => {
    const radioCheckedOption = this.props.radioCheckedOption;
    this.props.TABLE_SET_STATE({
      cusAndCarInfo: {
        ...this.props.cusAndCarInfo,
        appointmentOrderNo: radioCheckedOption.appointmentNo,
        appointmentOrderId: String(radioCheckedOption.id),
      }
    })
    this.props.checkAppointment();
  }
  /* 输入框修改 */
  inputChange = (type, event) => {
    this.props.MODAL_SET_STATE({ queryAppointmentOrderVO: { ...this.props.queryAppointmentOrderVO, [type]: Trim(event.target.value, 'g') } });

  }
  /* 重置 */
  handleResetForm = () => {
    this.props.MODAL_SET_STATE({
      queryAppointmentOrderVO: {
        appointmentOrder: '', //预约单号,
        vin: '', //vin码,
        plate: '', //车牌号,
        repairPersonId: '', //预约人id,
        repairMobile: '', //预约电话
      },
    })
    this.props.form.resetFields();
  }
  /* 查询 */
  searchTabled = () => {
    this.props.getAppointmentOrder();
  }
  /* 选择预约人 */
  handleAppointChange = selectedItems => {
    this.props.MODAL_SET_STATE({
      queryAppointmentOrderVO: {
        ...this.props.queryAppointmentOrderVO,
        repairPersonId: selectedItems, //预约人id,
      }
    })
  };
  render() {
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const {
      appointmentVisible, appointmentData, queryLoading, queryAppointmentOrderVO,
      repairPersonData,
    } = this.props;
    // 表单
    const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.MODAL_SET_STATE({ radioCheckedOption: selectedRows[0] });
      },
      type: 'radio',
    };
    const appointmentColumns = [
      {
        title: '预约单号',
        key: 'appointmentNo',
        dataIndex: 'appointmentNo',
        align: 'center',
        width: 180,
      },
      {
        title: 'VIN',
        key: 'vin',
        dataIndex: 'vin',
        align: 'center',
        width: 200,
      },
      {
        title: '车牌号',
        key: 'plate',
        dataIndex: 'plate',
        align: 'center',
        width: 200,
      },
      {
        title: '预约人',
        key: 'repairPerson',
        dataIndex: 'repairPerson',
        align: 'center',
        width: 200,
      },
      {
        title: '预约电话',
        key: 'repairMobile',
        dataIndex: 'repairMobile',
        align: 'center',
        width: 200,
      },
      {
        title: '预约时间',
        key: 'appointTime',
        dataIndex: 'appointTime',
        align: 'center',
        width: 200,
      },
      {
        title: '预约项目',
        key: 'itemsName',
        dataIndex: 'itemsName',
        align: 'center',
        width: 200,
      },
    ];

    return (
      <Style>
        <Modal visible={appointmentVisible} onCancel={this.appointCancel} width='820px'
          footer={[<Button type='primary' key='ensure' onClick={this.appointeOk}>确定</Button>,
          <Button key='cancel' onClick={this.appointCancel}>取消</Button>]}>
          <Spin spinning={queryLoading} indicator={antIcon} tip='加载中'>
            <div style={{
              maxHeight: '540px', overflowY: 'auto',
              overflowX: 'hidden', paddingRight: '15px',
            }} >
              <Row span={24}>
                <h3>预约信息提示</h3>
              </Row>
              <Form>
                <Row gutter={gutter}>
                  <Col {...colBigLayout}>
                    <FormItem {...formLayout} label='预约单号'>
                      {getFieldDecorator('appointmentOrder', {
                        initialValue: queryAppointmentOrderVO.appointmentOrder
                      })(
                        <Input onChange={this.inputChange.bind(event, 'appointmentOrder')} placeholder="请输入预约单号" />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colBigLayout}>
                    <FormItem {...formLayout} label='VIN'>
                      {getFieldDecorator('vin', {
                        initialValue: queryAppointmentOrderVO.vin
                      })(
                        <Input onChange={this.inputChange.bind(event, 'vin')} placeholder="请输入vin码" />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colBigLayout}>
                    <FormItem {...formLayout} label='车牌号'>
                      {getFieldDecorator('plate', {
                        initialValue: queryAppointmentOrderVO.plate
                      })(
                        <Input onChange={this.inputChange.bind(event, 'plate')} placeholder="请输入车牌号" />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colBigLayout}>
                    <FormItem {...formLayout} label='预约人'>
                      {getFieldDecorator('repairPerson', {
                        initialValue: queryAppointmentOrderVO.repairPerson
                      })(
                        <Select
                          showSearch
                          placeholder="请输入预约人"
                          onChange={this.handleAppointChange}
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {getOptionRender(repairPersonData, { key: 'key', code: 'key', name: 'text' })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colBigLayout}>
                    <FormItem {...formLayout} label='预约电话'>
                      {getFieldDecorator('repairMobile', {
                        initialValue: queryAppointmentOrderVO.repairMobile,
                        rules: [
                          {
                            pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                            message: '请输入021-1234567格式的号码或手机号',
                          },
                        ],
                      })(
                        <Input onChange={this.inputChange.bind(event, 'repairMobile')} placeholder="如021-1234567/手机号" />
                      )}
                    </FormItem>
                  </Col>
                  <Col {...colBigLayout}>
                    <Button type='primary' onClick={this.searchTabled} style={{ float: 'right', display: 'inlene-block' }}> 查询 </Button>
                    <Button onClick={this.handleResetForm} style={{ marginRight: '8px', float: 'right', display: 'inlene-block' }}>重置</Button>
                  </Col>
                </Row>
              </Form>

              <Table rowSelection={rowSelection} bordered dataSource={appointmentData} columns={appointmentColumns} size='small' />
            </div>
          </Spin>
        </Modal>
      </Style>
    )
  }
}

const mapStateToProps = (state) => {
  const { cusAndCarInfo, } = state.tableInfo
  const {
    appointmentVisible, queryLoading, appointmentData, queryAppointmentOrderVO,
    getAppointmentOrder, repairPersonData, radioCheckedOption,
  } = state.modalInfo

  return {
    appointmentVisible, queryLoading, appointmentData, queryAppointmentOrderVO,
    getAppointmentOrder, repairPersonData, cusAndCarInfo, radioCheckedOption,
  }
}

const mapDispatchToProps = (dispatch) => {
  const { TABLE_SET_STATE } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, getAppointmentOrder, checkAppointment,
  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE, getAppointmentOrder, TABLE_SET_STATE,
    checkAppointment,

  }
}

const Appointments = Form.create()(Appointment);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Appointments)