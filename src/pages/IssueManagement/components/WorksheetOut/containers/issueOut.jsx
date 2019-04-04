/*
 create By wwj 2018-12-20
 */
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import styled from 'styled-components';
import { Row, Col, Form, Table, Button, } from 'antd'
import { connect } from 'react-redux'
import { env } from '@/config/env/'
const { REDIRECTION_URL: { WorksheetIssue }, HOST } = env
import { getTotal } from '../../../common/components'

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const FormItem = Form.Item
const Style = styled.div`
.mr20 {
  margin-right: 20px;
}
`;
export const formCarLayout = {
  labelCol: {
    sm: { span: 6 },
    md: { span: 2 },
  },
  wrapperCol: {
    sm: { span: 18 },
    md: { span: 20 },
  },
};

class IssueOut extends Component {
  componentDidMount = () => {
    // this.props.findIssuedWarehouseByGoodsDet(this.props.materialsArr);
    // 接收页面跳转的数据
    // window.addEventListener('message', (e) => {
    //   // console.log('出库数据', e.data)
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     this.props.getWoMaterialInfo(data.materialDto.woId);
    //     this.props.SET_STATE({
    //       woId: data.materialDto.woId,
    //       materialsArr: data.materialsArr,
    //       materialsOutArr: data.materialsArr,
    //       materialDto: data.materialDto,
    //       issuerId: data.issuerId,
    //     });
    //     this.props.findIssuedWarehouseByGoodsDet(data.materialsArr);
    //   }
    // });
    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        this.props.getWoMaterialInfo(data.materialDto.woId);
        this.props.SET_STATE({
          woId: data.materialDto.woId,
          materialsArr: data.materialsArr,
          materialsOutArr: data.materialsArr,
          materialDto: data.materialDto,
          issuerId: data.issuerId,
        });
        this.props.findIssuedWarehouseByGoodsDet(data.materialsArr);
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          this.props.getWoMaterialInfo(data.materialDto.woId);
          this.props.SET_STATE({
            woId: data.materialDto.woId,
            materialsArr: data.materialsArr,
            materialsOutArr: data.materialsArr,
            materialDto: data.materialDto,
            issuerId: data.issuerId,
          });
          this.props.findIssuedWarehouseByGoodsDet(data.materialsArr);
        }
      });
    }
  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }
  /* 取消 */
  cancleOut = () => {
    this.props.SET_STATE({ outSuc: false })
    const issueOutId = {
      id: this.props.woId,
      jumpFlag: true,
    };
    // const _data = JSON.stringify(issueOutId);// 转为字符串
    // const autoMessage = {
    //   name: '工单发料信息', index: `WorksheetIssue${Math.random()}`, url: 'WorksheetIssue', resId: 'WorksheetIssue', infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST)
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/WorksheetIssue', query: issueOutId });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        // menuRouter.open(WorksheetIssue, issueOutId, { title: '工单发料信息' });
        menuRouter.close();
      });
    }
  }
  /* 出库 */
  materialOut = () => {
    this.props.woMaterialDelivery();
  }


  render() {
    const { WoMaterialInfoVO, outLoading, materialsArr, materialDto, preWarehourseTotal, outSuc, } = this.props;
    const materialsColumns = [
      { title: '序号', key: 'sortNum', dataIndex: 'sortNum', width: 50, },
      { title: '材料编码', key: 'goodsNo', dataIndex: 'goodsNo', width: 280, },
      { title: '材料名称', key: 'goodsName', dataIndex: 'goodsName', width: 180, },
      { title: '业务类型', key: 'bizTypeName', dataIndex: 'bizTypeName', width: 150, },
      { title: '出库仓库', key: 'warehouseName', dataIndex: 'warehouseName', width: 150, },
      { title: '出库库位', key: 'locationName', dataIndex: 'locationName', width: 150, },
      { title: '销售单价', key: 'price', dataIndex: 'price', width: 120, },
      { title: '数量', key: 'qty', dataIndex: 'qty', width: 80, },
      { title: '已发料数量', key: 'issuedQty', dataIndex: 'issuedQty', width: 120, },
      { title: '未发料数量', key: 'notIssuedQty', dataIndex: 'notIssuedQty', width: 120, },
      { title: '本次出库', key: 'preIssuedQty', dataIndex: 'preIssuedQty', width: 120, },
      { title: '可用库存', key: 'availableInventory', dataIndex: 'availableInventory' },
    ]
    return (
      <Style>
        <p className='list-page_title'>工单发料</p>
        <Form className='form-info-style'>
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='工单号'>
                <span>{WoMaterialInfoVO.woNo}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='车牌号'>
                <span>{WoMaterialInfoVO.carPlateNo}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='VIN'>
                <span>{WoMaterialInfoVO.vin}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='客户名称'>
                <span>{WoMaterialInfoVO.cusName}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='发料单号'>
                <span>{WoMaterialInfoVO.sendingMaterialNo}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='服务顾问'>
                <span>{WoMaterialInfoVO.scEmplyoeesName}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='创建时间'>
                <span>{WoMaterialInfoVO.createDate}</span>
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formLayout} label='领料人'>
                <span>{materialDto.issuerName}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formCarLayout} label='车型' style={{ width: '100%' }}>
                <p style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  title={WoMaterialInfoVO.carModelName}
                >{WoMaterialInfoVO.carModelName}</p>
                {/* >{WoMaterialInfoVO.carBrandName + ' ' + WoMaterialInfoVO.carSeriesName + ' ' + WoMaterialInfoVO.carModelName}</p> */}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <h3>工项信息</h3>
        <Table
          dataSource={materialsArr}
          columns={materialsColumns}
          bordered
          scroll={{ x: 1680, y: 600 }}
          style={{ marginBottom: '10px' }}
          size='small'
          pagination={false} />

        <Row style={{ fontSize: '15px', fontWeight: '700', background: 'rgb(232, 232, 232)', marginBottom: '10px', padding: '5px' }}>
          <Col span={2} offset={1}>
            共&nbsp;<span>{materialsArr.length}</span>&nbsp;条
          </Col>
          <Col span={6} offset={14}>
            <span>本次出库合计：{preWarehourseTotal}</span>
          </Col>
        </Row>
        <Row>
          <Col span={5} offset={19}>
            <Button className='mr20' onClick={this.cancleOut}> 取消</Button>
            <Button className='mr20' type='primary' loading={outLoading} style={{ display: outSuc ? 'none' : 'inline-block' }} onClick={this.materialOut}> 出库</Button>
          </Col>
        </Row>
      </Style>
    )
  }
}


const mapStateToProps = (state) => {
  const { materialsArr, materialsOutArr, WoMaterialInfoVO, materialDto, preWarehourseTotal, outLoading, woId, issuerId, outSuc } = state.WorksheetIssueCreate
  return { materialsArr, materialsOutArr, WoMaterialInfoVO, materialDto, preWarehourseTotal, outLoading, woId, issuerId, outSuc }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, RESET_STATE, woMaterialDelivery, getWoMaterialInfo, findIssuedWarehouseByGoodsDet, } = dispatch.WorksheetIssueCreate
  return { SET_STATE, RESET_STATE, woMaterialDelivery, getWoMaterialInfo, findIssuedWarehouseByGoodsDet, }
}

const IssueOuts = Form.create()(IssueOut);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IssueOuts))
