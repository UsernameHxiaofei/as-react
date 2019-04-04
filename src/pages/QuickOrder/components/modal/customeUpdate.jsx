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
import { DelErrorMsg } from '../..//common/components'
import { getOptionRender, getTotal, getReceiveTotal, getSelectedItemsInfo, calculateTable } from '../../common/methods';

// UI组件
import {
  Form, Select, Spin, Icon, Col, Row, Input, Modal, Button,message,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {
  updateCustomerById,

} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class CustomeUpdate extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  // 客户更新
  cusUpdateOk = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ['upMobileNo', 'upProvinceName', 'cusCityName', 'upRegionName', 'upStreetAddress'],
      (err, values) => {
        if (!err) {
          let { cusUpdateInfo } = this.props;
          this.props.MODAL_SET_STATE({ cusUpdateLoading: true });
          updateCustomerById(cusUpdateInfo).then((res) => {
            if (res.success && res.code == 200) {
              this.props.TABLE_SET_STATE({
                cusAndCarInfo: {
                  ...this.props.cusAndCarInfo,
                  cusContactPhone: cusUpdateInfo.cusMobileNo
                }
              });
              this.props.MODAL_SET_STATE({
                cusUpdateVisible: false,
              })
              message.success('更新成功');
            } else {
              DelErrorMsg(res.msg);
            }
            this.props.MODAL_SET_STATE({
              cusUpdateLoading: false,
            })
          });
        }
      },
    );
  };
  // 取消客户更新
  cusUpdateCancel = () => {
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({ cusUpdateVisible: false, });
  };
  // 更新车主信息
  cusUpChange = (type, event) => {
    this.props.MODAL_SET_STATE({
      cusUpdateInfo: { ...this.props.cusUpdateInfo, [type]: Trim(event.target.value, 'g') },
    });
  };
  // 修改下拉框
  statesChange = (type, code, e) => {
    // console.log('下拉框修改', type, code, e)
    if (type == 'upProvinceName') { //更新用户省
      if (code) {
        this.props.form.setFieldsValue({ upProvinceName: e.props.children, upCityName: '', upRegionName: '' });
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: {
            ...this.props.cusUpdateInfo,
            cusProvinceId: e.key, cusProvinceName: e.props.children,
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusCity');
      } else {
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: {
            ...this.props.cusUpdateInfo, cusProvinceId: '', cusProvinceName: '',
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          },
        });
      }
    }
    if (type == 'upCityName') { //  更新用户城市
      if (code) {
        this.props.form.setFieldsValue({ upCityName: e.props.children ,upRegionName: ''});
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: {
            ...this.props.cusUpdateInfo,
            cusCityId: e.key, cusCityName: e.props.children, cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusRegion');
      } else {
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: { ...this.props.cusUpdateInfo, cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '', },
        });
      }
    }
    if (type == 'upRegionName') { // 更新用户县
      if (code) {
        this.props.form.setFieldsValue({ upRegionName: e.props.children });
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: {
            ...this.props.cusUpdateInfo,
            cusRegionId: e.key, cusRegionName: e.props.children,
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          cusUpdateInfo: { ...this.props.cusUpdateInfo, cusRegionId: '', cusRegionName: '', },
        });
      }
    }

  };

  render() {
    const {
      cusUpdateVisible, cusUpdateLoading, queryLoading, cusUpdateInfo, cusProvince,
      cusRegion, cusCity,
    } = this.props
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;

    const w100p = { width: '100%' };
    // 表单
    const { getFieldDecorator } = this.props.form;

    return (
      <Style>
        {/* 客户更新 */}
        <Modal visible={cusUpdateVisible} onCancel={this.cusUpdateCancel} width='850px'
          footer={[<Button type='primary' key='update' loading={cusUpdateLoading} onClick={this.cusUpdateOk}>更新</Button>,]}>
          <Spin spinning={queryLoading} indicator={antIcon} tip='加载中'>
            <div style={{ maxHeight: '540px', overflowY: 'auto', overflowX: 'hidden', paddingRight: '15px', }} >
              <Form>
                <Row span={24}><h3>客户信息</h3>  </Row> <hr />
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <span>{cusUpdateInfo.cusName}</span>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upProvinceName', {
                        initialValue: cusUpdateInfo.cusProvinceName,
                        rules: [
                          {
                            required: true,
                            message: '省份不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'upProvinceName')}
                      >
                        {getOptionRender(cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upRegionName', {
                        initialValue: cusUpdateInfo.cusRegionName,
                        rules: [
                          {
                            required: true,
                            message: '区县不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'upRegionName')}
                      >
                        {getOptionRender(cusRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upMobileNo', {
                        initialValue: cusUpdateInfo.cusMobileNo,
                        rules: [
                          {
                            required: true,
                            message: '联系电话不能为空！',
                          },
                          {
                            pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                            message: '请输入021-1234567格式的号码或手机号',
                          },
                        ],
                      })(<Input onChange={this.cusUpChange.bind(event, 'cusMobileNo')} />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusCityName', {
                        initialValue: cusUpdateInfo.cusCityName,
                        rules: [
                          {
                            required: true,
                            message: '城市不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'upCityName')}
                      >
                        {getOptionRender(cusCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>)}

                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='客户地址'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('upStreetAddress', {
                        initialValue: cusUpdateInfo.cusStreetAddress,
                        rules: [
                          {
                            required: true,
                            message: '客户地址不能为空！',
                          },
                        ],
                      })(<Input onChange={this.cusUpChange.bind(event, 'cusStreetAddress')} />)}
                    </FormItem>
                  </Col>

                </Row>
              </Form>
            </div>
          </Spin>
        </Modal>
      </Style>
    )


  }
}

const mapStateToProps = (state) => {
  const {
    cusAndCarInfo,
  } = state.tableInfo
  const {
    cusUpdateInfo, cusUpdateVisible, cusUpdateLoading, queryLoading, cusProvince,
    cusRegion, cusCity,
  } = state.modalInfo

  return {
    cusUpdateInfo, cusUpdateVisible, cusUpdateLoading, queryLoading, cusProvince,
    cusRegion, cusCity, cusAndCarInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    SET_STATE, RESET_STATE,
  } = dispatch.baseData
  const {
    TABLE_SET_STATE, TABLE_RESET_STATE, tableReset,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, getGlobalMdmRegion,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, MODAL_SET_STATE, MODAL_RESET_STATE,
    getGlobalMdmRegion,TABLE_SET_STATE, TABLE_RESET_STATE, tableReset,
  }
}

const CustomeUpdates = Form.create()(CustomeUpdate);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomeUpdates)