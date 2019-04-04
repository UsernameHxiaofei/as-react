import React, { Component } from 'react';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Table, Button, message, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { workOrderItemInvReturn } from '@/services/getData';
import { env } from '../../../../../config/env/';
const {
  REDIRECTION_URL: { ReturnOfWorkOrders },
  HOST
} = env;

class Tab extends Component {
  componentDidMount = () => {
    // window.addEventListener('message', (e) => {
    //   if (e.data) {
    //     const data = JSON.parse(e.data)
    //     this.props.SET_STATE({
    //       Search: data.Search,
    //       TableList: data.TableList,
    //       id: data.id
    //     })
    //   }
    // })
    
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

  async WorkOrderItemInvReturn(obj) {
    const res = await workOrderItemInvReturn(obj);
    if (res.success) {
      message.success('退料成功');
      this.props.SET_STATE({
        show: 'none',
        loading: false
      });
    } else {
      message.error(res.msg);
    }
  }

  back = () => {
    const data = {
      id: this.props.id,
      jumpFlag: true
    };
    // const _data = JSON.stringify(data)
    // const autoMessage = {
    //   name: '发料退库信息', index: `orderEdit${Math.random()}`, url: 'ReturnOfWorkOrders', resId: 'aaeditOrder', infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST)

    if (envRouter) {
      //预发环境
      this.props.history.push({ pathname: '/ReturnOfWorkOrders', query: data });
    } else {
      menuRouter.ready(_ => {
        // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(ReturnOfWorkOrders, data, { title: '发料退库信息' });
      });
    }
  };

  Tback = () => {
    this.props.SET_STATE({
      loading: true
    });
    // 拿到数据掉接口成功后返回跳页面到退料
    let arr = [];
    this.props.TableList.map((item, index) => {
      arr.push({
        id: item.id,
        relQty: item.deliveryNumber
      });
    });
    let obj = {
      doId: this.props.Search.sendingMaterialId, //发料单id
      doNo: this.props.Search.sendingMaterialNo, //发料单编码
      issuedId: this.props.Search.issuedId, // 退库人id
      issuedName: this.props.Search.name, //退库人姓名
      woId: this.props.Search.woId, //工单id
      workOrderItemInvVOList: arr
    };
    this.WorkOrderItemInvReturn(obj);
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

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'name'
      },
      {
        title: '配件编码',
        dataIndex: 'materialNo',
        key: 'age'
      },
      {
        title: '配件名称',
        dataIndex: 'materialName',
        key: 'address'
      },
      {
        title: '维修类型',
        dataIndex: 'bizTypeName',
        key: 'type'
      },
      {
        title: '原厂编码',
        dataIndex: 'mfgGoodsNo',
        key: 'number'
      },
      {
        title: '销售单价',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: '数量',
        dataIndex: 'qty',
        key: 'num'
      },
      {
        title: '已出库数量',
        dataIndex: 'issuedQty',
        key: 'goNum'
      },
      {
        title: '本次退料',
        dataIndex: 'deliveryNumber',
        key: 'this'
      }
    ];

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
        <div style={{ marginTop: '20px' }}>
          <Table dataSource={this.props.TableList} columns={columns} pagination={false} bordered />
          <div style={{ marginTop: '20px' }}>共{this.props.TableList.length}条</div>
          <div style={{ float: 'right', marginTop: '20px', marginRight: '40px' }}>
            <Button onClick={this.back} style={{ marginRight: '40px' }}>
              取消
            </Button>
            <Button
              style={{ display: this.props.show }}
              loading={this.props.loading}
              onClick={this.Tback}
              type='primary'
            >
              退料
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { id, Search, TableList, show, loading } = state.detailsOfDelivery;
  return { id, Search, TableList, show, loading };
};

const mapDispatchToProps = dispatch => {
  const { SET_STATE } = dispatch.detailsOfDelivery;
  return { SET_STATE };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Tab));
