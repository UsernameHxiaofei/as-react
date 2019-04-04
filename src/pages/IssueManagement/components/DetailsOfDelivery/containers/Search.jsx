import React, { Component } from 'react';
import { connect } from 'react-redux';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Row, Col } from 'antd';

class Search extends Component {
  componentDidMount = () => {
    if (envRouter) {
      //预发环境
      const data = this.props.location && this.props.location.query;
      if (data) {
        this.props.SET_STATE({
          Search: data.Search,
          TableList: data.TableList,
          id: data.id
        });
      }
    } else {
      menuRouter.ready(req => {
        // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const data = req;
          this.props.SET_STATE({
            Search: data.Search,
            TableList: data.TableList,
            id: data.id
          });
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
      carSeriesName,
      carBrandName,
      carModelName,
      createDate,
      issuedId,
      name
    } = this.props.Search;
    return (
      <div>
        <p className='list-page_title'>工单发料退库确认</p>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <div>发料工单号:{sendingMaterialNo}</div>
            </Col>
            <Col span={5}>
              <div>车牌号:{carPlateNo}</div>
            </Col>
            <Col span={7}>
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
              <Col span={5}>
                <div>服务顾问:{scEmplyoeesName}</div>
              </Col>
              <Col span={7}>
                <div>车型:{carModelName}</div>
                {/* <div>车型:{carBrandName + carSeriesName + carModelName}</div> */}
              </Col>
              <Col span={6}>
                <div>创建时间:{createDate}</div>
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: '25px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <div>退库人:{name}</div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { id, Search } = state.detailsOfDelivery;
  return { id, Search };
};

const mapDispatchToProps = dispatch => {
  const { SET_STATE } = dispatch.detailsOfDelivery;
  return { SET_STATE };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Search));
