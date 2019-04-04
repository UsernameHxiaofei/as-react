import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu, Tabs, Icon, Button, message } from 'antd';
import { getIndexMenu, logOut } from '../../services/getData';
import { dispatch } from '@/store';
import IndexPage from '@/pages/IndexPage';

import QuickOrder from '@/pages/QuickOrder'; // 快捷开单
import AfterSaleSystem from '@/pages/AfterSaleSystem'; //售后系统
import MaintenanceHistory from '@/pages/MaintenanceHistory'; //维修历史
import ManagementOfWorkOrder from '@/pages/ManagementOfWorkOrder'; //工单管理
import ValuationManagement from '@/pages/ValuationManagement'; //估价单
import ViewValuationList from '@/pages/ViewValuationList'; //查看估计单
import AddEvaluationOrder from '@/pages/AddEvaluationOrder'; //新增估价单
import ConstructionOrderManagement from '@/pages/ConstructionOrderManagement'; //施工单管理
import Team from '@/pages/Team'; //班组
import TechnicianTeam from '@/pages/TechnicianTeam'; //技师
import StationManagement from '@/pages/StationManagement'; //工位管理
import TechnicianStation from '@/pages/TechnicianStation'; //工位管理
import LookQueryWork from '@/pages/LookQueryWork'; //查看快捷开单
import ClientBoard from '@/pages/ClientBoard'; //客户看板
//工单发料,
import {
  WorksheetIssue,
  WorksheetOut,
  DetailsOfDelivery,
  ReturnOfWorkOrders,
  DeliveryReturns,
  SendMaterialOne,
  Historical
} from '@/pages/IssueManagement';
// 前装工单,
import { FrontAssignOrder, BeforeWork, LookBeforeWork } from '@/pages/FrontAssign';
// 装潢工单
import { DecorationWorkOrderManagement, DecorationOrder ,LookDecorationWorkOrdeManagement} from '@/pages/DecorationWorkOrder'


const mapStateToProps = (rootState, ownProps) => ({
  demo: rootState.demo
});

const Root = styled.div`
  header {
    text-align: center;
    padding: 24px 0;
    > * {
      padding: 12px 0;
    }
    h4 {
      color: #999;
    }
    .logo {
      height: 200px;
    }
  }
  .ant-layout-header {
    background-color: rgb(53, 44, 116);
  }
  .ant-layout {
    background-color: #ffffff;
  }
`;

const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;

const TabPane = Tabs.TabPane;

/* window.addEventListener('message',function(e){
      if(e.origin=='http://114.55.2.156:7023'){
    		return
    	}
    	if(e.data=='28006'){
    		location.href = 'http://114.55.2.156:7023/#/login'
    	}
    }) */
class HomePage extends Component {
  rootSubmenuKeys = ['sub1'];
  constructor(props) {
    super(props);

    const tabsList = [
      {
        title: '首页',
        content: '首页',
        key: '0',
        closable: false
      }
    ];
    const menuList = [
      {
        firstLevelMenu: '售后管理',
        index: 'sub1',
        icon: 'appstore',
        type: 'menuList',
        childrenMenu: [
          {
            name: '估价单管理',
            index: 'sub2',
            icon: 'appstore',
            type: 'menuList',
            childrenMenu: [
              {
                name: '估价单管理',
                index: '11',
                type: 'menu',
                component: <ValuationManagement />
              },
              {
                name: '新增估价单',
                index: '12',
                type: 'menu',
                component: <AddEvaluationOrder />
              },
              {
                name: '查看估价单',
                index: '13',
                type: 'menu',
                component: <ViewValuationList />
              }
            ]
          },
          // {
          //   name: '客户看板',
          //   index: '76',
          //   type: 'menu',
          //   component: <ClientBoard />
          // },
          {
            name: '维修开单',
            index: '2',
            type: 'menu',
            component: <QuickOrder />
          },
          {
            name: '查看维修开单',
            index: '22',
            type: 'menu',
            component: <LookQueryWork />
          },
          {
            name: '工单管理',
            index: '3',
            type: 'menu',
            component: <ManagementOfWorkOrder />
          },
          {
            name: '施工管理',
            index: '4',
            type: 'menu',
            component: <ConstructionOrderManagement />
          },
          {
            name: '发料管理',
            index: 'sub3',
            icon: 'appstore',
            type: 'menuList',
            childrenMenu: [
              {
                name: '发料管理',
                index: '51',
                type: 'menu',
                component: <SendMaterialOne />
              },
              {
                name: '工单发料',
                index: '52',
                type: 'menu',
                component: <WorksheetIssue />
              },
              {
                name: '工单发料出库',
                index: '53',
                type: 'menu',
                component: <WorksheetOut />
              },
              {
                name: '发料退库管理',
                index: '54',
                type: 'menu',
                component: <DeliveryReturns />
              },
              {
                name: '工单退料',
                index: '56',
                type: 'menu',
                component: <ReturnOfWorkOrders />
              },
              {
                name: '工单发料退库',
                index: '55',
                type: 'menu',
                component: <DetailsOfDelivery />
              },
              {
                name: '发料历史',
                index: '57',
                type: 'menu',
                component: <Historical />
              }
            ]
          },
          {
            name: '维修历史',
            index: '6',
            type: 'menu',
            component: <MaintenanceHistory />
          },
          {
            name: '售后系统设置',
            index: 'sub4',
            icon: 'appstore',
            type: 'menuList',
            childrenMenu: [
              {
                name: '售后服务',
                index: '71',
                type: 'menu',
                component: <AfterSaleSystem />
              },
              {
                name: '班组管理',
                index: '72',
                type: 'menu',
                component: <Team />
              },
              {
                name: '工位管理',
                index: '73',
                type: 'menu',
                component: <StationManagement />
              },
              {
                name: '技师班组',
                index: '74',
                type: 'menu',
                component: <TechnicianTeam />
              },
              {
                name: '技师工位',
                index: '75',
                type: 'menu',
                component: <TechnicianStation />
              }
            ]
          },
          {
            name: '前装管理',
            index: 'sub5',
            icon: 'appstore',
            type: 'menuList',
            childrenMenu: [
              {
                name: '前装工单',
                index: '81',
                type: 'menu',
                component: <FrontAssignOrder />
              },
              {
                name: '前装工单管理',
                index: '82',
                type: 'menu',
                component: <BeforeWork />
              },
              {
                name: '查看前装工单',
                index: '83',
                type: 'menu',
                component: <LookBeforeWork />
              }
            ]
          },
          {
            name: '装潢管理',
            index: 'sub6',
            icon: 'appstore',
            type: 'menuList',
            childrenMenu: [
              {
                name: '装潢工单',
                index: '91',
                type: 'menu',
                component: <DecorationOrder />,
              },
              {
                name: '装潢工单管理',
                index: '92',
                type: 'menu',
                component: <DecorationWorkOrderManagement />,
              },
              {
                name: '查看装潢工单',
                index: '93',
                type: 'menu',
                component: <LookDecorationWorkOrdeManagement />,
              },
            ]
          }
        ]
      }
    ];
    this.state = {
      activeKey: tabsList[0].key,
      tabsList,
      menuList,
      openKeys: ['sub1'],
      selectedKeys: [],
      userNickName: ''
    };
  }

  componentWillMount() {
    this.setState({
      userNickName: localStorage.getItem('userNickName') || ''
    });
    if (this.props.location.state) {
      window.location.reload(true);
    }
    // if(localStorage.getItem('token')==undefined||localStorage.getItem('token')=='undefined'){
    // 	  location.href = 'http://114.55.2.156:7023/#/login'
    // }
    if (localStorage.data) {
      const str = localStorage.data;
      const data = JSON.parse(str);
      const menus = [];
      data.forEach((item, index) => {
        menus.push({
          firstLevelMenu: item.resName,
          index: `sub${index}`,
          icon: 'appstore',
          childrenMenu: this.getMenuChild(item.children)
        });
      });
      this.setState({
        menuList: menus
      });
    }
  }
  getMenuChild = childList => {
    const child = [];
    if (childList && childList.length > 0) {
      childList.forEach((item, index) => {
        if (item.resType == 'menu') {
          child.push({
            name: item.resName,
            index: item.resNo,
            type: item.resType,
            component: <IndexPage url={item.resUri} resId={`iframe${item.resNo}`} />
          });
        } else {
          child.push({
            name: item.resName,
            index: item.resNo,
            type: item.resType,
            childrenMenu: this.getMenuChild(item.children)
          });
        }
      });
    }
    return child;
  };
  onChange = activeKey => {
    dispatch.demo.ACTIVECHANGE(activeKey);

    /*
		this.setState({
			  activeKey
		});

		this.setState({
			  selectedKeys:[activeKey]
		}); */
  };
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };
  add = (item, e) => {
    dispatch.demo.ADD_TABLIST(item);
  };
  remove = targetKey => {
    dispatch.demo.REMOVE_TABSLIST(targetKey);
  };
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({
        openKeys
      });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };
  loginOut = () => {
    // logOut().then((res) => {
    //   console.log(res, '登出');
    //   if (res.success) {
    //     message.success('退出成功');
    //     localStorage.data = '';
    //     localStorage.token = '';
    //     localStorage.loginInfo = '';
    //     localStorage.userNickName = '';
    //     location.href = 'http://114.55.2.156:7023/#/login';
    //   }
    // });
  };

  render() {
    const {
      demo: { tabsList, selectedKeys, activeKey }
    } = this.props;
    return (
      <Root>
        <Layout>
          <Header>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: '#fff', fontSize: '1.2rem' }}>欢迎来到SAAS系统</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ color: '#fff', fontSize: '1.2rem' }}>
                  <span style={{ fontSize: '1rem' }}>你好,</span>
                  {this.state.userNickName}
                  <span style={{ fontSize: '1rem', marginRight: '3rem' }}>欢迎进入SAAS系统</span>
                </div>
                <Button icon='poweroff' onClick={this.loginOut}>
                  注销
                </Button>
              </div>
            </div>
          </Header>
          <Layout>
            <Sider>
              <Menu
                mode='inline'
                openKeys={this.state.openKeys}
                selectedKeys={selectedKeys}
                onOpenChange={this.onOpenChange}
                style={{ height: '100%', borderRight: 0, borderRight: '1px solid #ccc' }}
              >
                {this.state.menuList.map((menu, index) => (
                  <SubMenu
                    key={menu.index}
                    title={
                      <span>
                        <Icon type={menu.icon} />
                        <span>{menu.firstLevelMenu}</span>
                      </span>
                    }
                  >
                    {menu.childrenMenu.map((item, index) => {
                      if (item.type == 'menu') {
                        return (
                          <Menu.Item key={item.index} onClick={this.add.bind(event, item)}>
                            {item.name}
                          </Menu.Item>
                        );
                      }
                      return (
                        <SubMenu
                          key={item.index}
                          title={
                            <span>
                              <span>{item.name}</span>
                            </span>
                          }
                        >
                          {item.childrenMenu.map((itemChild, index) => (
                            <Menu.Item key={itemChild.index} onClick={this.add.bind(event, itemChild)}>
                              {itemChild.name}
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      );
                    })}
                  </SubMenu>
                ))}
              </Menu>
            </Sider>
            <Layout>
              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  margin: 0,
                  minHeight: 280
                }}
              >
                <Tabs onChange={this.onChange} activeKey={activeKey} type='editable-card' onEdit={this.onEdit} hideAdd>
                  {tabsList.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                      {pane.content}
                    </TabPane>
                  ))}
                </Tabs>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Root>
    );
  }
}
export default connect(mapStateToProps)(HomePage);
