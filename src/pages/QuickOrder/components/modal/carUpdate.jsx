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
import { DelErrorMsg } from '../../common/components'
// UI组件
import {
  Form, Select, Spin, Icon, Col, Row, Modal, Button, Table,
  InputNumber, Checkbox,
} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

// API
import {
  findCusLinkCarInfoByCusIdAndVin,
  getCarModelVo,
} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const Style = styled.div`

`;

class CarUpdate extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    this.props.MODAL_RESET_STATE()
  }

  // 取消车辆信息更新
  carUpdateCancel = () => {
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({ carUpdateVisible: false });
    this.props.MODAL_RESET_STATE();
  };

  //新增车辆信息
  carUpdateAdd = () => {
    this.props.MODAL_SET_STATE({ carUpdateVisible: false, });
    setTimeout(() => {
      this.props.MODAL_SET_STATE({
        threeLevelValue: [],
        addVisible: true,
        cusUpdateFlag: 'save'
      });
    }, 300);
  };

  // 编辑时获取默认品牌
  GetCarModelEditVo = (ids) => {
    const _th = this;
    let threeLevel;
    this.setState({ queryLoading: true });
    const getCarModelVoes = (obj, resolve) => {
      getCarModelVo({ id: obj }).then((res) => {
        if (res.success) {
          const list = res.data;
          if (res.data) {
            list.map((item) => {
              item.key = item.id;
              item.value = item.id;
              item.label = item.name;
            });
          }
          resolve(list);
        }
      });
    };
    new Promise((resolve, reject) => {
      getCarModelVoes(ids[0], resolve);
    }).then((res) => {
        // 一级
        threeLevel = res;
        new Promise((resolve, reject) => {
          getCarModelVoes(ids[1], resolve);
        }).then((res) => {
          // 二级
          const options = threeLevel.find(item => item.value == ids[1]);
          options.children = res;
          new Promise((resolve, reject) => {
            getCarModelVoes(ids[2], resolve);
          }).then((res) => {
            // 三级
            const options = threeLevel.find(item => item.value == ids[1]).children.find(item => item.value == ids[2]);
            options.children = res;
            _th.props.MODAL_SET_STATE({ CarModelVoList: threeLevel, queryLoading: false });
          });
        });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  //编辑车辆信息
  carUpdateEdit = (record) => {
    this.props.MODAL_SET_STATE({ carUpdateVisible: false, });
    setTimeout(() => {
      this.props.MODAL_SET_STATE({
        addVisible: true,
        cusUpdateFlag: 'edit'
      });
      findCusLinkCarInfoByCusIdAndVin({ cusId: this.props.cusAndCarInfo.cusId, vin: record.vin }).then((res) => {
        const datas = res.data;
        if (res.success && datas) {
          if (!datas.updateCustomerInfoDTO) datas.updateCustomerInfoDTO = {};
          if (!datas.linkUpdateCustomerInfoDTO) datas.linkUpdateCustomerInfoDTO = {};
          if (!datas.updateCarInfoAndOrgDubboDTO) datas.updateCarInfoAndOrgDubboDTO = {};
          this.props.MODAL_SET_STATE({
            threeflag: 0,
            addCarSave: {
              ...this.props.addCarSave,
              synchronousOwners: datas.synchronousOwners,
            },
          });
          this.props.MODAL_SET_STATE({
            threeLevelValue: [{
               label: datas.updateCarInfoAndOrgDubboDTO.carModelName,
               value: datas.updateCarInfoAndOrgDubboDTO.carModelId
              }],
            // threeLevelValue: [{ label: "2018款 凯越 15N 手动精英型", value: "227430" }],
            customerInfoDto: {
              ...this.props.customerInfoDto,
              cusTypeId: datas.updateCustomerInfoDTO.cusTypeId, // 客户类型ID,
              cusTypeName: datas.updateCustomerInfoDTO.cusTypeName, // 客户类型名称,
              cusName: datas.updateCustomerInfoDTO.cusName, // 客户姓名,
              cusGenderId: datas.updateCustomerInfoDTO.cusGenderId, // 客户性别ID,
              cusGenderName: datas.updateCustomerInfoDTO.cusGenderName, // 客户性别名称,
              cusMobileNo: datas.updateCustomerInfoDTO.cusMobileNo, // 联系电话,
              cusProvinceId: datas.updateCustomerInfoDTO.cusProvinceId, // 客户所在省份ID,
              cusProvinceName: datas.updateCustomerInfoDTO.cusProvinceName, // 客户所在省份名称,
              cusCityId: datas.updateCustomerInfoDTO.cusCityId, // 客户所在城市ID,
              cusCityName: datas.updateCustomerInfoDTO.cusCityName, // 客户所在城市名称,
              cusRegionId: datas.updateCustomerInfoDTO.cusRegionId, // 客户所在区ID,
              cusRegionName: datas.updateCustomerInfoDTO.cusRegionName, // 客户所在区名称,
              cusStreetAddress: datas.updateCustomerInfoDTO.cusStreetAddress, // 客户所在街道地址,
              cusCertificateNo: datas.updateCustomerInfoDTO.cusCertificateNo, // 组织架构代码
            },
            linkCustomerInfoDto: {
              ...this.props.linkCustomerInfoDto,
              cusName: datas.linkUpdateCustomerInfoDTO.cusName, // 客户姓名,
              cusGenderId: datas.linkUpdateCustomerInfoDTO.cusGenderId, // 客户性别ID,
              cusGenderName: datas.linkUpdateCustomerInfoDTO.cusGenderName, // 客户性别名称,
              cusMobileNo: datas.linkUpdateCustomerInfoDTO.cusMobileNo, // 联系电话,
              cusProvinceId: datas.linkUpdateCustomerInfoDTO.cusProvinceId, // 客户所在省份ID,
              cusProvinceName: datas.linkUpdateCustomerInfoDTO.cusProvinceName, // 客户所在省份名称,
              cusCityId: datas.linkUpdateCustomerInfoDTO.cusCityId, // 客户所在城市ID,
              cusCityName: datas.linkUpdateCustomerInfoDTO.cusCityName, // 客户所在城市名称,
              cusRegionId: datas.linkUpdateCustomerInfoDTO.cusRegionId, // 客户所在区ID,
              cusRegionName: datas.linkUpdateCustomerInfoDTO.cusRegionName, // 客户所在区名称,
              cusStreetAddress: datas.linkUpdateCustomerInfoDTO.cusStreetAddress, // 客户所在街道地址
            },
            carInfoDto: {
              ...this.props.carInfoDto,
              vin: datas.updateCarInfoAndOrgDubboDTO.vin, // 车架号,
              carId: datas.updateCarInfoAndOrgDubboDTO.carId, // 车辆id,
              carPlateTypeId: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeId, // 车牌号类型ID,
              carPlateTypeCode: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeCode, // 车牌号类型编码,
              carPlateTypeName: datas.updateCarInfoAndOrgDubboDTO.carPlateTypeName, // 车牌号类型名称,
              carPlateNo: datas.updateCarInfoAndOrgDubboDTO.carPlateNo, // 车牌号,
              carBrandId: datas.updateCarInfoAndOrgDubboDTO.carBrandId, // 品牌ID,
              carBrandName: datas.updateCarInfoAndOrgDubboDTO.carBrandName, // 品牌名称,
              carSeriesId: datas.updateCarInfoAndOrgDubboDTO.carSeriesId, // 车系ID,
              carSeriesName: datas.updateCarInfoAndOrgDubboDTO.carSeriesName, // 车系名称,
              carModelId: datas.updateCarInfoAndOrgDubboDTO.carModelId, // 车型ID,
              carModelName: datas.updateCarInfoAndOrgDubboDTO.carModelName, // 车型名称,
              carPowerTypeId: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeId, // 车辆动力类型ID,
              carPowerTypeCode: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeCode, // 车辆动力类型编码,
              carPowerTypeName: datas.updateCarInfoAndOrgDubboDTO.carPowerTypeName, // 车辆动力类型名称,
              carUsageId: datas.updateCarInfoAndOrgDubboDTO.carUsageId, // 车辆用途ID,
              carUsageCode: datas.updateCarInfoAndOrgDubboDTO.carUsageCode, // 车辆用途编码,
              carUsageName: datas.updateCarInfoAndOrgDubboDTO.carUsageName, // 车辆用途名称,
              insBranchId: datas.updateCarInfoAndOrgDubboDTO.insBranchId, // 保险分公司ID,
              insBranchName: datas.updateCarInfoAndOrgDubboDTO.insBranchName, // 保险分公司名称,
              insEndDate: datas.updateCarInfoAndOrgDubboDTO.insEndDate, // 保险到期日期,
              qaEndDate: datas.updateCarInfoAndOrgDubboDTO.qaEndDate, // 质保到期日期,
              qaEndMileage: datas.updateCarInfoAndOrgDubboDTO.qaEndMileage, // 质保到期里程
            },
          });
          // this.GetCarModelEditVo([
          //   '',
          //   datas.updateCarInfoAndOrgDubboDTO.carBrandId,
          //   datas.updateCarInfoAndOrgDubboDTO.carSeriesId,
          // ]); // 车型
          // this.GetCarModelEditVo(['', "85e7cd40-adc9-11e8-80fa-7cd30adaaf2c", "87a14ccf-adc9-11e8-80fa-7cd30adaaf2c"]); //车型
        } else {
          DelErrorMsg(res.msg);
        }
      });
    }, 300);
  };

  render() {
    const {
      carUpdateVisible, queryLoading, carUpdateInfo, carUpdateInfo: { cusCarInfoFastlyDto },
    } = this.props;
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const carUpdateColumns = [
      {
        title: '车牌号',
        key: 'carPlateNo',
        dataIndex: 'carPlateNo',
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
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        align: 'center',
        width: 150,
        render: (text, record) =>
          (cusCarInfoFastlyDto.length >= 1 ? (
            <span>
              <a href='javascript:;' onClick={() => this.carUpdateEdit(record)}>
                编辑
              </a>
            </span>
          ) : null),
      },
    ];

    return (
      <Style>
        {/* 车辆更新 */}
        <Modal visible={carUpdateVisible} onCancel={this.carUpdateCancel}
          width='820px' footer={[]}>
          <Spin spinning={queryLoading} indicator={antIcon} tip='加载中'>
            <div style={{ maxHeight: '540px', overflowY: 'auto', overflowX: 'hidden', paddingRight: '15px', }} >
              <Form>
                <Row span={24}>
                  <h3>车辆信息</h3>
                </Row>
                <hr />
                <Row>
                  <Col span={12}>
                    <FormItem {...formLayout} label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }} >
                      <span>{carUpdateInfo.cusName}</span>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formLayout} label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}>
                      <span>{carUpdateInfo.cusMobileNo}</span>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col span={3} offset={21}>
                  <Button type='primary' icon='plus' ghost
                    onClick={this.carUpdateAdd} style={{ marginBottom: '10px' }} >
                    新增
                  </Button>
                </Col>
              </Row>
              <Table bordered dataSource={cusCarInfoFastlyDto} columns={carUpdateColumns} size='small' />
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
    carUpdateVisible, queryLoading, carUpdateInfo, threeLevelValue,
    addVisible, cusUpdateFlag, customerInfoDto, linkCustomerInfoDto,
    carInfoDto,CarModelVoList,
  } = state.modalInfo

  return {
    carUpdateVisible, queryLoading, carUpdateInfo, threeLevelValue,
    addVisible, cusUpdateFlag, cusAndCarInfo, customerInfoDto, linkCustomerInfoDto,
    carInfoDto,CarModelVoList,
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
    MODAL_SET_STATE, MODAL_RESET_STATE,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, MODAL_SET_STATE, MODAL_RESET_STATE,
    TABLE_SET_STATE, TABLE_RESET_STATE, tableReset,
  }
}

const CarUpdates = Form.create()(CarUpdate);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CarUpdates)