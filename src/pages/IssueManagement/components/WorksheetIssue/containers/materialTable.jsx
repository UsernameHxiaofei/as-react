/*
 create By wwj 2018-12-20
 */
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import styled from 'styled-components';
import { Row, Col, Form, Popconfirm, message, Button, Select } from 'antd'
import { connect } from 'react-redux'
import * as _ from 'lodash';
import { env } from '@/config/env/'
import { accAdd, accSub, } from '@/config/methods.js';
const { REDIRECTION_URL: { WorksheetOut }, HOST } = env
import { EditableTable, SelectTableMenu } from '@/components/BlksEditableTable';
import { getOptionRender, getChekedTotal } from '../../../common/components'
// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const FormItem = Form.Item
const Option = Select.Option
const Style = styled.div`
.mr20 {
  margin-right: 20px;
}
.mb10 {
  margin-bottom:10px;
}
.material-title {
  font-size:16px;
  color:#000;
  margin-right:40px;
}
.w100p {
 width:100%;
}
`;

class IssueInfo extends Component {

  componentDidMount = () => {
    this.props.getBasValueByBasCategoryNo({ categoryNo: 'AS1000' }, 'workBizType'); // 获取工单的业务类型
    this.props.getHrEmpMstrByOrgId(); // 领料人
  }
  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }
  /*  按钮添加材料 */
  addMaterial = () => {
    this.props.SET_STATE({ materialVisible: true })
  };
  /*  删除材料 */
  deleteRows = () => {
    const materialData = _.cloneDeep(this.props.woMaterialVOs)
    //已发料大于0不能删除 
    const newMaterial = materialData.filter(item => !item.checked || (item.checked && item.issuedQty > 0))
    const hadIssued = newMaterial.find(item => item.checked && item.issuedQty > 0);
    if (hadIssued) {
      message.error('该商品已经发料，不能删除该材料');
    }
    newMaterial.forEach((item, index) => {
      item.sortNum = ++index;
      item.checked = false;
    })
    this.props.SET_STATE({
      woMaterialVOs: newMaterial,
      selectedRowKeys: [],
      woIsId: '',
      outWarehourseTotal: getChekedTotal(newMaterial, 'preIssuedQty'),
    })
  };
  /* 下拉框添加材料 */
  materialDropAdd = (rows) => {
    let dataSource = _.cloneDeep(this.props.woMaterialVOs);
    let row = _.cloneDeep(rows);
    const listLength = dataSource.length;
    const { defaultTypeValue } = _.cloneDeep(this.props);
    // console.log(defaultTypeValue)
    if (row) {
      if (listLength == 0) {
        row.bizTypeId = defaultTypeValue.defaultWorkTypeId; //业务类型id
        row.bizTypeCode = defaultTypeValue.defaultWorkTypeNo; //业务类型code
        row.bizTypeName = defaultTypeValue.defaultWorkType; //业务类型
        row.settleTypeId = defaultTypeValue.defaultPayWayId; // 结算方式ID,
        row.settleTypeCode = defaultTypeValue.defaultPayWayNo; // 结算方式编码,
        row.settleTypeName = defaultTypeValue.defaultPayWay; // 结算方式名称,
      } else {
        row.bizTypeId = dataSource[listLength - 1].bizTypeId; //业务类型id
        row.bizTypeCode = dataSource[listLength - 1].bizTypeCode; //业务类型code
        row.bizTypeName = dataSource[listLength - 1].bizTypeName; //业务类型
        row.settleTypeId = dataSource[listLength - 1].settleTypeId; // 结算方式ID,
        row.settleTypeCode = dataSource[listLength - 1].settleTypeCode; // 结算方式编码,
        row.settleTypeName = dataSource[listLength - 1].settleTypeName; // 结算方式名称,
      }
      row.materialNo = row.goodsNo; //材料编码
      row.materialName = row.goodsName; //材料名称
      row.issuedQty = 0; //已发料数量
      row.notIssuedQty = 1; //未发料数量
      row.preIssuedQty = row.qty > 0 ? 1 : 0; //本次发料
      row.availableInventory = row.usableQty;//可用库存
      row.materialId = row.goodsId; //材料ID
      row.id = ''; //明细ID
      row.qty = 1; //数量
      row.checked = false;
      row.goodsIssueNeeded = 1;
    }
    const newArr = _.cloneDeep([...dataSource, row]).map((item, index) => {
      item.key = item.goodsId + index;
      item.sortNum = ++index;
      return item;
    })
    this.props.SET_STATE({
      woMaterialVOs: newArr,
      outWarehourseTotal: getChekedTotal(newArr, 'preIssuedQty'),
    })
  }
  /* 点击 表格checkbox 触发选择行为回调 */
  handleSelectRow = (selectedRowKeys) => {
    const dataSource = _.cloneDeep(this.props.woMaterialVOs);
    dataSource.forEach(item => {
      const checkResult = selectedRowKeys.indexOf(item.key) > -1;
      //勾选上并且未修改过本次发料，则本次发料数量等于未发料数量
      if (checkResult && item.hasChanged !== 1) {
        item.preIssuedQty = item.notIssuedQty < item.availableInventory ? item.notIssuedQty : item.availableInventory;
        item.qty = accAdd(item.issuedQty, item.preIssuedQty);
      }
      item.checked = checkResult;
    });
    this.props.SET_STATE({
      woMaterialVOs: dataSource,
      selectedRowKeys,
      outWarehourseTotal: getChekedTotal(dataSource, 'preIssuedQty'),
    });
  }
  /* 列表下拉框更改 */
  handleSelectChange = (row, option, type) => {
    // console.log(999, row, option, type)
    let woMaterialVOs = _.cloneDeep(this.props.woMaterialVOs);
    woMaterialVOs.forEach(item => {
      if (item.key == row.key) {
        if (type === 'bizType') { //业务类型
          if (option) {
            item.bizTypeCode = option.props.value;
            item.bizTypeId = option.key;
            item.bizTypeName = option.props.children;
          } else {
            item.bizTypeCode = '';
            item.bizTypeId = '';
            item.bizTypeName = '';
          }
        }
        if (type === 'settleType') { //结算方式
          if (option) {
            item.settleTypeCode = option.props.value;
            item.settleTypeId = option.key;
            item.settleTypeName = option.props.children;
          } else {
            item.settleTypeCode = '';
            item.settleTypeId = '';
            item.settleTypeName = '';
          }
        }
      }
    })
    this.props.SET_STATE({
      woMaterialVOs,
      woIsId: ''
    })

  }

  /* 下拉框修改 */
  statesChange = (type, value, event) => {
    const { materialDto } = _.cloneDeep(this.props);
    if (type === 'issuerName') { //领料人
      if (value) {
        this.props.SET_STATE({ materialDto: { ...materialDto, issuerName: event.props.children }, issuerId: event.key })
      } else {
        this.props.SET_STATE({ materialDto: { ...materialDto, issuerName: '' }, issuerId: '' })
      }
    }
  }
  /* 表格内表单值变化回调 */
  workHoursRowValue = (row, key) => {
    const selectedRowKeys = _.cloneDeep(this.props.selectedRowKeys);
    if (row.availableInventory > 0) {
      if (row.qty < 1) row.qty = 1;
      if (row.preIssuedQty < 1) row.preIssuedQty = 1;
      const preIssuedQty = row.notIssuedQty < row.availableInventory ? row.notIssuedQty : row.availableInventory;

      //修改数量并且已勾选时本次发料等于未发料
      if (key === 'qty') {
        if (row.qty < row.issuedQty) {
          row.qty = accAdd(row.issuedQty, row.notIssuedQty);
          message.error('数量不得小于已发料数量！');
        } else {
          row.notIssuedQty = accSub(row.qty, row.issuedQty); //未发料数量
        }
        if (row.checked) row.preIssuedQty = preIssuedQty;
      }
      //修改本次发料需勾选上
      if (key === 'preIssuedQty') {
        row.checked = true;
        row.hasChanged = 1; //判断是否更改过数量
        const IssuedQty = row.notIssuedQty < row.availableInventory ? row.notIssuedQty : row.availableInventory;
        if (row.preIssuedQty > IssuedQty) {
          row.preIssuedQty = IssuedQty;
          message.error('本次发料不得大于未发料数量或可用库存！');
        }
      }
      const rowKey = row.key;
      const rowKeyNum = selectedRowKeys.indexOf(rowKey);
      if (row.preIssuedQty > 0) { //本次发料需大于0
        rowKeyNum > -1 ? null : selectedRowKeys.push(rowKey);
      } else {
        rowKeyNum > -1 ? selectedRowKeys.splice(rowKeyNum, 1) : null;
      }

      const newData = _.cloneDeep(this.props.woMaterialVOs);
      const index = newData.findIndex(item => row.key === item.key);
      newData.splice(index, 1, row);
      newData.forEach(item => {
        item.checked = selectedRowKeys.indexOf(item.key) > -1;
      });
      this.props.SET_STATE({
        woMaterialVOs: newData,
        woIsId: '',
        outWarehourseTotal: getChekedTotal(newData, 'preIssuedQty'),
        selectedRowKeys,
      })
    }
  }
  /* 保存 */
  saveMaterial = () => {
    this.props.saveWorkOrderMaterial();
  }
  /* 发料 */
  materialIssue = () => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll(['issuerName'], (err, value) => {
      if (!err) {
        const { woMaterialVOs, issuerId, woIsId, materialDto } = this.props;
        const goodsArr = woMaterialVOs.filter(item => item.checked == true);
        const option = woMaterialVOs.find(item => item.id == '');
        const outData = {
          materialsArr: goodsArr,
          materialDto: materialDto,
          issuerId: issuerId,
          jumpFlag: true,
        }
        // const _data = JSON.stringify(outData);
        if (option || woIsId == '') {
          return message.error('请先保存工单');
        } else if (goodsArr.length == 0) {
          return message.error('请勾选需要发料的备件！')
        } else {
          // const autoMessage = {
          //   name: '工单发料出库确认', index: `issue${Math.random()}`, url: 'WorksheetOut', resId: 'issue', infoData: _data,
          // };
          // window.parent.postMessage(autoMessage, HOST)
          if (envRouter) { //预发环境
            this.props.history.push({ pathname: '/WorksheetOut', query: outData });
          } else {
            menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
              menuRouter.open(WorksheetOut, outData, { title: '工单发料出库确认' });
            });
          }
        }
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const {
      woMaterialVOs, fetching, selectedRowKeys, dropDownTable, workBizType,
      settleType, scEmp, materialDto, saveLoading, outWarehourseTotal
    } = this.props
    // 材料列表
    const materialColumns = [
      { title: '序号', key: 'sortNum', dataIndex: 'sortNum', width: 50, },
      { title: '材料编码', key: 'materialNo', dataIndex: 'materialNo', width: 280, },
      { title: '材料名称', key: 'materialName', dataIndex: 'materialName', width: 180, },
      {
        title: '业务类型', key: 'bizTypeCode', dataIndex: 'bizTypeCode', width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: getOptionRender(workBizType, { key: 'key', code: 'basCode', name: 'basText' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'bizType');
          },
        },
      },
      {
        title: '结算方式', key: 'settleTypeCode', dataIndex: 'settleTypeCode', width: 150,
        cellOption: {
          inputType: 'select',
          initialValue: '',
          optionRender: getOptionRender(settleType, { key: 'key', code: 'dicCode', name: 'dicValue' }),
          onChange: (row, option) => {
            this.handleSelectChange(row, option, 'settleType');
          },
        },
      },
      { title: '销售单价', key: 'price', dataIndex: 'price', width: 150, },
      {
        title: '数量', key: 'qty', dataIndex: 'qty', width: 120,
        cellOption: {
          inputType: 'inputNumber',
          precision: 2,
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
        },
      },
      { title: '已发料数量', key: 'issuedQty', dataIndex: 'issuedQty', width: 120, },
      { title: '未发料数量', key: 'notIssuedQty', dataIndex: 'notIssuedQty', width: 100, },
      {
        title: '本次发料', key: 'preIssuedQty', dataIndex: 'preIssuedQty', width: 120,
        cellOption: {
          inputType: 'inputNumber',
          precision: 2,
          getCellRestProps: record => ({
            disabled: record.availableInventory == 0, // 库存为0不可编辑
          }),
          onChange: (row, a, b, key) => {
            this.workHoursRowValue(row, key);
          },
          // rules: [
          //   {
          //     validatorFn: value => Number(value) >= 1,
          //     errMsg: '发料数量必须大于等于1',
          //   },
          // ],
        },
      },
      { title: '可用库存', key: 'availableInventory', dataIndex: 'availableInventory' },
    ]
    // 材料下拉框列表
    const dropDownTableColumns = [
      { key: 'oemGoodsNo', title: 'OEM编码', width: 25 },
      { key: 'goodsName', title: '商品名称', width: 35 },
      { key: 'price', title: '单价', width: 15 },
      { key: 'qty', title: '库存量', width: 15 },
      { key: 'usableQty', title: '可用库存', width: 15 },
    ]

    // 勾选框集合
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRow,
      getCheckboxProps: record => ({
        disabled: record.availableInventory == 0 || record.notIssuedQty == 0,
      }),
    };
    return (
      <Style style={{ marginTop: '20px' }}>
        <Row className='mb10'>
          <Col sm={24} md={12} lg={8}>
            <span className='material-title'>材料信息</span>
            <Button className='mr20' type='primary' onClick={this.addMaterial}> 材料</Button>
            {woMaterialVOs.length >= 1
              ? (
                <Popconfirm title="是否删除材料？" onConfirm={() => this.deleteRows()}>
                  <Button className='mr20' type='primary'> 删除</Button>
                </Popconfirm>
              ) : null}
          </Col>
          <Col {...colLayout} style={{ float: 'right' }}>
            <FormItem {...formLayout} label='领料人'>
              {getFieldDecorator('issuerName', {
                initialValue: materialDto.issuerName,
                rules: [
                  {
                    required: true,
                    message: '领料人不能为空！',
                  },
                ],
              })(
                <Select allowClear className='w100p' placeholder='请选择发料人员'
                  onChange={this.statesChange.bind(event, 'issuerName')}>
                  {getOptionRender(scEmp, { key: 'key', code: 'empId', name: 'empName' })}
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <EditableTable
          dataSource={woMaterialVOs}
          columns={materialColumns}
          rowSelection={rowSelection}
          bordered
          className='mb10'
          scroll={{ x: 1600, y: 300 }}
          size='small'
          rowKey='key' />
        {/* 搜索框 */}
        <SelectTableMenu
          dropDownTableColumns={dropDownTableColumns}
          dropDownTableDatasource={dropDownTable}
          rowKey='key'
          fetchLoading={fetching}
          onChange={this.materialDropAdd}
          onSearch={this.props.materialsSearch}
          style={{ width: '300px', marginBottom: '10px' }}
          placeholder='请输入材料编码或名称'
        />
        <Row style={{ fontSize: '15px', fontWeight: '700', background: 'rgb(232, 232, 232)', marginBottom: '10px', padding: '5px' }}>
          <Col span={2} offset={1}>
            共&nbsp;<span>{woMaterialVOs.length}</span>&nbsp;条
          </Col>
          <Col span={6} offset={14}>
            <span>本次出库合计：{outWarehourseTotal}</span>
          </Col>
        </Row>

        <Row>
          <Col span={5} offset={19}>
            <Button className='mr20' loading={saveLoading} onClick={this.saveMaterial}> 保存</Button>
            <Button className='mr20' type='primary' onClick={this.materialIssue}> 发料</Button>
          </Col>
        </Row>
      </Style>
    )
  }
}


const mapStateToProps = (state) => {
  const {
    fetching, woMaterialVOs, woIsId, selectedRowKeys, dropDownTable,
    workBizType, settleType, defaultTypeValue, scEmp, materialDto,
    saveLoading, outWarehourseTotal, issuerId
  } = state.WorksheetIssueCreate
  return {
    fetching, woMaterialVOs, woIsId, selectedRowKeys, dropDownTable,
    workBizType, settleType, defaultTypeValue, scEmp, materialDto,
    saveLoading, outWarehourseTotal, issuerId
  }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, RESET_STATE, getWoMaterialInfo, materialsSearch,
    getDicDataesByCategoryCode, getHrEmpMstrByOrgId, saveWorkOrderMaterial,
    getBasValueByBasCategoryNo
  } = dispatch.WorksheetIssueCreate
  return {
    SET_STATE, RESET_STATE, getWoMaterialInfo, materialsSearch, getBasValueByBasCategoryNo,
    getDicDataesByCategoryCode, getHrEmpMstrByOrgId, saveWorkOrderMaterial
  }
}

const IssueInfos = Form.create()(IssueInfo);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IssueInfos))
