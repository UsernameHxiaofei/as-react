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
import { getOptionRender, } from '../../common/methods';
import { showTotal, } from '../../common/components';

// UI组件
import {
  Form, Select, Pagination, Modal, Table, Input, Checkbox, Button,
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

class AddGoods extends Component {
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    // this.props.RESET_STATE()
  }
  // 商品关闭清空字段
  GPhandleCancel = () => {
    this.props.MODAL_SET_STATE({
      comboNumber: 1,
      goodsVisible: false,
      goodsSettleWay: '',
      goodsSettleId: '',
      goodsSettleCode: '',
      goodsObj: { ...this.props.goodsObj, priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 },
    });
  };
  // 结算方式改变
  wayChange = (value, Option) => {
    // console.log(Option)
    if (value == undefined || Option == undefined) {
      this.props.MODAL_SET_STATE({
        goodsSettleWay: '',
        goodsSettleId: '',
        goodsSettleCode: '',
      });
    } else {
      this.props.MODAL_SET_STATE({
        goodsSettleWay: Option.props.children,
        goodsSettleId: Option.props.id,
        goodsSettleCode: value,
      });
    }
  };
  // 价格方案改变事件
  priceChange = (value) => {
    const _th = this;
    if (value == undefined) {
      this.props.MODAL_SET_STATE({
        goodsObj: { ...this.props.goodsObj, priceTypeCode: '' },
      });
    } else {
      new Promise((resolve, reject) => {
        this.props.modalReset({
          goodsObj: { ...this.props.goodsObj, priceTypeCode: value },
          resolve, reject
        })
      }).then(() => {
        // 发送请求
        _th.props.QueryFastProductForPage(this.props.goodsObj);
      })
    }
  };
  // 商品数量变化
  GPnumberChange = (e) => {
    const value = e.target.value;
    this.props.MODAL_SET_STATE({
      comboNumber: value,
    });
  };
  // 回车查询
  OemEnter = (e) => {
    const value = e.target.value;
    const _th = this;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        goodsObj: { ...this.props.goodsObj, goodsName: value, index: 1 },
        resolve, reject
      })
    }).then(() => {
      // 发送请求
      _th.props.QueryFastProductForPage(this.props.goodsObj);
    })
  };

  OemChange = (e) => {
    const value = e.target.value;
    this.props.MODAL_SET_STATE({
      goodsObj: { ...this.props.goodsObj, goodsName: value, },
    });
  };
  carType = (e) => {
    const _th = this;
    const flag = e.target.value == 0 ? 1 : 0;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        goodsObj: { ...this.props.goodsObj, matchSeries: flag, index: 1 },
        resolve, reject
      })
    }).then(() => {
      // 发送请求
      _th.props.QueryFastProductForPage(this.props.goodsObj);
    })
  };

  kucun = (e) => {
    const _th = this;
    const flag = e.target.value == 0 ? 1 : 0;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        goodsObj: { ...this.props.goodsObj, isZeroStock: flag, index: 1 },
        resolve, reject
      })
    }).then(() => {
      // 发送请求
      _th.props.QueryFastProductForPage(this.props.goodsObj);
    })
  };
  onCurrentPage = (current) => {
    const _th = this;
    new Promise((resolve, reject) => {
      this.props.modalReset({
        pagecurrent: current,
        goodsObj: { ...this.props.goodsObj, index: current },
        resolve, reject
      })
    }).then(() => {
      // 发送请求
      _th.props.QueryFastProductForPage(this.props.goodsObj);
    })
  };

  // 将商品添加到表格
  ToTabled = (record) => {
    // console.log('record',record)
    const _th = this;
    // 未施过工添加万能工项
    if (record.workNeeded == 1) {
      // 在判断一次如果表格中存在就不在添加万能工项
      const Boolen = this.props.workHoursDataSource.some(item => item.goodsNo == 99999999);
      // 添加万能工项
      if (!Boolen) {
        const tabledList = {
          key: record.goodsId,
          index: record.goodsId,
          workHoursNum: 1,
          id: '', // 主键ID,
          workNeeded: 1, //
          combo: 1,
          goodsId: '', // 商品ID,
          goodsNo: '', // 商品编码,
          goodsName: '', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.props.goodsSettleId, // 结算方式ID,
          settleTypeCode: this.props.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.props.goodsSettleWay, // 结算方式名称,
          price: '', // 单价,
          qty: + this.props.comboNumber, // 数量,
          amount: '', // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: '', // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          mfgGoodsNo: record.mfgGoodsNo,
          oemGoodsNo: record.oemGoodsNo,
          goodsUnit: '件',
          goodsIssueNeeded: record.goodsIssueNeeded,
          // workNeeded:item.workNeeded
        };
        const workTime = {
          key: Math.random() + 1000,
          goodsNo: '',
          index: Math.random() + 1000,
          workHoursNum: 1,
          id: "", // 主键ID,
          workNeeded: 1, // 1表示万能工时
          combo: 1,
          goodsId: _th.props.goodsArr[0].id, // 商品ID,
          goodsNo: _th.props.goodsArr[0].dicCode, // 商品编码,
          goodsName: '万能工项', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.props.goodsSettleId, // 结算方式ID,
          settleTypeCode: this.props.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.props.goodsSettleWay, // 结算方式名称,
          price: 0, // 单价,
          qty: 1, // 数量,
          amount: 0, // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: 0, // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
        };
        new Promise((resolve, reject) => {
          this.props.modalReset({
            tabledList: {
              ...tabledList,
              modification: record.modification,
              price: record.price,
              index: record.goodsId,
              goodsId: record.goodsId,
              goodsNo: record.goodsNo,
              goodsName: record.goodsName,
              key: record.goodsId,
              goodsIssueNeeded: record.goodsIssueNeeded,
            },
            resolve, reject
          }).then(() => {
            const tabledList = _.cloneDeep(this.props.tabledList);
            const goodsDataSource = _.cloneDeep(this.props.goodsDataSource);
            const workHoursDataSource = _.cloneDeep(this.props.workHoursDataSource);
            const length = goodsDataSource.length;
            const {
              defaultWorkTypeId,
              defaultWorkTypeNo,
              defaultWorkType,
            } = this.props.defaultTypeValue;
            // 商品
            if (length == 1) {
              // 添加第一条数据
              tabledList.bizTypeId = defaultWorkTypeId;
              tabledList.bizTypeCode = defaultWorkTypeNo;
              tabledList.bizTypeName = defaultWorkType;
              tabledList.settleTypeId = this.props.goodsSettleId;
              tabledList.settleTypeCode = this.props.goodsSettleCode;
              tabledList.settleTypeName = this.props.goodsSettleWay;
              tabledList.discountRate = 1.0
              tabledList.amount = tabledList.qty * record.price || 0;
              tabledList.receivableAmount = tabledList.qty * record.price || 0
              goodsDataSource.splice(length - 1, 0, tabledList);
              goodsDataSource.map((item, index) => {
                item.workHoursNum = index + 1;
              });
              new Promise((resolve, reject) => {
                this.props.tableReset({
                  goodsDataSource,
                  resolve, reject
                })
                this.props.modalReset({
                  goodsVisible: false,
                  comboNumber: 1,
                  resolve, reject
                })
              }).then(() => {
                _.cloneDeep(this.props.goodsDataSource).map((item, index) => {
                  if (item.goodsName == '万能工项') {
                    item.key = Math.random() + 10000000;
                    item.index = Math.random() * 2 + index;
                  } else {
                    item.key = index + Math.random() * 2 + Math.random() * 3;
                  }
                });
                _th.props.calculateTotal('goodsDataSource');
              })
            } else {
              tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
              tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
              tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
              tabledList.settleTypeId = this.props.goodsSettleId;
              tabledList.settleTypeCode = this.props.goodsSettleCode;
              tabledList.settleTypeName = this.props.goodsSettleWay;
              tabledList.discountRate = 1.0
              tabledList.amount = tabledList.qty * record.price || 0;
              tabledList.receivableAmount = tabledList.qty * record.price || 0
              goodsDataSource.splice(length - 1, 0, tabledList);
              goodsDataSource.map((item, index) => {
                item.workHoursNum = index + 1;
                item.amount = item.qty * item.price || 0;
              });
              new Promise((resolve, reject) => {
                this.props.tableReset({
                  goodsDataSource,
                  resolve, reject
                })
                this.props.modalReset({
                  goodsVisible: false,
                  comboNumber: 1,
                  resolve, reject
                })
              }).then(() => {
                _.cloneDeep(this.props.goodsDataSource).map((item, index) => {
                  item.key = index + Math.random() * 2 + Math.random() * 3;
                });
                _th.props.calculateTotal('goodsDataSource');
              })
            }
            workTime.bizTypeId = defaultWorkTypeId;
            workTime.bizTypeCode = defaultWorkTypeNo;
            workTime.bizTypeName = defaultWorkType;
            workTime.settleTypeId = this.props.goodsSettleId;
            workTime.settleTypeCode = this.props.goodsSettleCode;
            workTime.settleTypeName = this.props.goodsSettleWay;
            workTime.discountRate = 1.0
            workTime.amount = 0;
            workTime.receivableAmount = 0;
            workHoursDataSource.unshift(workTime);
            workHoursDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
            });
            new Promise((resolve, reject) => {
              this.props.tableReset({
                workHoursDataSource,
                resolve, reject
              })
              this.props.modalReset({
                goodsVisible: false,
                comboNumber: 1,
                resolve, reject
              })
            }).then(() => {
              _.cloneDeep(this.props.workHoursDataSource).map((item, index) => {
                item.key = index + Math.random() * 2 + Math.random() * 3;
              });
              _th.props.calculateTotal('goodsDataSource');
              // 清空字段(bug)
              const goodsObj = this.props.goodsObj;
              this.props.MODAL_SET_STATE({
                goodsSettleWay: '',
                goodsSettleId: '',
                goodsSettleCode: '',
                goodsObj: { ...goodsObj, priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 },
              });
            })
          })
        })
      } else {
        //  不用添加万能工项
        const tabledList = {
          key: record.goodsId,
          goodsNo: '',
          index: record.goodsId,
          workHoursNum: 1,
          id: '', // 主键ID,
          workNeeded: 0,
          combo: 1,
          goodsId: '', // 商品ID,
          goodsNo: '', // 商品编码,
          goodsName: '', // 商品名称,
          goodsTypeId: '', // 商品类型ID,
          goodsTypeCode: '', // 商品类型编码,
          goodsTypeName: '', // 商品类型名称（材料 or 施工）,
          bizTypeId: '', // 业务类型ID,
          bizTypeCode: '', // 业务类型编码,
          bizTypeName: '', // 业务类型名称,
          settleTypeId: this.props.goodsSettleId, // 结算方式ID,
          settleTypeCode: this.props.goodsSettleCode, // 结算方式编码,
          settleTypeName: this.props.goodsSettleWay, // 结算方式名称,
          price: '', // 单价,
          qty: this.props.comboNumber, // 数量,
          amount: '', // 金额,
          discountRate: 1, // 折扣率,
          receivableAmount: '', // 应收金额,
          technicianEmpId: '', // 技师员工ID (施工),
          technicianEmpName: '', // 技师员工姓名 (施工),
          issuedQty: 0, // 已发料数量 (材料)
          mfgGoodsNo: record.mfgGoodsNo,
          oemGoodsNo: record.oemGoodsNo,
          goodsUnit: '件',
          goodsIssueNeeded: record.goodsIssueNeeded,

        };
        new Promise((resolve, reject) => {
          this.props.modalReset({
            tabledList: {
              ...tabledList,
              modification: record.modification,
              price: record.price,
              index: record.goodsId,
              goodsId: record.goodsId,
              goodsNo: record.goodsNo,
              goodsName: record.goodsName,
              key: record.goodsId,
              mfgGoodsNo: record.mfgGoodsNo,
              oemGoodsNo: record.oemGoodsNo,
              goodsIssueNeeded: record.goodsIssueNeeded,
              goodsUnit: '件'
            },
            resolve, reject
          })
        }).then(() => {
          const tabledList = _.cloneDeep(this.props.tabledList);
          const goodsDataSource = _.cloneDeep(this.props.goodsDataSource);
          const length = goodsDataSource.length;
          if (length == 1) {
            // 添加第一条数据
            // tabledList.bizTypeId = defaultWorkTypeId;
            // tabledList.bizTypeCode = defaultWorkTypeNo;
            // tabledList.bizTypeName = defaultWorkType;
            // tabledList.settleTypeId = this.props.goodsSettleId;
            // tabledList.settleTypeCode = this.props.goodsSettleCode;
            // tabledList.settleTypeName = this.props.goodsSettleWay;
            // tabledList.discountRate = 1.0
            // tabledList.amount = tabledList.qty * record.price || 0;
            // tabledList.receivableAmount = tabledList.qty * record.price || 0
            // goodsDataSource.splice(length - 1, 0, tabledList);
            // goodsDataSource.map((item, index) => {
            //   item.workHoursNum = index + 1;
            //   item.key = index + Math.random() * 2 + Math.random() * 3;
            // });
          } else {
            tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
            tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
            tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
            tabledList.settleTypeId = this.props.goodsSettleId;
            tabledList.settleTypeCode = this.props.goodsSettleCode;
            tabledList.settleTypeName = this.props.goodsSettleWay;
            tabledList.discountRate = 1.0
            tabledList.amount = tabledList.qty * record.price || 0;
            tabledList.receivableAmount = tabledList.qty * record.price || 0
            goodsDataSource.splice(length - 1, 0, tabledList);
            goodsDataSource.map((item, index) => {
              item.workHoursNum = index + 1;
              item.key = index + Math.random() * 2 + Math.random() * 3;
            });
            new Promise((resolve, reject) => {
              this.props.tableReset({
                goodsDataSource,
                resolve, reject
              })
              this.props.modalReset({
                goodsVisible: false,
                comboNumber: 1,
                resolve, reject
              })
            }).then(() => {
              _th.props.calculateTotal('goodsDataSource');
              // 清空字段(bug)
              const goodsObj = this.props.goodsObj;
              this.props.MODAL_SET_STATE({
                goodsSettleWay: '',
                goodsSettleId: '',
                goodsSettleCode: '',
                goodsObj: { ...goodsObj, priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 },
              });
            })
          }
        })
      }
    } else {
      // 不用添加
      const tabledList = {
        key: record.goodsId,
        goodsNo: '',
        index: record.goodsId,
        workHoursNum: 1,
        id: '', // 主键ID,
        workNeeded: 0,
        combo: 1,
        goodsId: '', // 商品ID,
        goodsNo: '', // 商品编码,
        goodsName: '', // 商品名称,
        goodsTypeId: '', // 商品类型ID,
        goodsTypeCode: '', // 商品类型编码,
        goodsTypeName: '', // 商品类型名称（材料 or 施工）,
        bizTypeId: '', // 业务类型ID,
        bizTypeCode: '', // 业务类型编码,
        bizTypeName: '', // 业务类型名称,
        settleTypeId: this.props.goodsSettleId, // 结算方式ID,
        settleTypeCode: this.props.goodsSettleCode, // 结算方式编码,
        settleTypeName: this.props.goodsSettleWay, // 结算方式名称,
        price: '', // 单价,
        qty: + this.props.comboNumber, // 数量,
        amount: '', // 金额,
        discountRate: 1, // 折扣率,
        receivableAmount: '', // 应收金额,
        technicianEmpId: '', // 技师员工ID (施工),
        technicianEmpName: '', // 技师员工姓名 (施工),
        issuedQty: 0, // 已发料数量 (材料)
        mfgGoodsNo: record.mfgGoodsNo,
        oemGoodsNo: record.oemGoodsNo,
        goodsUnit: '件',
        goodsIssueNeeded: record.goodsIssueNeeded,
      };
      new Promise((resolve, reject) => {
        this.props.modalReset({
          tabledList: {
            ...tabledList,
            modification: record.modification,
            price: record.price,
            index: record.goodsId,
            goodsId: record.goodsId,
            goodsNo: record.goodsNo,
            goodsName: record.goodsName,
            key: record.goodsId,
            goodsIssueNeeded: record.goodsIssueNeeded
          },
          resolve, reject
        })
      }).then(() => {
        // 拿到这个对象加入的数组中并且清空里面的数据
        const tabledList = _.cloneDeep(this.props.tabledList);
        const goodsDataSource = _.cloneDeep(this.props.goodsDataSource);
        const length = goodsDataSource.length;
        const {
          defaultWorkTypeId,
          defaultWorkTypeNo,
          defaultWorkType,
        } = this.props.defaultTypeValue;
        if (length == 1) {
          // 添加第一条数据
          tabledList.bizTypeId = defaultWorkTypeId;
          tabledList.bizTypeCode = defaultWorkTypeNo;
          tabledList.bizTypeName = defaultWorkType;
          tabledList.settleTypeId = this.props.goodsSettleId;
          tabledList.settleTypeCode = this.props.goodsSettleCode;
          tabledList.settleTypeName = this.props.goodsSettleWay;
          tabledList.discountRate = 1.0
          tabledList.amount = tabledList.qty * record.price || 0;
          tabledList.receivableAmount = tabledList.qty * record.price || 0;
          goodsDataSource.splice(length - 1, 0, tabledList);
          goodsDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
            item.key = index + Math.random() * 2 + Math.random() * 3;
          });
          new Promise((resolve, reject) => {
            this.props.tableReset({
              goodsDataSource,
              resolve, reject
            })
            this.props.modalReset({
              goodsVisible: false,
              comboNumber: 1,
              resolve, reject
            })
          }).then(() => {
            _th.props.calculateTotal('goodsDataSource');
            // 清空字段(bug)
            const goodsObj = this.props.goodsObj;
            this.props.MODAL_SET_STATE({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: { ...goodsObj, priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 },
            });
          })
        } else {
          tabledList.bizTypeId = goodsDataSource[goodsDataSource.length - 2].bizTypeId;
          tabledList.bizTypeCode = goodsDataSource[goodsDataSource.length - 2].bizTypeCode;
          tabledList.bizTypeName = goodsDataSource[goodsDataSource.length - 2].bizTypeName;
          tabledList.settleTypeId = this.props.goodsSettleId;
          tabledList.settleTypeCode = this.props.goodsSettleCode;
          tabledList.settleTypeName = this.props.goodsSettleWay;
          tabledList.discountRate = 1.0
          tabledList.amount = tabledList.qty * record.price || 0;
          tabledList.receivableAmount = tabledList.qty * record.price || 0
          goodsDataSource.splice(length - 1, 0, tabledList);
          goodsDataSource.map((item, index) => {
            item.workHoursNum = index + 1;
            item.key = index + Math.random() * 2 + Math.random() * 3;
          });
          new Promise((resolve, reject) => {
            this.props.tableReset({
              goodsDataSource,
              resolve, reject
            })
            this.props.modalReset({
              goodsVisible: false,
              comboNumber: 1,
              resolve, reject
            })
          }).then(() => {
            _th.props.calculateTotal('goodsDataSource');
            // 清空字段(bug)
            const goodsObj = this.props.goodsObj;
            this.props.MODAL_SET_STATE({
              goodsSettleWay: '',
              goodsSettleId: '',
              goodsSettleCode: '',
              goodsObj: { ...goodsObj, priceTypeCode: '35400000', goodsName: '', matchSeries: 0, isZeroStock: 0 },
            });
          })
        }
      })
    }
  };

  render() {
    const {
      goodsVisible, goodsSettleCode, settleType, goodsObj, priceLists, goodList,
      worksPageTotal, pagecurrent, comboNumber,
    } = this.props
    const GPcolumns = [
      {
        title: 'OEM编码',
        key: 'name',
        render: record => <span>{record.oemGoodsNo}</span>,
      },
      {
        title: '商品名称',
        key: 'age',
        render: record => <span>{record.goodsName}</span>,
      },
      {
        title: '价格',
        key: 'address',
        render: record => <span>{record.price}</span>,
      },
      {
        title: '库存量',
        key: '9999999999',
        render: record => <span>{record.qty}</span>,
      },
      {
        title: '可用库存量',
        key: '000000',
        render: record => <span>{record.usableQty}</span>,
      },
      {
        title: '操作',
        key: '5555555',
        render: record => (
          <Button onClick={this.ToTabled.bind(this, record)} type='primary'>
            选择加入
          </Button>
        ),
      },
    ];

    return (
      <Style>
        <Modal
          width='850px'
          visible={goodsVisible}
          onCancel={this.GPhandleCancel}
          footer={[]}
        >
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '20px' }}>
              <label>结算方式:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={goodsSettleCode}
                onChange={this.wayChange}
              >
                {getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>价格方案:</label>
              <Select
                allowClear
                style={{ width: 120 }}
                value={goodsObj.priceTypeCode}
                onChange={this.priceChange}
              >
                {getOptionRender(priceLists, { key: 'key', code: 'dicCode', name: 'dicValue' })}
              </Select>
            </span>
            <span style={{ marginRight: '20px' }}>
              <label>默认数量:</label>
              <Input
                style={{ width: '120px' }}
                value={comboNumber}
                onChange={this.GPnumberChange}
                placeholder='默认数量'
              />
            </span>
            <span>
              <Input
                style={{ width: '120px' }}
                value={goodsObj.goodsName}
                onPressEnter={this.OemEnter}
                onChange={this.OemChange}
                placeholder='输入OEM编码或名称'
              />
            </span>
            <Checkbox value={goodsObj.matchSeries} checked={goodsObj.matchSeries == 1} onChange={this.carType.bind(event)}>
              适用车型
            </Checkbox>
            <Checkbox value={goodsObj.isZeroStock} checked={goodsObj.isZeroStock == 1} onChange={this.kucun.bind(event)}>
              零库存
            </Checkbox>
          </div>
          {/* 表格 */}
          <Table
            dataSource={goodList}
            columns={GPcolumns}
            bordered
            pagination={false}
          />

          <div style={{ textAlign: 'center' }}>
            <Pagination
              showQuickJumper
              style={{ marginTop: '20px' }}
              size='small'
              total={worksPageTotal}
              pageSize={goodsObj.pageSize}
              current={pagecurrent}
              showTotal={showTotal}
              onChange={this.onCurrentPage}
            />
          </div>
        </Modal>

      </Style>
    )


  }
}

const mapStateToProps = (state) => {
  const { settleType, goodsArr, } = state.baseData
  const { workHoursDataSource, goodsDataSource, defaultTypeValue, } = state.tableInfo
  const {
    goodsVisible, goodsSettleWay, goodsSettleCode, goodsSettleId, goodsObj,
    priceLists, goodList, worksPageTotal, pagecurrent, comboNumber,
    tabledList,
  } = state.modalInfo

  return {
    goodsVisible, goodsSettleWay, goodsSettleCode, goodsSettleId, settleType,
    goodsObj, priceLists, goodList, worksPageTotal, pagecurrent, comboNumber,
    tabledList, workHoursDataSource, goodsArr, goodsDataSource, defaultTypeValue,

  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    calculateTotal, calculateBottomTotal, tableReset,
  } = dispatch.tableInfo
  const {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, QueryFastProductForPage,

  } = dispatch.modalInfo
  return {
    MODAL_SET_STATE, MODAL_RESET_STATE, modalReset, QueryFastProductForPage,
    calculateTotal, calculateBottomTotal, tableReset,
  }
}

const AddGood = Form.create()(AddGoods);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGood)