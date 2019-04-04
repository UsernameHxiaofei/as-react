/*
 create By wwj 2018-12-20
 */
import React, { Component } from 'react'
import styled from 'styled-components';
import {
  Row, Col, Form, Table, Spin, Modal, Select,
  Button, Input, InputNumber, Checkbox, showQuickJumper, message,

} from 'antd'
import { connect } from 'react-redux'
import * as _ from 'lodash';
import { env } from '@/config/env/'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
import { getOptionRender, getChekedTotal } from '../../../../common/components'
const FormItem = Form.Item
const Style = styled.div`
.w100p {
  width:100%;
}
.ant-table-pagination.ant-pagination{
  text-align: center;
  float: none;
}
`;

class addMaterial extends Component {

  componentDidMount = () => {
    this.props.getDicDataesByCategoryCode({ code: '3540' }, 'priceWay'); //价格方案
    this.props.getDicDataesByCategoryCode({ code: '7005' }, 'settleType'); // 获取结算方式
    this.props.queryWorkSetting(); //售后系统设置默认值
  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }
  /* 关闭材料弹窗 */
  materialCancel = () => {
    const oldData = _.cloneDeep(this.props.data);
    const defaultTypeValue = _.cloneDeep(this.props.defaultTypeValue);
    this.props.SET_STATE({
      materialVisible: false,
      // materialNumber: 0,
      // data: {
      //   ...oldData,
      //   goodsName: '',
      //   matchSeries: 0,
      //   isZeroStock: 0,
      //   priceTypeCode: '35400000', //价格方案
      // }
    })
    // this.props.form.setFieldsValue({
    //   defaultPayWay: defaultTypeValue.defaultPayWay,
    //   priceWay: '35400000',
    // });
  }
  /* 下拉框修改 */
  statesChange = (type, value, event) => {
    // console.log(type, value, event)
    const { data, paidWay } = _.cloneDeep(this.props);
    if (type === 'priceWay') { //价格方案
      if (value) {
        this.props.SET_STATE({ data: { ...data, priceTypeCode: value } })
      } else {
        this.props.SET_STATE({ data: { ...data, priceTypeCode: '' } })
      }
    }
    if (type === 'payWay') { //结算方式
      if (value) {
        this.props.SET_STATE({
          paidWay: {
            ...paidWay,
            settleTypeId: event.key,
            settleTypeCode: event.props.value,
            settleTypeName: event.props.children,
          }
        })
      } else {
        this.props.SET_STATE({
          paidWay: {
            ...paidWay,
            settleTypeId: '',
            settleTypeCode: '',
            settleTypeName: '',
          }
        })
      }
    }
  }
  /* 请求参数修改 */
  paramChange = (type, event) => {
    // console.log(type, event);
    const oldData = _.cloneDeep(this.props.data);
    if (type === 'materialNumber') { //默认数量
      this.props.SET_STATE({ materialNumber: event })
    }
    if (type === 'goodsName') { //输入框
      this.props.SET_STATE({
        data: { ...oldData, goodsName: event.target.value }
      })
    }
    if (type === 'matchSeries') { //适用车型
      const flag = event.target.value === 0 ? 1 : 0;
      this.props.SET_STATE({
        data: { ...oldData, matchSeries: flag }
      })
    }
    if (type === 'isZeroStock') { //零库存
      const flag = event.target.value === 0 ? 1 : 0;
      this.props.SET_STATE({
        data: { ...oldData, isZeroStock: flag }
      })
    }
  }
  // 查询列表
  searchList = () => {
    this.props.queryFastProductForPage(); //查询材料
  }

  /* 添加到材料 */
  addToTable = (record) => {
    let row = _.cloneDeep(record);
    let dataSource = _.cloneDeep(this.props.woMaterialVOs);
    const listLength = dataSource.length;
    const { paidWay, defaultTypeValue } = _.cloneDeep(this.props);
    if (row) {
      if (listLength == 0) {
        row.bizTypeId = defaultTypeValue.defaultWorkTypeId; //业务类型id
        row.bizTypeCode = defaultTypeValue.defaultWorkTypeNo; //业务类型code
        row.bizTypeName = defaultTypeValue.defaultWorkType; //业务类型
      } else {
        row.bizTypeCode = dataSource[listLength - 1].bizTypeCode; //业务类型code
        row.bizTypeId = dataSource[listLength - 1].bizTypeId; //业务类型id
        row.bizTypeName = dataSource[listLength - 1].bizTypeName; //业务类型
      }
      row.materialNo = row.goodsNo; //材料编码
      row.materialName = row.goodsName; //材料名称
      row.settleTypeId = paidWay.settleTypeId; // 结算方式ID,
      row.settleTypeCode = paidWay.settleTypeCode; // 结算方式编码,
      row.settleTypeName = paidWay.settleTypeName; // 结算方式名称,
      row.issuedQty = 0; //已发料数量
      row.notIssuedQty = this.props.materialNumber; //未发料数量
      row.preIssuedQty = row.qty > 0 ? 1 : 0; //本次发料
      row.availableInventory = row.usableQty; //可用库存
      row.materialId = row.goodsId; //材料ID
      row.id = ''; //明细ID
      row.qty = this.props.materialNumber;
      row.checked = false;
      row.goodsIssueNeeded = 1;
    }
    // console.log(row)
    const newArr = [...dataSource, row].map((item, index) => {
      item.key = item.goodsId + index;
      item.sortNum = ++index;
      return item;
    })
    this.props.SET_STATE({
      woMaterialVOs: newArr,
      outWarehourseTotal: getChekedTotal(newArr, 'preIssuedQty'),
    })
    this.materialCancel();

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const spanNum = 8;
    const noTitleFormLayout = {
      labelCol: {
        sm: { span: 0 },
      },
      wrapperCol: {
        sm: { span: 24 },
      },
    }
    const {
      materialModalArr, materialVisible, materialLoading, defaultTypeValue, settleType, priceWay,
      data, materialNumber, materialListPage, queryFastProductForPage,
    } = this.props
    const materialDropColumns = [
      { title: 'OEM编码', key: 'oemGoodsNo', dataIndex: 'oemGoodsNo', width: 220, },
      { title: '材料名称', key: 'goodsName', dataIndex: 'goodsName', width: 220, },
      { title: '价格', key: 'price', dataIndex: 'price', width: 150, },
      { title: '库存量', key: 'qty', dataIndex: 'qty', width: 150, },
      { title: '可用库存量', key: 'usableQty', dataIndex: 'usableQty', width: 120, },
      {
        title: '操作', key: 'operation', dataIndex: 'operation', width: 120,
        render: (text, record) => (
          <Button onClick={this.addToTable.bind(this, record)} type='primary'>
            选择加入
          </Button>
        )
      },
    ]
    const paginationOption = {
      showQuickJumper: true,
      current: materialListPage.currentIndex,
      total: materialListPage.totalNumber,
      pageSize: 10,
      onChange(currents) {
        const newSearchConditions = { ...data, index: currents };
        queryFastProductForPage(newSearchConditions);
      },
      showTotal(total) {
        return `共 ${total} 条`;
      },
    }
    return (
      <Modal width='860px' footer={[]} visible={materialVisible} onCancel={this.materialCancel}>
        <Spin spinning={materialLoading} tip='加载中'>
          <Style>
            <Form className='form-info-style'>
              <Row gutter={gutter}>
                <Col span={spanNum}>
                  <FormItem {...formLayout} label='结算方式'>
                    {getFieldDecorator('defaultPayWay', {
                      initialValue: defaultTypeValue.defaultPayWay,
                    })(
                      <Select allowClear className='w100p' onChange={this.statesChange.bind(event, 'payWay')}>
                        {getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                  </FormItem>
                </Col>
                <Col span={spanNum}>
                  <FormItem {...formLayout} label='价格方案'>
                    {getFieldDecorator('priceWay', {
                      initialValue: data.priceTypeCode,
                    })(
                      <Select allowClear className='w100p' onChange={this.statesChange.bind(event, 'priceWay')}>
                        {getOptionRender(priceWay, { key: 'key', code: 'dicCode', name: 'dicValue' })}
                      </Select>)}
                  </FormItem>
                </Col>
                <Col span={spanNum}>
                  <FormItem {...formLayout} label='默认数量'>
                    <InputNumber style={{ width: '95%' }} value={materialNumber} min={1} precision={0}
                      onChange={this.paramChange.bind(event, 'materialNumber')} placeholder='默认数量' />
                  </FormItem>
                </Col>
                <Col span={spanNum}>
                  <FormItem {...noTitleFormLayout} label=''>
                    <Input
                      className='w100p'
                      value={data.goodsName}
                      onPressEnter={this.searchList}
                      onChange={this.paramChange.bind(event, 'goodsName')}
                      placeholder='请输入OEM编码或材料名称'
                    />
                  </FormItem>
                </Col>
                <Col span={spanNum} style={{ marginLeft: '15px' }}>
                  <Checkbox value={data.matchSeries} checked={data.matchSeries == 1} onChange={this.paramChange.bind(event, 'matchSeries')}>
                    适用车型
                    </Checkbox>
                  <Checkbox value={data.isZeroStock} checked={data.isZeroStock == 1} onChange={this.paramChange.bind(event, 'isZeroStock')}>
                    零库存
                    </Checkbox>
                </Col>
                <Row span={24} style={{ float: 'right', marginRight: '10px' }}>
                  <Button onClick={this.searchList} type='primary'>查询</Button>
                </Row>
              </Row>
            </Form>
            <Table
              dataSource={materialModalArr}
              columns={materialDropColumns}
              bordered
              // scroll={{ x: 1280, y: 300 }}
              size='small'
              pagination={
                (Array.isArray(materialModalArr) && materialModalArr.length) > 0
                  ? paginationOption
                  : false
              } />
          </Style>
        </Spin>
      </Modal>
    )
  }
}


const mapStateToProps = (state) => {
  const {
    woMaterialVOs, workItemInfos, materialVisible, materialLoading,
    defaultTypeValue, priceWay, settleType, data, materialModalArr,
    materialNumber, materialListPage, paidWay,
  } = state.WorksheetIssueCreate
  return {
    woMaterialVOs, workItemInfos, materialVisible, materialLoading,
    defaultTypeValue, priceWay, settleType, data, materialModalArr,
    materialNumber, materialListPage, paidWay,
  }
}

const mapDispatchToProps = (dispatch) => {
  const {
    SET_STATE, RESET_STATE, getDicDataesByCategoryCode, queryWorkSetting,
    queryFastProductForPage,
  } = dispatch.WorksheetIssueCreate
  return {
    SET_STATE, RESET_STATE, getDicDataesByCategoryCode, queryWorkSetting,
    queryFastProductForPage,
  }
}

const addMaterials = Form.create()(addMaterial);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addMaterials)
