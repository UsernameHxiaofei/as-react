import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';

class Search extends Component {
  componentDidMount = () => {
    // this.props.GetWoMaterialInfo({ woId: '044972f1104c4834b6099aa77818b4cd', sendingMaterial: true });
    if (envRouter) {
      //预发环境
      const data = this.props.location.query;
      if (data) {
        if (data.id) {
          let obj = { ...this.props.Obj, woId: data.id };
          this.props.SET_STATE({
            Obj: { ...this.props.Obj, woId: data.id }
          });
          this.props.GetWoMaterialInfo(obj);
        }
      }
    } else {
      menuRouter.ready(req => {
        // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          if (data.id) {
            let obj = { ...this.props.Obj, woId: data.id };
            this.props.SET_STATE({
              Obj: { ...this.props.Obj, woId: data.id }
            });
            this.props.GetWoMaterialInfo(obj);
          }
        }
      });
    }
  };

  render() {
    const {
      sendingMaterialNo,
      carPlateNo,
      vin,
      cusName,
      woNo,
      scEmplyoeesName,
      carBrandName,
      carSeriesName,
      carModelName,
      createDate
    } = this.props.Search;
    return (
      <div>
        <p className='list-page_title'>工单发料退库</p>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <div>发料工单号:{sendingMaterialNo}</div>
            </Col>
            <Col span={4}>
              <div>车牌号:{carPlateNo}</div>
            </Col>
            <Col span={8}>
              <div>VIN:{vin}</div>
            </Col>
            <Col span={6}>
              <div>客户姓名:{cusName}</div>
            </Col>
          </Row>
          <div style={{ marginTop: '25px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <div>工单单号:{woNo}</div>
              </Col>
              <Col span={4}>
                <div>服务顾问:{scEmplyoeesName}</div>
              </Col>
              <Col span={8}>
                <div>车型:{carModelName}</div>
                {/* <div>车型:{carBrandName + " " + carSeriesName + ' ' + carModelName}</div> */}
              </Col>
              <Col span={6}>
                <div>创建时间:{createDate}</div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { Obj, Search } = state.returnofworkorders;
  return { Obj, Search };
};

const mapDispatchToProps = dispatch => {
  const { GetWoMaterialInfo, SET_STATE } = dispatch.returnofworkorders;
  return { GetWoMaterialInfo, SET_STATE };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Search));
