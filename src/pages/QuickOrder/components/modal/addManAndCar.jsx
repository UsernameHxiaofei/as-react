// 基础模块
import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux'
import { env } from '@/config/env/'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');
import SoCarModelsSelect from '@/components/SoCarSelect';
import * as _ from 'lodash';

// 方法
import { Trim, } from '@/config/methods.js';
import { getOptionRender, } from '../../common/methods';

// UI组件
import {
  Form, InputNumber, message,
  Select, Spin, Cascader, Modal,
  Icon, Button, Row, Col,
  Input, Checkbox, LocaleProvider, DatePicker,

} from 'antd'
const FormItem = Form.Item;

// API
import {
  getCarInfoBykeywords,
  getPersonalCustomerByMobileNo,
  getCarModelVo,
  queryUnifiedSocialCreditCode,
  saveCustomerCar,
  updateCustomerCar,
} from '@/services/getData'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
import { formSpanLayout, DelErrorMsg } from '../../common/components'
const Style = styled.div`

`;



class AddManAndCar extends Component {

  componentDidMount = () => {
    this.props.getGlobalMdmRegion('', 'cusProvince'); // 获取省
  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }


  /* 车主信息修改 */
  cusAddChange = (type, event) => {
    this.props.MODAL_SET_STATE({
      customerInfoDto: {
        ...this.props.customerInfoDto,
        [type]: Trim(event.target.value, 'g'),
      },
    });
  };

  // 联系人信息修改
  manAddChange = (type, event) => {
    this.props.MODAL_SET_STATE({
      linkCustomerInfoDto: {
        ...this.props.linkCustomerInfoDto,
        [type]: Trim(event.target.value, 'g'),
      },
    });
  };

  // 车辆信息修改
  carAddChange = (type, event) => {
    if (type == 'qaEndMileage') {
      this.props.MODAL_SET_STATE({ carInfoDto: { ...this.props.carInfoDto, qaEndMileage: event } });
    } else {
      this.props.MODAL_SET_STATE({
        carInfoDto: { ...this.props.carInfoDto, [type]: Trim(event.target.value, 'g') },
      });
    }
  };

  // 更新车主信息
  cusUpChange = (type, event) => {
    this.props.MODAL_SET_STATE({
      cusUpdateInfo: { ...this.props.cusUpdateInfo, [type]: Trim(event.target.value, 'g') },
    });
  };

  // 车牌、vin码校验
  keyWordCheck = (type, event) => {
    const { carInfoDto } = this.props;
    if (event.target.value) {
      const keyWord =
        type == 'carPlateNo' ? carInfoDto.carPlateTypeName + event.target.value : event.target.value;
      this.props.MODAL_SET_STATE({ queryLoading: true })
      getCarInfoBykeywords({ keywords: keyWord }).then((res) => {
        if (res.success) { } else { DelErrorMsg(res.msg); }
        this.props.MODAL_SET_STATE({ queryLoading: false })
      });
    }
  };
  // 同步车主
  onManCheckChange = (event) => {
    const { addCarSave, customerInfoDto, linkCustomerInfoDto, cusCity, cusRegion } = this.props;
    const flag = !event.target.value;
    this.props.MODAL_SET_STATE({
      addCarSave: {
        ...addCarSave,
        synchronousOwners: flag,
      },
    });
    if (flag == 1) {
      this.props.form.resetFields(['cusName', 'cuMobileNo']);
      this.props.MODAL_SET_STATE({
        linkCustomerInfoDto: {
          ...linkCustomerInfoDto,
          cusName: customerInfoDto.cusName, // 客户姓名,
          cusGenderId: customerInfoDto.cusGenderId, // 客户性别ID,
          cusGenderName: customerInfoDto.cusGenderName, // 客户性别名称,
          cusMobileNo: customerInfoDto.cusMobileNo, // 联系电话,
          cusProvinceId: customerInfoDto.cusProvinceId, // 客户所在省份ID,
          cusProvinceName: customerInfoDto.cusProvinceName, // 客户所在省份名称,
          cusCityId: customerInfoDto.cusCityId, // 客户所在城市ID,
          cusCityName: customerInfoDto.cusCityName, // 客户所在城市名称,
          cusRegionId: customerInfoDto.cusRegionId, // 客户所在区ID,
          cusRegionName: customerInfoDto.cusRegionName, // 客户所在区名称,
          cusStreetAddress: customerInfoDto.cusStreetAddress, // 客户所在街道地址
        },
        cusManCity: cusCity,//联系人城市与车主城市一致
        cusManRegion: cusRegion,//联系人区县与车主区县一致

      });
    }
  };

  CreditCodeBlur = (e) => {
    let { customerInfoDto, cusTypeNama } = this.props;
    if (cusTypeNama == 1 && customerInfoDto.cusName) {
      this.props.MODAL_SET_STATE({ queryLoading: true })
      queryUnifiedSocialCreditCode({ supplierName: customerInfoDto.cusName }).then(res => {
        if (res.success && res.data) {
          this.props.MODAL_SET_STATE({ queryLoading: false, customerInfoDto: { ...customerInfoDto, cusCertificateNo: res.data } })
        } else {
          this.props.MODAL_SET_STATE({ queryLoading: false, customerInfoDto: { ...customerInfoDto, cusCertificateNo: '' }, })
          DelErrorMsg(res.msg)
        }
      })
    }
  }

  Blur = (event) => {
    let value = event.target.value
    this.props.form.validateFields(['cuMobileNo'], (err) => {
      if (!err) {
        // 发送请求带出联系人数据
        getPersonalCustomerByMobileNo({ mobileNo: value }).then(res => {
          // console.log(res.data)
          if (res.data) {
            let linkCustomerInfoDto = this.props.linkCustomerInfoDto
            this.props.MODAL_SET_STATE({
              linkCustomerInfoDto: {
                ...linkCustomerInfoDto,
                cusName: res.data.cusName, // 客户姓名,
                cusGenderId: res.data.cusGenderId, // 客户性别ID,
                cusGenderName: res.data.cusGenderName, // 客户性别名称,
                cusMobileNo: res.data.cusMobileNo, // 联系电话,
                cusProvinceId: res.data.cusProvinceId, // 客户所在省份ID,
                cusProvinceName: res.data.cusProvinceName, // 客户所在省份名称,
                cusCityId: res.data.cusCityId, // 客户所在城市ID,
                cusCityName: res.data.cusCityName, // 客户所在城市名称,
                cusRegionId: res.data.cusRegionId, // 客户所在区ID,
                cusRegionName: res.data.cusRegionName, // 客户所在区名称,
                cusStreetAddress: res.data.cusStreetAddress, // 客户所在街道地址
              }
            })
          }
        })
      }
    },
    );
  }

  /* 单个日期修改 */
  singleDateChange = (type, date, dateString) => {
    const { carInfoDto, } = this.props;
    if (type == 'insEndDate') {
      if (dateString) {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...carInfoDto, insEndDate: dateString },
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...carInfoDto, insEndDate: '' },
        });
      }
    }
    if (type == 'qaEndDate') {
      if (dateString) {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...carInfoDto, qaEndDate: dateString },
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...carInfoDto, qaEndDate: '' },
        });
      }
    }
  };

  /* 修改下拉框 */
  statesChange = (type, code, e) => {
    // console.log('下拉框修改', type, code, e)
    const { customerInfoDto, linkCustomerInfoDto, carInfoDto } = this.props;
    if (type == 'prefix') { // 车牌号
      if (code) {
        this.props.MODAL_SET_STATE({
          carInfoDto: {
            ...this.props.carInfoDto,
            carPlateTypeId: e.key, carPlateTypeCode: code, carPlateTypeName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...this.props.carInfoDto, carPlateTypeId: '', carPlateTypeCode: '', carPlateTypeName: '', },
        });
      }
    }
    if (type == 'cusGenderName') { // 性别
      if (code) {
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto,
            cusGenderId: e.key, cusGenderName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          customerInfoDto: { ...this.props.customerInfoDto, cusGenderId: '', cusGenderName: '', },
        });
      }
    }
    if (type == 'cusTypeName') { // 客户类型
      if (code) {
        if (code == 30050005) { // 企业
          new Promise((resolve, rejcet) => {
            this.props.modalReset({
              cusTypeNama: 1,
              resolve, rejcet
            })
          }).then(_ => {
            if (customerInfoDto.cusName != '') { this.CreditCodeBlur() }
          })
        } else if (code == 30050000) { // 个人
          this.props.MODAL_SET_STATE({ cusTypeNama: 0 });
        }
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto,
            cusTypeId: e.key, cusTypeCode: code, cusTypeName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          customerInfoDto: { ...this.props.customerInfoDto, cusTypeCode: '', carPlateTypeCode: '', cusTypeName: '', },
        });
      }
    }
    if (type == 'cusProvinceName') { //车主省份
      if (code) {
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto,
            cusProvinceId: e.key, cusProvinceName: e.props.children,
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusCity');
      } else {
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto, cusProvinceId: '', cusProvinceName: '',
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          },
        });
      }
    }
    if (type == 'cusCityName') { //  车主城市
      if (code) {
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto,
            cusCityId: e.key, cusCityName: e.props.children, cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusRegion');
      } else {
        this.props.MODAL_SET_STATE({
          customerInfoDto: { ...this.props.customerInfoDto, cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '', },
        });
      }
    }
    if (type == 'cusRegionName') { // 车主区县
      if (code) {
        this.props.MODAL_SET_STATE({
          customerInfoDto: {
            ...this.props.customerInfoDto,
            cusRegionId: e.key, cusRegionName: e.props.children,
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          customerInfoDto: { ...this.props.customerInfoDto, cusRegionId: '', cusRegionName: '', },
        });
      }
    }
    if (type == 'manProvinceName') { //联系人省份
      if (code) {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: {
            ...this.props.linkCustomerInfoDto,
            cusProvinceId: e.key, cusProvinceName: e.props.children,
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusManCity');
      } else {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: {
            ...this.props.linkCustomerInfoDto, cusProvinceId: '', cusProvinceName: '',
            cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '',
          },
        });
      }
    }
    if (type == 'manCityName') { //  联系人城市
      if (code) {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: {
            ...this.props.linkCustomerInfoDto,
            cusCityId: e.key, cusCityName: e.props.children, cusRegionId: '', cusRegionName: '',
          }
        });
        this.props.getGlobalMdmRegion(code, 'cusManRegion');
      } else {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: { ...this.props.linkCustomerInfoDto, cusCityId: '', cusCityName: '', cusRegionId: '', cusRegionName: '', },
        });
      }
    }
    if (type == 'manRegionName') { // 联系人区县
      if (code) {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: {
            ...this.props.linkCustomerInfoDto,
            cusRegionId: e.key, cusRegionName: e.props.children,
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          linkCustomerInfoDto: { ...this.props.linkCustomerInfoDto, cusRegionId: '', cusRegionName: '', },
        });
      }
    }
    if (type == 'carPowerTypeName') { // 动力类型
      if (code) {
        this.props.MODAL_SET_STATE({
          carInfoDto: {
            ...this.props.carInfoDto,
            carPowerTypeId: e.key, carPowerTypeCode: code, carPowerTypeName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...this.props.carInfoDto, carPowerTypeId: '', carPowerTypeCode: '', carPowerTypeName: '', },
        });
      }
    }
    if (type == 'insBranchName') { // 保险公司
      if (code) {
        this.props.MODAL_SET_STATE({
          carInfoDto: {
            ...this.props.carInfoDto,
            insBranchId: e.key, insBranchName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...this.props.carInfoDto, insBranchId: '', insBranchName: '', },
        });
      }
    }
    if (type == 'carUsageName') { // 用途
      if (code) {
        this.props.MODAL_SET_STATE({
          carInfoDto: {
            ...this.props.carInfoDto,
            carUsageId: e.key, carUsageCode: code, carUsageName: e.props.children
          }
        });
      } else {
        this.props.MODAL_SET_STATE({
          carInfoDto: { ...this.props.carInfoDto, carUsageId: '', carUsageCode: '', carUsageName: '', },
        });
      }
    }
  };

  loadData = (selectedOptions) => {
    const targetOption = _.cloneDeep(selectedOptions[selectedOptions.length - 1]);
    if (targetOption) {
      if (selectedOptions.length < 3) {
        this.GetCarModelVoChildren({ id: targetOption.id }, targetOption, selectedOptions.length);
      }
    }
  };
  // 获取车型,车系
  GetCarModelVoChildren = (obj, targetOption, isLeaf) => {
    const _th = this;
    let optionNum;
    const CarModelVoList = _.cloneDeep(this.props.CarModelVoList);
    targetOption.loading = true;
    getCarModelVo(obj).then((res) => {
      targetOption.loading = false;
      if (res.success) {
        if (res.data) {
          const list = res.data;
          list.map((item) => {
            item.key = item.id;
            item.value = item.id;
            item.label = item.name;
            if (isLeaf < 2) {
              item.isLeaf = false;
            }
          });
          targetOption.children = list;
          if (isLeaf == 1) { //选了品牌后添加车系
            this.props.TABLE_SET_STATE({ firstCarId: targetOption.id }) //第一层的id
            optionNum = CarModelVoList.findIndex(item => item.id == targetOption.id)
            CarModelVoList.splice(optionNum, 1, targetOption)
          } else if (isLeaf == 2) { //选了车系添加车型
            const CarModelChild = CarModelVoList.find(item => item.id == this.props.firstCarId)
            optionNum = CarModelVoList.findIndex(item => item.id == CarModelChild.id)
            const childNum = CarModelChild.children.findIndex(item => item.id == targetOption.id)
            CarModelChild.children.splice(childNum, 1, targetOption)
            CarModelVoList.splice(optionNum, 1, CarModelChild)
          }
          _th.props.MODAL_SET_STATE({ CarModelVoList });
        }
      }
    });
  };
  // 页面第一次下拉时请求车型的一级数据
  threeDefault = () => {
    if (!this.props.threeflag) {
      this.GetCarModelVo({ id: '' });
      this.props.MODAL_SET_STATE({ threeflag: 1 });
    }
  };
  // 车型选择
  onCarModelChange = (...args) => {
    const brand = args[1].valueListTree[0];
    const series = brand.children[0];
    const category = series.children[0];
    const modal = category.children[0];
    // console.log(89, args, brand, series, category, modal)
    const carInfoDto = this.props.carInfoDto;
    if (args[0].length <= 0) {
      this.props.MODAL_SET_STATE({
        carInfoDto: {
          ...carInfoDto,
          carBrandId: '',
          carBrandName: '',
          carSeriesId: '',
          carSeriesName: '',
          carCategoryId: '', //车款id
          carCategoryName: '', //车款名称
          carModelId: '',
          carModelName: '',
        },
      });
    } else {
      this.props.MODAL_SET_STATE({
        carInfoDto: {
          ...carInfoDto,
          carBrandId: brand.value,
          carBrandName: brand.label,
          carCategoryId: category.value,
          carCategoryName: category.label,
          carSeriesId: series.value,
          carSeriesName: series.label,
          carModelId: modal.value,
          carModelName: modal.label,
        },
      });
    }
  };

  // 获取品牌
  GetCarModelVo = (obj) => {
    this.props.MODAL_SET_STATE({ CarModelVoList: [], queryLoading: true, threeLevelValue: [] });
    getCarModelVo(obj).then((res) => {
      if (res.success) {
        if (res.data) {
          const list = res.data;
          list.map((item) => {
            item.key = item.id;
            item.value = item.id;
            item.label = item.name;
            item.isLeaf = false;
          });
          this.props.MODAL_SET_STATE({ CarModelVoList: list, queryLoading: false });
        }
      }
    });
  };

  // 获取默认品牌
  GetCarModelEditVo = (ids) => {
    const _th = this;
    let threeLevel;
    this.props.MODAL_SET_STATE({ queryLoading: true });
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
    }).then((res) => { // 一级
      threeLevel = res;
      new Promise((resolve, reject) => {
        getCarModelVoes(ids[1], resolve);
      }).then((res) => { // 二级
        const options = threeLevel.find(item => item.value == ids[1]);
        options.children = res;
        new Promise((resolve, reject) => {
          getCarModelVoes(ids[2], resolve);
        }).then((res) => {  // 三级
          const options = threeLevel
            .find(item => item.value == ids[1])
            .children.find(item => item.value == ids[2]);
          options.children = res;
          _th.MODAL_SET_STATE({ CarModelVoList: threeLevel, queryLoading: false });
        });
      });
    }).catch((err) => {
      message.error(err);
    });
  };

  /* 取消新增 */
  addCancel = () => {
    const { customerInfoDto, linkCustomerInfoDto, carInfoDto } = this.props;
    this.props.form.resetFields();
    this.props.MODAL_SET_STATE({
      addVisible: false,
      customerInfoDto: {
        ...customerInfoDto,
        cusTypeId: '', // 客户类型ID,
        cusTypeName: '', // 客户类型名称,
        cusName: '', // 客户姓名,
        cusGenderId: '', // 客户性别ID,
        cusGenderName: '', // 客户性别名称,
        cusMobileNo: '', // 联系电话,
        cusProvinceId: '', // 客户所在省份ID,
        cusProvinceName: '', // 客户所在省份名称,
        cusCityId: '', // 客户所在城市ID,
        cusCityName: '', // 客户所在城市名称,
        cusRegionId: '', // 客户所在区ID,
        cusRegionName: '', // 客户所在区名称,
        cusStreetAddress: '', // 客户所在街道地址,
        cusCertificateNo: '', // 组织架构代码
      },
      linkCustomerInfoDto: {
        ...linkCustomerInfoDto,
        cusName: '', // 客户姓名,
        cusGenderId: '', // 客户性别ID,
        cusGenderName: '', // 客户性别名称,
        cusMobileNo: '', // 联系电话,
        cusProvinceId: '', // 客户所在省份ID,
        cusProvinceName: '', // 客户所在省份名称,
        cusCityId: '', // 客户所在城市ID,
        cusCityName: '', // 客户所在城市名称,
        cusRegionId: '', // 客户所在区ID,
        cusRegionName: '', // 客户所在区名称,
        cusStreetAddress: '', // 客户所在街道地址
      },
      carInfoDto: {
        ...carInfoDto,
        vin: '', // 车架号,
        carId: '', // 车辆id,
        carPlateTypeId: '', // 车牌号类型ID,
        carPlateTypeCode: '', // 车牌号类型编码,
        carPlateTypeName: '', // 车牌号类型名称,
        carPlateNo: '', // 车牌号,
        carBrandId: '', // 品牌ID,
        carBrandName: '', // 品牌名称,
        carSeriesId: '', // 车系ID,
        carSeriesName: '', // 车系名称,
        carModelId: '', // 车型ID,
        carModelName: '', // 车型名称,
        carPowerTypeId: '', // 车辆动力类型ID,
        carPowerTypeCode: '', // 车辆动力类型编码,
        carPowerTypeName: '', // 车辆动力类型名称,
        carUsageId: '', // 车辆用途ID,
        carUsageCode: '', // 车辆用途编码,
        carUsageName: '', // 车辆用途名称,
        insBranchId: '', // 保险分公司ID,
        insBranchName: '', // 保险分公司名称,
        insEndDate: '', // 保险到期日期,
        qaEndDate: '', // 质保到期日期,
        qaEndMileage: '', // 质保到期里程
      },
    });
  };

  /* 提交新增人车关系 */
  addSubmitOk = (event) => {
    event.preventDefault();
    const { cusUpdateFlag } = this.props;
    let formValidatorNames = [];
    if (cusUpdateFlag == 'save' && this.props.cusTypeNama == 0) { //客户类型个人 不用校验组织架构代码
      formValidatorNames = [
        'cusNam',
        'cusTypeName',
        'cusMobileNo',
        'cusGenderName',
        'cusStreetAddresss',
        'cusName',
        'cuMobileNo',
        'cusStreetAddress',
        'carPlateNo',
        'carPowerTypeName',
        'insBranchName',
        'insEndDate',
        'vin',
        'carUsageName',
        'qaEndMileage',
        'qaEndDate',
        'carModelName',
      ];
    } else if (cusUpdateFlag == 'edit') {
      formValidatorNames = ['carPlateNo', 'vin', 'carModelName'];
    }
    this.props.form.validateFieldsAndScroll(formValidatorNames, (err, values) => {
      if (!err) {
        const {
          addCarSave, customerInfoDto, linkCustomerInfoDto, carInfoDto, cusAndCarInfo,
        } = this.props;
        this.props.MODAL_SET_STATE({
          addCarSave: {
            ...addCarSave,
            customerInfoDto,
            linkCustomerInfoDto,
            carInfoDto,
          },
          saveLoading: true,
        })
        this.setState({}, () => {
          if (cusUpdateFlag == 'save') {
            saveCustomerCar(this.props.addCarSave).then((res) => {
              if (res.success && res.code == 200) {
                message.success('保存成功');
                this.props.MODAL_SET_STATE({
                  addVisible: false,
                });
                this.addCancel();
              } else {
                DelErrorMsg(res.msg);
              }
              this.props.MODAL_SET_STATE({ saveLoading: false, });
            });
          } else if (cusUpdateFlag == 'edit') {
            let { carInfoDto } = this.props;
            updateCustomerCar(carInfoDto).then((res) => {
              if (res.success && res.code == 200) {
                message.success('保存成功');
                this.props.TABLE_SET_STATE({
                  // saveLoading: false,
                  addVisible: false,
                  cusAndCarInfo: {
                    ...cusAndCarInfo,
                    vin: carInfoDto.vin, // 车架号,
                    carPlateNo: carInfoDto.carPlateTypeName + carInfoDto.carPlateNo, // 车牌号
                    carPowerTypeId: carInfoDto.carPowerTypeId, // 车辆动力类型ID,
                    carPowerTypeCode: carInfoDto.carPowerTypeCode, // 车辆动力类型编码,
                    carPowerTypeName: carInfoDto.carPowerTypeName, // 车辆动力类型名称,
                    carModelId: carInfoDto.carModelId, // 车型id
                    carModelName: carInfoDto.carBrandName + ' ' + carInfoDto.carSeriesName + ' ' + carInfoDto.carModelName, // 车型名称
                  }
                });
                this.addCancel();
              } else {
                DelErrorMsg(res.msg);
              }
              this.props.MODAL_SET_STATE({ saveLoading: false, });
            });
          }
        },
        );
      }
    });
  };

  render() {
    const {
      addVisible, saveLoading, queryLoading, customerInfoDto, cusTypeNama,
      linkCustomerInfoDto, threeLevelValue, CarModelVoList, cusUpdateFlag,
      cusType, carInfoDto, carPre, cusProvince, cusRegion, cusManCity, cusManRegion,
      cusCity, cusGender, addCarSave, carPowerType, carUsage,
    } = this.props
    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />;
    const w100p = { width: '100%' };
    // 表单
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: carInfoDto.carPlateTypeName,
    })(<Select style={{ width: 70 }} onChange={this.statesChange.bind(event, 'prefix')}>
      {getOptionRender(carPre, { key: 'key', code: 'dicCode', name: 'dicValue' })}
    </Select>);
    return (
      <Style>
        <Modal
          visible={addVisible}
          onCancel={this.addCancel}
          width='850px'
          footer={[
            <Button type='primary' key='save' loading={saveLoading} onClick={this.addSubmitOk}
            > 保存 </Button>,
            <Button key='back' onClick={this.addCancel} style={{ marginLeft: '10px' }}>
              返回
            </Button>,
          ]} >
          <Spin spinning={queryLoading} indicator={antIcon} tip='加载中'>
            <div style={{
              maxHeight: '540px',
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '15px',
            }}  >
              <Form>
                <Row span={24}>
                  <h3>车主车辆</h3>
                </Row>
                <hr />
                <Row span={24}>
                  <h3>车主信息</h3>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='客户姓名'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusNam', {
                        initialValue: customerInfoDto.cusName,
                        rules: [
                          {
                            required: true,
                            message: '客户姓名不能为空！',
                          },
                        ],
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusName')}
                        disabled={cusUpdateFlag == 'edit'}
                        onBlur={this.CreditCodeBlur}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='客户类型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusTypeName', {
                        initialValue: customerInfoDto.cusTypeName,
                        rules: [
                          {
                            required: true,
                            message: '客户类型不能为空！',
                          },
                        ],
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'cusTypeName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={customerInfoDto.cusProvinceName}
                        onChange={this.statesChange.bind(event, 'cusProvinceName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={customerInfoDto.cusRegionName}
                        onChange={this.statesChange.bind(event, 'cusRegionName')}
                        disabled={cusUpdateFlag == 'edit'}
                        onClick={this.ass}
                      >
                        {getOptionRender(cusRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusMobileNo', {
                        initialValue: customerInfoDto.cusMobileNo,
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
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusMobileNo')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='性别'
                      style={{
                        marginBottom: '10px',
                        paddingRight: '20px',
                        display: cusTypeNama == 0 ? 'block' : 'none',
                      }}
                    >
                      {getFieldDecorator('cusGenderName', {
                        initialValue: customerInfoDto.cusGenderName,
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'cusGenderName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusGender, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='组织架构代码'
                      style={{
                        marginBottom: '10px',
                        paddingRight: '20px',
                        display: cusTypeNama == 1 ? 'block' : 'none',
                      }}
                    >
                      {getFieldDecorator('cusCertificateNo', {
                        initialValue: customerInfoDto.cusCertificateNo,
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusCertificateNo')}
                        disabled
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={customerInfoDto.cusCityName}
                        onChange={this.statesChange.bind(event, 'cusCityName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='街道门牌'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusStreetAddresss', {
                        initialValue: customerInfoDto.cusStreetAddress,
                      })(<Input
                        onChange={this.cusAddChange.bind(event, 'cusStreetAddress')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row span={24}>
                  <Col span={3}>
                    <h3>联系人信息</h3>
                  </Col>
                  {/* <Col span={3}>
                    <Checkbox value={addCarSave.synchronousOwners} onChange={this.onManCheckChange}
                      checked={addCarSave.synchronousOwners}>
                      同步车主
                    </Checkbox>
                  </Col> */}
                </Row>
                <hr />
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系人'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusName', {
                        initialValue: linkCustomerInfoDto.cusName,
                        rules: [
                          {
                            required: true,
                            message: '联系人不能为空！',
                          },
                        ],
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusName')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='省份'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={linkCustomerInfoDto.cusProvinceName}
                        onChange={this.statesChange.bind(event, 'manProvinceName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusProvince, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='区县'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={linkCustomerInfoDto.cusRegionName}
                        onChange={this.statesChange.bind(event, 'manRegionName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusManRegion, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='联系电话'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cuMobileNo', {
                        initialValue: linkCustomerInfoDto.cusMobileNo,
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
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusMobileNo')}
                        disabled={cusUpdateFlag == 'edit'}
                        onBlur={this.Blur.bind(event)}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='城市'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      <Select
                        allowClear
                        style={w100p}
                        value={linkCustomerInfoDto.cusCityName}
                        onChange={this.statesChange.bind(event, 'manCityName')}
                        disabled={cusUpdateFlag == 'edit'}
                      >
                        {getOptionRender(cusManCity, { key: 'key', code: 'code', name: 'name' })}
                      </Select>
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='地址'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('cusStreetAddress', {
                        initialValue: linkCustomerInfoDto.cusStreetAddress,
                      })(<Input
                        onChange={this.manAddChange.bind(event, 'cusStreetAddress')}
                        disabled={cusUpdateFlag == 'edit'}
                      />)}
                    </FormItem>
                  </Col>
                </Row>
                <hr />
                <Row span={24}>
                  <h3>车辆信息</h3>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='车牌号'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carPlateNo', {
                        initialValue: carInfoDto.carPlateNo,
                        rules: [
                          {
                            required: true,
                            message: '车牌号不能为空！',
                          },
                          {
                            pattern: /^(([A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
                            message: '请输入完整的车牌号',
                          },
                        ],
                      })(<Input
                        addonBefore={prefixSelector}
                        onChange={this.carAddChange.bind(event, 'carPlateNo')}
                        onBlur={this.keyWordCheck.bind(event, 'carPlateNo')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='动力类型'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carPowerTypeName', {
                        initialValue: carInfoDto.carPowerTypeName,
                        rules:[
                          {
                            required: true,
                            message: '动力类型不能为空！',
                          },
                        ]
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'carPowerTypeName')}
                      >
                        {getOptionRender(carPowerType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='保险公司'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('insBranchName', {
                        initialValue: carInfoDto.insBranchName,
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'insBranchName')}
                      >
                        {getOptionRender(carPowerType, { key: 'key', code: 'cusId', name: 'cusName' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='保险到期'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('insEndDate', {
                        initialValue: carInfoDto.insEndDate,
                      })(<LocaleProvider locale={zh_CN}>
                        <DatePicker
                          style={w100p}
                          onChange={this.singleDateChange.bind(event, 'insEndDate')}
                          format='YYYY-MM-DD'
                        />
                      </LocaleProvider>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formLayout}
                      label='VIN'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('vin', {
                        initialValue: carInfoDto.vin,
                        rules: [
                          {
                            required: true,
                            message: 'VIN不能为空！',
                          },
                          {
                            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{17}$/,
                            message: '请输入17位由字母和数字组成的vin码',
                          },
                        ],
                      })(<Input
                        onChange={this.carAddChange.bind(event, 'vin')}
                        onBlur={this.keyWordCheck.bind(event, 'vin')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='用途'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('carUsageName', {
                        initialValue: carInfoDto.carUsageName,
                        rules:[
                          {
                            required: true,
                            message: '用途不能为空！',
                          },
                        ]
                      })(<Select
                        allowClear
                        style={w100p}
                        onChange={this.statesChange.bind(event, 'carUsageName')}
                      >
                        {getOptionRender(carUsage, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='质保结束里程'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('qaEndMileage', {
                        initialValue: carInfoDto.qaEndMileage || 0,
                      })(<InputNumber
                        style={w100p}
                        onChange={this.carAddChange.bind(event, 'qaEndMileage')}
                      />)}
                    </FormItem>
                    <FormItem
                      {...formLayout}
                      label='质保结束日期'
                      style={{ marginBottom: '10px', paddingRight: '20px' }}
                    >
                      {getFieldDecorator('qaEndDate', {
                        initialValue: carInfoDto.qaEndDate,
                      })(<LocaleProvider locale={zh_CN}>
                        <DatePicker
                          style={w100p}
                          onChange={this.singleDateChange.bind(event, 'qaEndDate')}
                          format='YYYY-MM-DD'
                        />
                      </LocaleProvider>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row span={24}>
                  <FormItem
                    {...formSpanLayout}
                    label='车型'
                    style={{ marginBottom: '10px', paddingRight: '20px' }}
                  >
                    {getFieldDecorator('carModelName', {
                      initialValue: threeLevelValue,
                      rules: [
                        {
                          required: true,
                          message: '车型不能为空！',
                        },
                      ],
                      // })(<Cascader
                      //   options={CarModelVoList}
                      //   onPopupVisibleChange={this.threeDefault}
                      //   onChange={this.onCarModelChange.bind(event)}
                      //   loadData={this.loadData}
                      //   placeholder='请选择'
                    })(<SoCarModelsSelect
                      style={{ width: 500, maxHeight: 200, overflow: "auto" }} //根据具体场景进行布局
                      allowClear
                      // multiple //是否多选
                      level={4} //支持4级以下
                      onChange={this.onCarModelChange}
                    />)}
                  </FormItem>
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
    cusType, carPowerType, carPre, cusGender, carUsage,
  } = state.baseData

  const {
    cusAndCarInfo, firstCarId,
  } = state.tableInfo
  const {
    addVisible, saveLoading, queryLoading, customerInfoDto, cusTypeNama,
    linkCustomerInfoDto, threeLevelValue, CarModelVoList, cusUpdateFlag,
    carInfoDto, cusRegion, cusManCity, cusManRegion, cusCity,
    addCarSave, threeflag, cusUpdateInfo, cusProvince,
  } = state.modalInfo

  return {
    addVisible, saveLoading, queryLoading, customerInfoDto, cusTypeNama,
    linkCustomerInfoDto, threeLevelValue, CarModelVoList, cusUpdateFlag,
    cusType, carInfoDto, carPre, cusRegion, cusManCity, cusManRegion, cusCity,
    cusGender, addCarSave, carPowerType, carUsage, threeflag, cusAndCarInfo,
    cusUpdateInfo, firstCarId, cusProvince,
  }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, RESET_STATE, } = dispatch.baseData
  const {
    TABLE_SET_STATE, TABLE_RESET_STATE, tableReset,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, getGlobalMdmRegion, GetCarModelEditVo,
    modalReset,
  } = dispatch.modalInfo
  return {
    SET_STATE, RESET_STATE, MODAL_SET_STATE, MODAL_RESET_STATE,
    getGlobalMdmRegion, GetCarModelEditVo, TABLE_SET_STATE,
    TABLE_RESET_STATE, tableReset, modalReset,
  }
}

const AddManAndCars = Form.create()(AddManAndCar);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddManAndCars)
