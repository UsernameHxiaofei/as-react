/*
 create By wwj 2018-11-01
 */

import React, { Component, Fragment } from 'react';
import QuickForm from './components/quickForm';
import QuickRight from './components/quickRight';
import AddManAndCar from './components/modal/addManAndCar';
import CustomeUpdate from './components/modal/customeUpdate';
import CarUpdate from './components/modal/carUpdate';
import HistoryUpdate from './components/modal/historyUpdate';
import AddCombos from './components/modal/addCombos';
import AddGroups from './components/modal/addGroups';
import AddWorkHours from './components/modal/addWorkHours';
import AddGoods from './components/modal/addGoods';
import CalculateOrder from './components/modal/calculateOrder';
import UnderStock from './components/modal/underStock';
import Appointment from './components/modal/appointment';
// UI组件
import { Col, } from 'antd'

class QuickOrder extends Component {

  render() {
    return (
      <Fragment>
        <p className='list-page_title'>维修开单</p>
        <Col span={22}>
          <QuickForm />
        </Col>
        <Col span={2}>
          <QuickRight />
        </Col>
        <AddManAndCar />
        <CustomeUpdate />
        <CarUpdate />
        <HistoryUpdate />
        <AddCombos />
        <AddGroups />
        <AddWorkHours />
        <AddGoods />
        <CalculateOrder />
        <UnderStock />
        <Appointment />
      </Fragment>
    );
  };
};

export default QuickOrder;
