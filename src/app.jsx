import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import history from '@/history';
import IndexPage from '@/pages/IndexPage';
import HomePage from '@/pages/HomePage';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import { withRouter } from 'react-router';

import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import AfterSaleSystem from '@/pages/AfterSaleSystem'; //售后设置
import ManagementOfWorkOrder from '@/pages/ManagementOfWorkOrder'; //工单管理
import QuickOrder from '@/pages/QuickOrder'; //快捷开单
import MaintenanceHistory from '@/pages/MaintenanceHistory'; //维修历史
import AddEvaluationOrder from '@/pages/AddEvaluationOrder'; //新增估价单

import ValuationManagement from '@/pages/ValuationManagement';
import ViewValuationList from '@/pages/ViewValuationList';
import ConstructionOrderManagement from '@/pages/ConstructionOrderManagement';//施工单管理
import Team from '@/pages/Team';//班组
import TechnicianTeam from '@/pages/TechnicianTeam';//技师
import StationManagement from '@/pages/StationManagement';//工位管理
import TechnicianStation from '@/pages/TechnicianStation';//技师工位
import LookQueryWork from '@/pages/LookQueryWork';//技师工位
import {
  WorksheetIssue, DetailsOfDelivery, ReturnOfWorkOrders,
  DeliveryReturns, SendMaterialOne, Historical,WorksheetOut
} from '@/pages/IssueManagement';//发料管理
import {
  FrontAssignOrder,BeforeWork,LookBeforeWork
} from '@/pages/FrontAssign'; //前装管理
import {
  DecorationOrder,DecorationWorkOrderManagement,LookDecorationWorkOrdeManagement,
} from '@/pages/DecorationWorkOrder' //装潢管理

// 推荐使用 styled-components 写 CSS 样式
// 如果需要注入全局 CSS 样式，使用 injectGlobal 方法
injectGlobal`
  html, body {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
/* const store = createStore((state)=>{
	 		return {userName:localStorage.getItem('userName')}
}) */
class App extends Component {
  componentWillMount() {
    const ele = document.getElementById('ipl-progress-indicator');
    if (ele) {
      ele.classList.add('available');
      setTimeout(() => {
        ele.outerHTML = '';
      });
    }
  }
  render() {
    return (
      <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/AfterSaleSystem' component={AfterSaleSystem} />
          <Route path='/ManagementOfWorkOrder' component={ManagementOfWorkOrder} />
          <Route path='/QuickOrder' component={QuickOrder} />
          <Route path='/MaintenanceHistory' component={MaintenanceHistory} />
          <Route path='/ValuationManagement' component={ValuationManagement} />
          <Route path='/ViewValuationList' component={ViewValuationList} />
          <Route path='/AddEvaluationOrder' component={AddEvaluationOrder} />
          <Route path='/ConstructionOrderManagement' component={ConstructionOrderManagement} />
          <Route path='/Team' component={Team} />
          <Route path='/TechnicianTeam' component={TechnicianTeam} />
          <Route path='/StationManagement' component={StationManagement} />
          <Route path='/TechnicianStation' component={TechnicianStation} />
          <Route path='/WorksheetIssue' component={WorksheetIssue} />
          <Route path='/DetailsOfDelivery' component={DetailsOfDelivery} />
          <Route path='/ReturnOfWorkOrders' component={ReturnOfWorkOrders} />
          <Route path='/DeliveryReturns' component={DeliveryReturns} />
          <Route path='/SendMaterialOne' component={SendMaterialOne} />
          <Route path='/Historical' component={Historical} />
          <Route path='/WorksheetOut' component={WorksheetOut} />
          <Route path='/FrontAssignOrder' component={FrontAssignOrder} />
          <Route path='/BeforeWork' component={BeforeWork} />
          <Route path='/LookBeforeWork' component={LookBeforeWork} />
          <Route path='/LookQueryWork' component={LookQueryWork} />
          <Route path='/DecorationOrder' component={DecorationOrder} />
          <Route path='/DecorationWorkOrderManagement' component={DecorationWorkOrderManagement} />
          <Route path='/LookDecorationWorkOrdeManagement' component={LookDecorationWorkOrdeManagement} />
          <Redirect to='/' />
        </Switch>
      </Router>
      </LocaleProvider>
    );
  }
}

export default hot(module)(App);



