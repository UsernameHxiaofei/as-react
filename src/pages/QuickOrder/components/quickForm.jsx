// 基础模块
import React, { Component } from 'react'
import styled, { consolidateStreamedStyles } from 'styled-components';
import { connect } from 'react-redux'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import { PersonAndCar } from '@/components/Common';
import * as _ from 'lodash';
import QuickTable from './quickTable';

// 方法
import { Trim, accSub, accAdd, accMul } from '@/config/methods.js';
import { getOptionRender, decimalsCut, } from '../common/methods';

// UI组件
import {
  Form, Select, Spin, Icon, Col, Row, Input, LocaleProvider, DatePicker,
  InputNumber, Checkbox, Button, message,
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
.mr20 {
  margin-right: 20px;
}
`;



class QuickForm extends Component {

  componentDidMount = () => {
    // this.props.seeQueryWorkOrder('63801f5a7a694730b99b80d906dd67d7');/* ---- */
    // 接收页面跳转的数据
    // window.addEventListener('message', (e) => {
    //   console.log('维修开单接收的跳转数据', e.data)
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     new Promise((resolve, reject) => {
    //       this.props.tableReset({
    //         editId: data.id,
    //         orderType: data.type, //copy复制工单  editEo编辑工单 copy 估计单转工单
    //         cusAndCarInfo: { ...this.props.cusAndCarInfo, eoId: data.eoId || '' },
    //         resolve, reject
    //       })
    //       this.props.baseReset({
    //         listLoading: true,
    //         resolve, reject
    //       })
    //     }).then(() => {
    //       // 工单查看
    //       this.props.seeQueryWorkOrder(this.props.editId);
    //       this.props.SET_STATE({ listLoading: false })
    //     })
    //   }
    // });
    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        new Promise((resolve, reject) => {
          this.props.tableReset({
            editId: data.id,
            orderType: data.type, //copy复制工单  editEo编辑工单 copy 估计单转工单
            cusAndCarInfo: { ...this.props.cusAndCarInfo, eoId: data.eoId || '' },
            resolve, reject
          })
          this.props.baseReset({
            listLoading: true,
            resolve, reject
          })
        }).then(() => {
          // 工单查看
          this.props.seeQueryWorkOrder(this.props.editId);
          this.props.SET_STATE({ listLoading: false })
        })
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          new Promise((resolve, reject) => {
            this.props.tableReset({
              editId: data.id,
              orderType: data.type, //copy复制工单  editEo编辑工单 copy 估计单转工单
              cusAndCarInfo: { ...this.props.cusAndCarInfo, eoId: data.eoId || '' },
              resolve, reject
            })
            this.props.baseReset({
              listLoading: true,
              resolve, reject
            })
          }).then(() => {
            // 工单查看
            this.props.seeQueryWorkOrder(this.props.editId);
            this.props.SET_STATE({ listLoading: false })
          })
        }
      });
    }

    if (localStorage.getItem('loginInfo')) {
      const _data = JSON.parse(localStorage.getItem('loginInfo')).login;
      this.props.TABLE_SET_STATE({
        cusAndCarInfo: {
          ...this.props.cusAndCarInfo,
          woCreatorEmpName: _data.empName || '',
        },
      });
    }
    this.props.getDicDataesByCategoryCode({ code: '7000' }, 'fuelMeterScale'); //油表信息
    this.props.getDicDataesByCategoryCode({ code: '7005' }, 'settleType'); // 获取结算方式
    this.props.getDicDataesByCategoryCode({ code: '9999' }, 'goodsArr'); // 获取万能工项商品id
    this.props.getDicDataesByCategoryCode({ code: '3005' }, 'cusType'); // 获取客户类型
    this.props.getDicDataesByCategoryCode({ code: '1045' }, 'carPre'); // 获取车牌前缀
    this.props.getDicDataesByCategoryCode({ code: '1015' }, 'cusGender'); // 获取性别
    this.props.getDicDataesByCategoryCode({ code: '1055' }, 'carPowerType'); // 获取动力类型
    this.props.getDicDataesByCategoryCode({ code: '1050' }, 'carUsage'); // 获取用途
    this.props.getBasValueByBasCategoryNo({ categoryNo: 'AS1000' }, 'workBizType'); //业务类型
    this.props.listMdmWorkHourPrice(); //工时单价
    this.props.getHrEmpMstrByOrgId(); //服务接待
    this.props.queryWorkSetting(); //默认的业务类型和结算方式
  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }

  // 人车关系
  carOwnerCusNameChange = (value) => {
    // console.log('已修改', value);
    const { cusAndCarInfo, cusUpdateInfo, queryAppointmentOrderVO } = this.props;
    this.props.form.setFieldsValue({ cusNama: value.cusName });
    this.props.TABLE_SET_STATE({
      cusAndCarInfo: {
        ...cusAndCarInfo,
        carId: value.id, // 车辆id
        cusId: value.cusId, // 客户Id,
        cusNo: value.cusNo, // 客户编码
        cusName: value.cusName, // 客户姓名,
        carPlateNo: value.carPlateTypeName + value.carPlateNo, // 车牌号,111
        vin: value.vin,
        cusContactPhone: value.cusContactNo, // 客户联系方式（手机号/座机号）
        carModelId: value.carModelId, // 车型ID,
        carModelName: value.carModelName, // 车型名称：品牌 车系 车型
        // carModelName: value.carBrandName + ' ' + value.carSeriesName + ' ' + value.carModelName, // 车型名称：品牌 车系 车型
        carEngineeNo: value.carEngineeNo, // 发动机号,
        carColorId: value.carColorId, // 车身色ID,
        carInnerColorId: value.carInnerColorId, // 内饰色ID,
        carColor: `${value.carColorName} ${value.carInnerColorName}`, // 车辆颜色
        carPowerTypeId: value.carPowerTypeId, // 车辆动力类型ID,
        carPowerTypeCode: value.carPowerTypeCode, // 车辆动力类型编码,
        carPowerTypeName: value.carPowerTypeName, // 车辆动力类型名称,
        appointmentOrderNo: '', // 预约单号
        appointmentOrderId: '', // 预约单号id
      },
    });
    new Promise((resolve, reject) => {
      this.props.modalReset({
        cusUpdateInfo: {
          ...cusUpdateInfo,
          id: value.cusId,
        },
        queryAppointmentOrderVO: {
          ...queryAppointmentOrderVO,
          appointmentOrder: '', //预约单号,
          vin: value.vin, //vin码,
          plate: value.carPlateTypeName + value.carPlateNo, //车牌号,
          repairMobile: value.cusContactNo, //预约电话
        },
        appointState: 'auto',
        resolve, reject
      })
    }).then(_ => {
      if (this.props.cusAndCarInfo.id != '' && this.props.cusAndCarInfo.appointmentOrderNo != '') {
      } else {
        new Promise((resolve, reject) => {
          this.props.SET_STATE({ listLoading: true })
          this.props.getAppointmentOrder(this.props.queryAppointmentOrderVO, resolve)
        }).then(_ => {
          this.props.SET_STATE({ listLoading: false })
        })
      }
    })
  };

  // 新增车主
  addCarAndMan = () => {
    const { addCarSave } = this.props;
    this.props.MODAL_SET_STATE({
      addVisible: true,
      cusUpdateFlag: 'save',
      threeLevelValue: [],
      addCarSave: {
        ...addCarSave,
        synchronousOwners: false,
      },
    });
  };

  // 修改下拉框
  statesChange = (type, code, e) => {
    // console.log('下拉框修改', 'type:' , type, 'code:' , code, 'e:', e)
    if (type == 'fuelMeterScaleName') { // 油表信息
      if (code) {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: {
            ...this.props.cusAndCarInfo,
            fuelMeterScaleId: e.key, fuelMeterScaleCode: code, fuelMeterScaleName: e.props.children
          }
        });
      } else {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: { ...this.props.cusAndCarInfo, fuelMeterScaleId: '', fuelMeterScaleCode: '', fuelMeterScaleName: '', },
        });
      }
    }

    if (type == 'scEmpName') { // 服务接待
      if (code) {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: {
            ...this.props.cusAndCarInfo,
            scEmpId: e.key, scEmpName: e.props.children,
          },
        });
      } else {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: Object.assign({}, ...this.props.cusAndCarInfo, { scEmpId: '', scEmpName: '' }),
        });
      }
    }

    if (type == 'bizTypeName' && code) { // 业务类型
      if (code) {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: {
            ...this.props.cusAndCarInfo,
            bizTypeId: e.key, bizTypeCode: code, bizTypeName: e.props.children,
          },
        });
      } else {
        this.props.TABLE_SET_STATE({
          cusAndCarInfo: Object.assign({}, ...this.props.cusAndCarInfo, { bizTypeId: '', bizTypeCode: '', bizTypeName: '' }),
        });
      }
    }
  };


  // 改变工时单价计算价格
  changeStdPrice = (code, e) => {
    let { workHoursDataSource, dropDownWorkHoursTable } = _.cloneDeep(this.props);
    if (code) {
      let stdPrice = e.props.children;
      this.props.TABLE_SET_STATE({
        cusAndCarInfo: {
          ...this.props.cusAndCarInfo,
          workHourlyPrice: stdPrice,
        },
      });

      // 计算工项中的单价
      workHoursDataSource.map(item => {
        // 套餐和万能工时的单价不会改变
        if (item.workNeeded != 1 && item.combo != 2 && item.index != 0) {
          item.price = accMul(item.stdWorkHour, stdPrice);
          item.amount = decimalsCut({ number: item.price * item.qty });
          item.receivableAmount = decimalsCut({ number: item.amount * item.discountRate, });
        }
      })
      //   // 计算工项下拉框中的单价
      dropDownWorkHoursTable.map(item => { item.price = accMul(item.stdWorkHour, stdPrice); })

      this.props.TABLE_SET_STATE({
        workHoursDataSource,
        dropDownWorkHoursTable
      })
      this.setState({}, () => {
        this.props.calculateTotal('workHoursDataSource');
        // this.props.calculateBottomTotal()
      })
    } else {
      this.props.TABLE_SET_STATE({
        cusAndCarInfo: { ...cusAndCarInfo, workHourlyPrice: '' },
      });
    }
  }

  // 修改日期
  singleDateChange = (type, date, dateString) => {
    if (type == 'estimatedCarDeliveryDate') {
      if (dateString) {
        this.props.form.setFieldsValue({ estimatedCarDeliveryDate: dateString });
        this.props.TABLE_SET_STATE({ cusAndCarInfo: { ...this.props.cusAndCarInfo, estimatedCarDeliveryDate: dateString }, });
      } else {
        this.props.form.setFieldsValue({ estimatedCarDeliveryDate: '' });
        this.props.TABLE_SET_STATE({ cusAndCarInfo: { ...this.props.cusAndCarInfo, estimatedCarDeliveryDate: '' }, });
      }
    }
  };

  // 输入框修改
  queryChange = (type, event) => {
    if (type == 'inStoreMileage') {
      this.props.TABLE_SET_STATE({ cusAndCarInfo: { ...this.props.cusAndCarInfo, inStoreMileage: event } });
    } else {
      this.props.TABLE_SET_STATE({ cusAndCarInfo: { ...this.props.cusAndCarInfo, [type]: Trim(event.target.value, 'g') } });
    }
  };

  // 勾选操作
  onCheckChange = (type, event) => {
    const flag = event.target.value == 0 ? 1 : 0;
    this.props.TABLE_SET_STATE({ cusAndCarInfo: { ...this.props.cusAndCarInfo, [type]: flag } });

  };

  /** 保存工单 */
  handleSaveTable = () => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll([
      'cusNama',
      'fuelMeterScaleName',
      'estimatedCarDeliveryDate',
      'carSenderName',
      'carSenderPhone',
      'inStoreMileage',
      'scEmpName',
      'bizTypeName',
      'workHourlyPrice',
    ], (err, values) => {
      if (!err) {
        const { cusAndCarInfo, orderType, } = this.props;
        const ids = cusAndCarInfo.id;
        new Promise((resolve, reject) => {
          this.props.tableReset({
            submitLoading: true,
            cusAndCarInfo: { ...cusAndCarInfo, id: orderType == 'copy' ? '' : ids },
            resolve, reject
          })
        }).then(() => {
          const workDataSource = _.cloneDeep(this.props.workHoursDataSource);
          const goodDataSource = _.cloneDeep(this.props.goodsDataSource);
          workDataSource.splice(workDataSource.length - 1, 1);
          goodDataSource.splice(goodDataSource.length - 1, 1);
          const SaveWorkOrdeVo = {
            mstrVo: this.props.cusAndCarInfo,
            workItemsDetVos: workDataSource,
            goodsDetVos: goodDataSource,
          };
          new Promise((resolve, reject) => {
            this.props.saveWorkOrder(SaveWorkOrdeVo);
          }).then(_ => {
            new Promise((resolve, reject) => {
              this.props.seeQueryWorkOrder(this.props.isId);
            }).then(_ => {
              this.props.form.setFieldsValue({ estimatedCarDeliveryDate: this.props.cusAndCarInfo.estimatedCarDeliveryDate });
            })
          })

        })
      }
    },
    );
  };

  // 工单转施工单
  handleChangeTable = () => {
    const { cusAndCarInfo, isId, selectedWorkRowKeys, workHoursDataSource } = _.cloneDeep(this.props);
    // 判断勾选行是否先保存过了
    const selectedFlag = workHoursDataSource.some(item => {
      return item.id == '';
    })
    if (!isId || selectedFlag) {
      message.error('请先保存工单');
      return false;
    }
    // 必须先选工时才能转施工单
    if (selectedWorkRowKeys.length == 0) {
      return message.error('请选择工项');
    } else {
      const params = { woId: cusAndCarInfo.id, workItemIds: selectedWorkRowKeys };
      this.props.convertWorkProcessOrder(params)
    }
  };

  // 工单完工
  handleCompleteTable = () => {
    const { isId } = this.props;
    if (!isId) {
      message.error('请先保存工单');
      return false;
    }
    this.props.finishWorkOrder();
  }

  /** 提交工单 */
  handleSubmitTable = () => {
    const { cusAndCarInfo, defaultTypeValue: { isAutoGoods } } = this.props;
    if (isAutoGoods == '10000000') { //自动发料需要查库存
      this.props.querySettlementGoodsInventory({ woId: cusAndCarInfo.id })
    } else {
      // 正常结算
      this.props.MODAL_SET_STATE({ calculateVisible: true, tableLoading: true });
      this.props.seeQueryWorkOrder(cusAndCarInfo.id);
    }
    this.props.TABLE_SET_STATE({ isId: '' });
  };
  render() {
    const {
      listLoading, cusAndCarInfo, fuelMeterScale, workHourlyPrice, scEmp, workBizType,
      orderType,
    } = this.props
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const w100p = { width: '100%' };
    // 表单
    const { getFieldDecorator } = this.props.form;
    const formInputLayout = {
      labelCol: {
        sm: { span: 0 },
      },
      wrapperCol: {
        sm: { span: 22, offset: 2 },
      },
    };
    const formSpanLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    const formSmallLayout = {
      labelCol: {
        sm: { span: 24 },
      },
      wrapperCol: {
        sm: { span: 0 },
      },
    };

    // 限制日期
    function disabledDate(current) {
      // 小于当前日期不能选
      return current < moment().subtract(1, "days")
    }
    return (
      <Style>
        <Spin spinning={listLoading} indicator={antIcon} tip='加载中'>
          {/* <h3>快捷开单</h3>
          <Col span={22}> */}
          <Row>
            <Col sm={23} md={12} lg={5} className='pr20'>
              <FormItem {...formInputLayout} label=''>
                <div style={w100p}>
                  <PersonAndCar
                    callback={this.carOwnerCusNameChange.bind(this)}
                    addCar={this.addCarAndMan}
                    placeholder='手机号/车牌号/姓名/VIN'
                    disabled={orderType == 'editEo'}
                  />
                </div>
              </FormItem>
            </Col>
            <Col sm={23} md={11} lg={3} offset={1} className='pr20'>
              <FormItem {...formLayout} label='状态'>
                <span>{cusAndCarInfo.woStatusName}</span>
              </FormItem>
            </Col>
            <Col sm={24} md={12} lg={5} className='pr20'>
              <FormItem {...formLayout} label='工单号'>
                <span>{cusAndCarInfo.woNo}</span>
              </FormItem>
            </Col>
            <Col sm={24} md={12} lg={4} className='pr20'>
              <FormItem {...formLayout} label='制单人'>
                <span>{cusAndCarInfo.woCreatorEmpName}</span>
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='创建时间'>
                <span>
                  {cusAndCarInfo.woCreateDate || moment().format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='客户姓名'>
                {getFieldDecorator('cusNama', {
                  initialValue: cusAndCarInfo.cusName,
                  rules: [
                    {
                      required: true,
                      message: '车主姓名不能为空！',
                    },
                  ],
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='联系电话'>
                <Input value={cusAndCarInfo.cusContactPhone} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='会员号'>
                <Input value={cusAndCarInfo.memberNo} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='VIN'>
                <Input value={cusAndCarInfo.vin} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='车牌:'>
                <Input value={cusAndCarInfo.carPlateNo} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='发动机号'>
                <div style={w100p}>
                  <Input value={cusAndCarInfo.carEngineeNo} disabled />
                </div>
              </FormItem>
            </Col>
            <Col span={12} className='pr20'>
              <FormItem {...formSpanLayout} label='车型'>
                <Input value={cusAndCarInfo.carModelName} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='车辆颜色'>
                <Input value={cusAndCarInfo.carColor} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='动力类型'>
                <Input value={cusAndCarInfo.carPowerTypeName} disabled />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='油表信息'>
                {getFieldDecorator('fuelMeterScaleName', {
                  initialValue: cusAndCarInfo.fuelMeterScaleName,
                  rules: [
                    {
                      required: true,
                      message: '油表信息不能为空！',
                    },
                  ],
                })(<Select
                  allowClear
                  style={w100p}
                  onChange={this.statesChange.bind(event, 'fuelMeterScaleName')}
                >
                  {getOptionRender(fuelMeterScale, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='工时单价'>
                {getFieldDecorator('workHourlyPrice', {
                  initialValue: cusAndCarInfo.workHourlyPrice,
                  rules: [
                    {
                      required: true,
                      message: '工时单价不能为空！',
                    },
                  ],
                })(<Select
                  allowClear
                  style={w100p}
                  onChange={this.changeStdPrice.bind(event)}
                >
                  {getOptionRender(workHourlyPrice, { key: 'key', code: 'mdmWorkHourPriceId', name: 'workHourPrice' })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='预计交车'>
                {getFieldDecorator('estimatedCarDeliveryDate', {
                  initialValue: cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate) : null,
                  rules: [
                    {
                      required: true,
                      message: '预计交车不能为空！',
                    },
                  ],
                })(<LocaleProvider locale={zh_CN}>
                  <DatePicker
                    style={w100p}
                    showTime
                    disabledDate={disabledDate}
                    onChange={this.singleDateChange.bind(event, 'estimatedCarDeliveryDate')}
                    format='YYYY-MM-DD HH:mm'
                    value={cusAndCarInfo.estimatedCarDeliveryDate ? moment(cusAndCarInfo.estimatedCarDeliveryDate, 'YYYY-MM-DD HH:mm') : null}
                  />
                </LocaleProvider>)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='送修人'>
                {getFieldDecorator('carSenderName', {
                  initialValue: cusAndCarInfo.carSenderName,
                  rules: [
                    {
                      required: true,
                      message: '送修人不能为空！',
                    },
                  ],
                })(<Input onChange={this.queryChange.bind(event, 'carSenderName')} />)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='送修人电话'>
                {getFieldDecorator('carSenderPhone', {
                  initialValue: cusAndCarInfo.carSenderPhone,
                  rules: [
                    {
                      required: true,
                      message: '送修人电话不能为空！',
                    },
                    {
                      pattern: /^(([0]\d{2}-\d{7,8})|(1[34578]\d{9}))$/,
                      message: '请输入021-1234567格式的号码或手机号',
                    },
                  ],
                })(<Input
                  placeholder='如021-1234567或手机号'
                  onChange={this.queryChange.bind(event, 'carSenderPhone')}
                />)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='进店里程'>
                {getFieldDecorator('inStoreMileage', {
                  initialValue: cusAndCarInfo.inStoreMileage,
                  rules: [
                    {
                      required: true,
                      message: '进店里程不能为空！',
                    },
                    {
                      pattern: /^\d{0,6}$/,
                      message: '进店里程已超过车辆里程表限额[999999]',
                    },
                  ],
                })(<InputNumber
                  style={w100p}
                  onChange={this.queryChange.bind(event, 'inStoreMileage')}
                />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='服务接待'>
                {getFieldDecorator('scEmpName', {
                  initialValue: cusAndCarInfo.scEmpName,
                  rules: [
                    {
                      required: true,
                      message: '服务接待不能为空！',
                    },
                  ],
                })(<Select
                  allowClear
                  style={w100p}
                  onChange={this.statesChange.bind(event, 'scEmpName')}
                >
                  {getOptionRender(scEmp, { key: 'key', code: 'key', name: 'empName' })}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='业务类型'>
                {getFieldDecorator('bizTypeName', {
                  initialValue: cusAndCarInfo.bizTypeName,
                  rules: [
                    {
                      required: true,
                      message: '业务类型不能为空！',
                    },
                  ],
                })(<Select
                  allowClear
                  style={w100p}
                  onChange={this.statesChange.bind(event, 'bizTypeName')}
                >
                  {getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' })}
                </Select>)}
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='厂商单号'>
                <Input
                  value={cusAndCarInfo.oemOrderNo}
                  onChange={this.queryChange.bind(event, 'oemOrderNo')}
                />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='维修建议'>
                <Input
                  value={cusAndCarInfo.repairAdvice}
                  onChange={this.queryChange.bind(event, 'repairAdvice')}
                />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='客户描述'>
                <div style={w100p}>
                  <Input
                    value={cusAndCarInfo.cusDesc}
                    onChange={this.queryChange.bind(event, 'cusDesc')}
                  />
                </div>
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='预检结果'>
                <Input
                  value={cusAndCarInfo.precheckResult}
                  onChange={this.queryChange.bind(event, 'precheckResult')}
                />
              </FormItem>
            </Col>
            <Col {...colLayout} className='pr20'>
              <FormItem {...formLayout} label='预约单号'>
                <Input disabled value={cusAndCarInfo.appointmentOrderNo}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} className='pr20'>
              <FormItem {...formSmallLayout} label='工单备注' />
            </Col>
            <Col span={22} className='pr20' style={{ marginTop: '10px' }}>
              <Row>
                <Col {...colLayout}>
                  <Checkbox
                    value={cusAndCarInfo.cusTakeOldParts}
                    onChange={this.onCheckChange.bind(event, 'cusTakeOldParts')}
                    checked={cusAndCarInfo.cusTakeOldParts == 1}
                  >
                    客户带走旧件
                    </Checkbox>
                </Col>
                <Col {...colLayout}>
                  <Checkbox
                    value={cusAndCarInfo.carWash}
                    onChange={this.onCheckChange.bind(event, 'carWash')}
                    checked={cusAndCarInfo.carWash == 1}
                  >
                    车辆洗车
                    </Checkbox>
                </Col>
                <Col {...colLayout}>
                  <Checkbox
                    value={cusAndCarInfo.cusWait}
                    onChange={this.onCheckChange.bind(event, 'cusWait')}
                    checked={cusAndCarInfo.cusWait == 1}
                  >
                    客户等待
                    </Checkbox>
                </Col>
                <Col {...colLayout}>
                  <Checkbox
                    value={cusAndCarInfo.cusRoadTestDrive}
                    onChange={this.onCheckChange.bind(event, 'cusRoadTestDrive')}
                    checked={cusAndCarInfo.cusRoadTestDrive == 1}
                  >
                    客户路试
                    </Checkbox>
                </Col>
              </Row>
            </Col>
          </Row>

          <QuickTable />
          <Row style={{ marginTop: '8px', textAlign: 'center' }}>
            <Col>
              <Button
                type='primary'
                loading={this.props.submitLoading}
                className='mr20'
                onClick={this.handleSaveTable}
              >保存</Button>
              <Button onClick={this.handleChangeTable} type='primary' className='mr20' >转施工单</Button>
              <Button onClick={this.handleCompleteTable} className='mr20'
                style={{ display: cusAndCarInfo.woStatusCode == '70200000' || cusAndCarInfo.woStatusCode == '70200005' ? 'inline-block' : 'none' }}
              >完工</Button>
              <Button onClick={this.handleSubmitTable}
                style={{ display: cusAndCarInfo.woStatusCode == '70200010' ? 'inline-block' : 'none' }}
              >结算</Button>
            </Col>
          </Row>
        </Spin>
      </Style>
    )
  }
}


const mapStateToProps = (state) => {
  const {
    listLoading, fuelMeterScale, workBizType,
  } = state.baseData
  const {
    workHourlyPrice, scEmp,
  } = state.searchForm
  const {
    workHoursDataSource, dropDownWorkHoursTable, cusAndCarInfo, editId, orderType,
    isId, submitLoading, selectedWorkRowKeys, defaultTypeValue, tableLoading,
    goodsDataSource,
  } = state.tableInfo
  const {
    cusUpdateInfo, queryAppointmentOrderVO, appointState, calculateVisible,
  } = state.modalInfo
  return {
    listLoading, editId, orderType, cusAndCarInfo, cusUpdateInfo, dropDownWorkHoursTable,
    fuelMeterScale, workHourlyPrice, scEmp, workBizType, workHoursDataSource,
    queryAppointmentOrderVO, appointState, tableLoading, goodsDataSource,
    isId, submitLoading, selectedWorkRowKeys, defaultTypeValue, calculateVisible,

  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    SET_STATE, RESET_STATE, getBasValueByBasCategoryNo, baseReset,
    getDicDataesByCategoryCode,
  } = dispatch.baseData
  const {
    FORM_SET_STATE, FORM_RESET_STATE, listMdmWorkHourPrice, getHrEmpMstrByOrgId,
  } = dispatch.searchForm
  const {
    TABLE_SET_STATE, TABLE_RESET_STATE, tableReset, calculateTotal, calculateBottomTotal,
    queryWorkSetting, seeQueryWorkOrder, saveWorkOrder, convertWorkProcessOrder,
    finishWorkOrder,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, querySettlementGoodsInventory, modalReset,
    getAppointmentOrder,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, FORM_SET_STATE, FORM_RESET_STATE, calculateTotal,
    TABLE_SET_STATE, TABLE_RESET_STATE, MODAL_SET_STATE, MODAL_RESET_STATE,
    listMdmWorkHourPrice, getHrEmpMstrByOrgId, getBasValueByBasCategoryNo,
    getDicDataesByCategoryCode, queryWorkSetting, tableReset, modalReset,
    calculateBottomTotal, seeQueryWorkOrder, querySettlementGoodsInventory,
    getAppointmentOrder, baseReset, saveWorkOrder, convertWorkProcessOrder,
    finishWorkOrder,
  }
}

const QuickForms = Form.create()(QuickForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(QuickForms))
