/*
 create By wwj 2018-12-20
 */
import React, { Component } from 'react'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import styled from 'styled-components';
import { Row, Col, Form, Table, Spin, } from 'antd'
import { connect } from 'react-redux'
import { env } from '@/config/env/'
const { REDIRECTION_URL: { JupOrder }, HOST } = env

// 样式
import '@/styles'; //全局样式
import { colLayout, gutter, formLayout } from '@/shared/config'; //组件样式
const FormItem = Form.Item
const Style = styled.div`

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

class IssueInfo extends Component {

  componentDidMount = () => {
    // this.props.getWoMaterialInfo("7e5661b52ef94ea69620b6830c3d9a17") /* ---- */
    // 接收页面跳转的数据
    // window.addEventListener('message', (e) => {
    //   // console.log(e.data)
    //   if (e.data) {
    //     const data = JSON.parse(e.data);
    //     this.props.SET_STATE({ woId: data.id });
    //     this.props.getWoMaterialInfo(data.id);
    //   }
    // });
    if (envRouter) { //预发环境
      const data = this.props.location.query;
      if (data) {
        this.props.SET_STATE({ woId: data.id });
        this.props.getWoMaterialInfo(data.id);
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          this.props.SET_STATE({ woId: data.id });
          this.props.getWoMaterialInfo(data.id);
        }
      });
    }
  }

  componentWillUnmount = () => {
    this.props.RESET_STATE()
  }



  render() {
    const {
      WoMaterialInfoVO, workItemInfos, issuseLoading,
    } = this.props
    const workColumns = [
      { title: '序号', key: 'sortNum', dataIndex: 'sortNum', width: 50, },
      { title: '工项编码', key: 'workItemNo', dataIndex: 'workItemNo', width: 280, },
      { title: '工项名称', key: 'workItemName', dataIndex: 'workItemName', width: 180, },
      { title: '维修类型', key: 'bizTypeName', dataIndex: 'bizTypeName', width: 150, },
      { title: '金额', key: 'amount', dataIndex: 'amount', width: 120, },
      { title: '折扣率', key: 'discount', dataIndex: 'discount', width: 80, },
      { title: '应收金额', key: 'receivableAmount', dataIndex: 'receivableAmount', width: 120, },
      { title: '优惠金额', key: 'reduceAmount', dataIndex: 'reduceAmount', width: 120, },
      { title: '施工状态', key: 'workStatusName', dataIndex: 'workStatusName' },
    ]
    return (
      <Style>
        <Spin spinning={issuseLoading} tip='加载中'>
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
            dataSource={workItemInfos}
            columns={workColumns}
            bordered
            scroll={{ x: 1280, y: 300 }}
            size='small'
            pagination={false} />
        </Spin>
      </Style>
    )
  }
}


const mapStateToProps = (state) => {
  const { WoMaterialInfoVO, workItemInfos, issuseLoading, woId } = state.WorksheetIssueCreate
  return { WoMaterialInfoVO, workItemInfos, issuseLoading, woId }
}

const mapDispatchToProps = (dispatch) => {
  const { SET_STATE, RESET_STATE, getWoMaterialInfo, } = dispatch.WorksheetIssueCreate
  return { SET_STATE, RESET_STATE, getWoMaterialInfo, }
}

const IssueInfos = Form.create()(IssueInfo);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(IssueInfos))
