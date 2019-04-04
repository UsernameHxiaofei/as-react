import React, { Component } from 'react';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Row, Col, Form, Table, Input, DatePicker, Button, Icon, Select, InputNumber, message } from 'antd';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import Operation from 'antd/lib/transfer/operation';
import { env } from '../../../../../config/env/';
const {
  REDIRECTION_URL: { ReturnOfWorkOrders, DetailsOfDelivery, DeliveryReturns },
  HOST
} = env;
const FormItem = Form.Item;
const Option = Select.Option;

class ETabs extends Component {
  componentDidMount = () => {
    this.props.GetHrEmpMstrByOrgId();
  };

  peoperChange = (value, option) => {
    // 退库人改变事件
    if (value == undefined) {
      this.props.SET_STATE({
        Search: { ...this.props.Search, issuedId: '', name: '' }
      });
    } else {
      this.props.SET_STATE({
        Search: { ...this.props.Search, issuedId: value, name: option.props.children }
      });
    }
  };

  numberChange = (record, value) => {
    // 本次退料改变
    // debugger
    let arr = _.cloneDeep(this.props.editTable); //所有数据
    let Arr = _.cloneDeep(this.props.TableList); //已选择
    let arrCopy = Arr.find(item => {
      return item.id === record.id;
    });
    let index = arr.findIndex((item, index) => {
      return item.id === record.id;
    });
    if (arrCopy) {
      if (Arr.indexOf(arrCopy) < 0) {
        arrCopy.deliveryNumber = value;
        arr[index] = arrCopy;
        Arr.push(arrCopy);
        this.props.SET_STATE({
          editTable: arr,
          TableList: Arr
        });
      } else {
        arrCopy.deliveryNumber = value;
        arr[index] = arrCopy;
        this.props.SET_STATE({
          editTable: arr,
          TableList: Arr
        });
      }
    } else {
      arrCopy = _.cloneDeep(record);
      arrCopy.deliveryNumber = value;
      let keyArr = _.cloneDeep(this.props.keyArr);
      keyArr.push(record.key); //勾选
      arr[index] = arrCopy;
      Arr.push(arrCopy);
      this.props.SET_STATE({
        editTable: arr,
        keyArr,
        TableList: Arr
      });
    }
  };

  back = () => {
    //取消(跳转)
    const data = {
      jumpFlag: true
    };
    // const _data = JSON.stringify(data);
    // const autoMessage = {
    //   name: '工单发料退库', index: `orderEdit${Math.random()}`, url: 'DeliveryReturns', resId: 'editOrder', infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST);
    if (envRouter) {
      //预发环境
      this.props.history.push({ pathname: '/DeliveryReturns', query: data });
    } else {
      menuRouter.ready(_ => {
        // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(DeliveryReturns, data, { title: '工单发料退库' });
      });
    }
  };
  jumpBack = () => {
    //退料
    // 在表单验证通过后旳
    // console.log(this.props.TableList)
    // if (this.props.woStatusName == '新建' || this.props.woStatusName == '施工中') {
    this.props.form.validateFields(['proer'], (err, values) => {
      if (!err) {
        // 没有勾选提示用户勾选否则拿到这个数组跳转到退料详情页面
        if (this.props.TableList.length < 1) {
          message.error('请选择退料的数据');
          return false;
        } else {
          let obj = this.props.TableList.find((item, index) => {
            return item.deliveryNumber <= 0.01;
          });
          if (obj) {
            message.error('本次退料应该大于0');
          } else {
            this.props.TableList.map((item, index) => {
              item['index'] = index + 1;
            });
            const data = {
              Search: this.props.Search,
              TableList: this.props.TableList,
              id: this.props.Obj.woId,
              jumpFlag: true
            };
            if (envRouter) {
              //预发环境
              this.props.history.push({ pathname: '/DetailsOfDelivery', query: data });
            } else {
              menuRouter.ready(_ => {
                // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
                menuRouter.open(DetailsOfDelivery, data, { title: '工单发料退库确认' });
              });
            }
          }
        }
      }
    });
    // } else {
    //   message.error('不是新建跟施工中的工单不能退料')
    //   return false
    // }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLeftLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 }
      }
    };

    const data = [
      {
        availableInventory: 2109,
        bizTypeCode: '71400005',
        bizTypeId: '44375bcfb67d46e399762e194a892e48',
        bizTypeName: '首次保养',
        deliveryNumber: 0,
        goodsUnit: '件',
        id: '66ddf7f628af4cfa82c53eca07e29789',
        issuedQty: 1,
        materialId: '44375bcfb67d46e399762e194a892e48',
        materialName: '滤网-售后',
        materialNo: '2027020001',
        mfgGoodsNo: 'G20181122',
        notIssuedQty: 0,
        oemGoodsNo: 'GN20181122',
        price: 220,
        qty: 1,
        settleTypeCode: '70050000',
        settleTypeId: 'be52e87704f7488ca4e137d1b38f6f5e',
        settleTypeName: '客户付费'
      },
      {
        availableInventory: 1111.5,
        bizTypeCode: '71400005',
        bizTypeId: '68eb7ddae59448809b093b7ceeecf8bf',
        bizTypeName: '首次保养',
        deliveryNumber: 0,
        goodsUnit: '件',
        id: 'ac198857c0914f54b799aac077c25ece',
        issuedQty: 3,
        materialId: '68eb7ddae59448809b093b7ceeecf8bf',
        materialName: '中控屏-售后',
        materialNo: '2027020002',
        mfgGoodsNo: 'G20181123',
        notIssuedQty: 1,
        oemGoodsNo: 'GN20181123',
        price: 520,
        qty: 1,
        settleTypeCode: '70050000',
        settleTypeId: 'be52e87704f7488ca4e137d1b38f6f5e',
        settleTypeName: '客户付费'
      }
    ];
    const columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'key',
        key: 'index',
        width: '5%'
      },
      {
        title: '配件编码',
        align: 'center',
        dataIndex: 'materialNo',
        key: 'workNUMBER',
        align: 'center',
        width: '20%'
      },
      {
        title: '配件名称',
        dataIndex: 'materialName',
        key: 'name',
        align: 'center',
        width: '10%'
      },
      {
        title: '业务类型',
        dataIndex: 'bizTypeName',
        key: 'tpype',
        align: 'center',
        width: '10%',
        align: 'center'
      },
      {
        title: '原厂编码',
        align: 'center',
        dataIndex: 'mfgGoodsNo',
        key: 'money',
        width: '10%'
      },
      {
        title: '销售单价',
        align: 'center',
        dataIndex: 'price',
        key: 'she',
        width: '8%',
        render: (text, record) => <span>{Number(text).toFixed(2)}</span>
      },
      {
        title: '数量',
        dataIndex: 'qty',
        align: 'center',
        key: 'Ymoney',
        width: '8%',
        render: (text, record) => <span>{Number(text).toFixed(2)}</span>
      },
      {
        title: '已出库数量',
        dataIndex: 'issuedQty',
        align: 'center',
        key: 'price',
        width: '8%',
        render: (text, record) => <span>{Number(text).toFixed(2)}</span>
      },
      {
        title: '本次退料',
        key: 'state',
        align: 'center',
        width: '10%',
        render: record => (
          <InputNumber
            min={0}
            max={record.issuedQty}
            value={record.deliveryNumber}
            precision={2}
            onChange={this.numberChange.bind(this, record)}
          />
        )
      }
    ];

    const rowSelection = {
      // 勾选后，默认退货数量等于已出库数量

      selectedRowKeys: this.props.keyArr,
      onChange: (selectedRowKeys, selectedRows) => {
        let selectedRow = _.cloneDeep(selectedRows);
        let arr = _.cloneDeep(this.props.editTable);
        // selectedRow.forEach((item) => {
        //   if (item.deliveryNumber == 0) {
        //     item.deliveryNumber = item.issuedQty
        //   }
        // })
        // arr.forEach((item) => {
        //   let obj = arr.find((i) => {
        //     return i['key'] == item['key']
        //   })
        //   if (item.id == obj.id && !selectedRowKeys.indexOf(obj.key)) {
        //     item.deliveryNumber = item.issuedQty
        //   }
        // })
        let Arr = [];
        selectedRow.map((item, index) => {
          let obj = arr.find((i, index) => {
            return item.id == i.id;
          });
          if (obj.deliveryNumber == 0) {
            obj.deliveryNumber = obj.issuedQty;
          }
          Arr.push(obj);
        });
        selectedRow.map(item => {
          let index = arr.indexOf(item);
          if (index >= 0) {
            arr[index].deliveryNumber = item.issuedQty;
          }
        });
        this.props.SET_STATE({
          keyArr: selectedRowKeys,
          editTable: arr,
          TableList: Arr
        });
      }
    };

    return (
      <div style={{ marginTop: '20px' }}>
        <span>材料信息</span>
        <div style={{ float: 'right', marginRight: '50px' }}>
          <FormItem label='退料人' {...formLeftLayout}>
            {getFieldDecorator('proer', {
              rules: [
                {
                  required: true,
                  message: '请选择退料人'
                }
              ]
            })(
              <Select
                allowClear
                showSearch
                placeholder='请选择退料人'
                style={{ width: '200px' }}
                optionFilterProp='children'
                onChange={this.peoperChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.props.peoperList.map((item, index) => {
                  return (
                    <Option key={index} value={item.empId}>
                      {item.empName}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </div>
        <Table
          dataSource={this.props.editTable}
          columns={columns}
          rowSelection={rowSelection}
          bordered
          scroll={{ y: 400, x: 1300 }}
          pagination={false}
        />
        <div style={{ marginTop: '20px' }}>共{this.props.length}条</div>
        <div style={{ float: 'right', marginTop: '20px' }}>
          <Button onClick={this.back} style={{ marginRight: '20px' }}>
            取消
          </Button>
          <Button onClick={this.jumpBack} style={{ marginRight: '20px' }} type='primary'>
            退料
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToPros = state => {
  const { keyArr, Obj, TableList, Search, editTable, peoperList, length } = state.returnofworkorders;
  return { keyArr, Obj, TableList, Search, editTable, peoperList, length };
};

const mapDispatchToProps = dispatch => {
  const { SET_STATE, GetHrEmpMstrByOrgId } = dispatch.returnofworkorders;
  return { SET_STATE, GetHrEmpMstrByOrgId };
};

const ETab = Form.create()(ETabs);

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(withRouter(ETab));
