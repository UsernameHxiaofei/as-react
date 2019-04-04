import React from 'react';
import ReactDOM from 'react-dom';
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import moment from 'moment';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
// import Url from '../../config/tabsUrl';
import { Form, Row, Col, Table, Button, DatePicker, Collapse, Icon, Select, Input, Divider, Pagination, Modal, Spin, message, InputNumber } from 'antd';
import { querylistWorkOrder, getBasValueByBasCategoryNo, finishWorkOrder, reworkWorkOrder, getDicDataByCategoryCode, getWorkOrderDeposit, cancelWorkOrderSettlement, pushWorkOrderDeposit, invalidWorkOrder } from '../../services/getData';
import { env, } from '@/config/env/';
import { isNull } from 'util';
const { REDIRECTION_URL: { LookQueryWork, QuickOrder }, HOST } = env;
const { RangePicker } = DatePicker;
const Panel = Collapse.Panel;
import { searchFormCreate } from '@/shared/hoc'
class ManagementOfWorkOrder extends React.Component {
  constructor(props) {
    super(props);
    // 初始化数据
    this.state = {
      // ID:'',
      Time: [],
      endTime: [],
      DJconfirmLoading: false, //定金loading
      ZFconfirmLoading: false, //作废loading
      QXconfirmLoading: false,
      WGvisible: false,
      display: 'none',
      isDown: 'up',
      woId: '',
      Id: '',
      Moneyvisible: false, // 定金推送
      ZFvisible: false,
      printVisible: false, //打印模态框
      loading: true,
      Mathvisible: false,
      Mathsvisible: false,
      moneyRecord: '',
      moneySendnum: {
        woId: '',
        deposit: '',
      },
      basemoney: 0,
      // 列表查询参数
      data: {
        workOrderStartDate: '', // 开单日期筛选开始时间(yyyy-mm-dd),
        workOrderEndDate: '', // 开单日期筛选结束时间(yyyy-mm-dd),
        settleateStartDate: '', // 结算日期开始时间(yyyy-mm-dd),
        settleateEndDate: '', // 结算日期结束时间(yyyy-mm-dd),
        bizTypeCode: '', // 业务类型Code,
        woStatusCode: '', // 单据状态Code,
        woNo: '', // 工单号,
        vin: '', // 车架号,
        refWoNo: '', // 关联单号,
        carPlateNo: '', // 车牌号,
        pageSize: 10, // 每页记录数,
        currentIndex: 1, // 当前页(不能为0)
      },
      bizTypeodelist: [], // 业务类型Code列表
      statusList: [], // 单据状态列表
      sourceData: [],
      pagetotal: 0, // 总页数
      pagecurrent: 1, // 当前页
      qxObj: {
        vin: '',
        carNumber: '',
        workNumber: '',
      },
    };
  }

  componentDidMount() {
    // 列表接口查询
    this.QuerylistWorkOrder(this.state.data)

    // 业务类型查询（需要改）
    // getDicDataByCategoryCode({ code: '7140' }).then((res) => {
    //   console.log(res)
    //   if (res.success) {
    //     res.data.map((item, index) => {
    //       item.key = index;
    //     });
    //     this.setState({
    //       bizTypeodelist: res.data,
    //     });
    //   }
    // })


    getBasValueByBasCategoryNo({ categoryNo: 'AS1000' }).then(res => {
      if (res.success) {
        // console.log(res.data)
        this.setState({
          bizTypeodelist: res.data
        }, () => {
          this.state.bizTypeodelist.map((item, index) => {
            item['key'] = index
          })
        })
      }
    })

    // 单据状态
    getDicDataByCategoryCode({ code: '7020' }).then((res) => {
      if (res.success) {
        res.data.map((item, index) => {
          item.key = index;
        });
        this.setState({
          statusList: res.data,
        });
      }
    });

    // 获取收款状态
    getDicDataByCategoryCode({ code: '4000' }).then((res) => {
      // console.log(res);
    });
  }



  QuerylistWorkOrder = (data) => {
    querylistWorkOrder(data).then((res) => {
      if (res.success) {
        // console.log(res.data)
        res.data.items.map((item, index) => {
          item.key = index;
        });
        this.setState({
          sourceData: res.data.items,
          pagetotal: res.data.totalNumber,
          loading: false,
        });
      }
    });
  }



  // 开单时间改变
  kdChange = (date, dateString) => {
    // console.log(date, dateString)
    const data = this.state.data;
    if (date.length <= 0) {
      this.setState({
        data: Object.assign({}, data, { workOrderStartDate: '', workOrderEndDate: '' }),
      });
    } else {
      const reportToOemStartTime = moment(date[0]._d).format('YYYY-MM-DD');
      const reportToOemEndTime = moment(date[1]._d).format('YYYY-MM-DD');
      this.setState({
        data: Object.assign({}, data, { workOrderStartDate: reportToOemStartTime, workOrderEndDate: reportToOemEndTime }),
      });
    }
  }
  // 结算日期改变
  jsChange = (date, dateString) => {
    const data = this.state.data;
    if (date.length <= 0) {
      this.setState({
        data: Object.assign({}, data, { settleateStartDate: '', settleateEndDate: '' }),
      });
    } else {
      const reportToOemStartTime = moment(date[0]._d).format('YYYY-MM-DD');
      const reportToOemEndTime = moment(date[1]._d).format('YYYY-MM-DD');
      this.setState({
        data: Object.assign({}, data, { settleateStartDate: reportToOemStartTime, settleateEndDate: reportToOemEndTime, getDicDataByCategoryCode }),
      });
    }
  }
  // 业务类型改变
  YWChange = (value) => {
    console.log(value);
    const data = this.state.data;
    if (value == undefined) {
      this.setState({
        data: Object.assign({}, data, { bizTypeCode: '' }),
      });
    } else {
      this.setState({
        data: Object.assign({}, data, { bizTypeCode: value }),
      });
    }
  }
  // 单据状态改变
  statusChange = (value) => {
    const data = this.state.data;
    if (value == undefined) {
      this.setState({
        data: Object.assign({}, data, { woStatusCode: '' }),
      });
    } else {
      this.setState({
        data: Object.assign({}, data, { woStatusCode: value }),
      });
    }
  }
  // 工单号改变
  woNoChange = (e) => {
    const data = this.state.data;
    this.setState({
      data: Object.assign({}, data, { woNo: e.target.value }),
    });
  }
  // 关联单号改变
  refWoNoChange = (e) => {
    const data = this.state.data;
    this.setState({
      data: Object.assign({}, data, { refWoNo: e.target.value }),
    });
  }

  // 车牌号改变的事件
  carPlateNoChange = (e) => {
    const data = this.state.data;
    this.setState({
      data: Object.assign({}, data, { carPlateNo: e.target.value }),
    });
  }

  // vin改变的事件
  vinChange = (e) => {
    const data = this.state.data;
    this.setState({
      data: Object.assign({}, data, { vin: e.target.value }),
    }, () => {
      console.log(this.state.data);
    });
  }


  // 更多帅选条件的显示隐藏
  moreChoose = () => {
    this.setState({
      isDown: 'down',
    });
    if (this.state.display == 'none') {
      this.setState({
        display: 'block',
        isDowm: 'down',
      });
    } else {
      this.setState({
        display: 'none',
        isDown: 'up',
      });
    }
  }

  // 打印关闭事件
  printCancel = () => {
    this.setState({
      printVisible: false
    })
  }
  // 打印模态框显示
  dyShow = (record) => {
    let id = record.id
    this.setState({
      printVisible: true,
      Id: id
    })
  }

  // 完工事件
  ready = (record) => {
    // console.log(record)
    let id = record.id
    // 发送请求
    finishWorkOrder({ woId: id }).then(res => {
      if (res.success) {
        message.success('完工成功')
        // 重新查一遍
        this.QuerylistWorkOrder(this.state.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  // 返工事件
  back = (record) => {
    let id = record.id
    reworkWorkOrder({ woId: id }).then(res => {
      if (res.success) {
        message.success('返工成功')
        // 重新查一遍
        this.QuerylistWorkOrder(this.state.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  // 定金推送
  moneySend = (record) => {
    const moneySendnum = this.state.moneySendnum;
    const id = record.id;
    this.setState({
      moneyRecord: record,
      Moneyvisible: true,
      moneySendnum: Object.assign({}, moneySendnum, { woId: id }),
    }, () => {
      // 发送请求获取工单定金如果请求成功就拿到定金复制给basemoney展示在页面上
      getWorkOrderDeposit({ woId: this.state.moneySendnum.woId }).then((res) => {
        if (res.success) {
          if (res.data) {
            this.setState({
              basemoney: res.data.toFixed(2),
            });
          } else {
            this.setState({
              basemoney: 0.00, // 如果没有就显示0
            });
          }
        }
      });
    });
  }
  // 查看事件
  looked = (record) => {
    const data = {
      id: record.id,
      jumpFlag: true,
    };
    // const _data = JSON.stringify(data);// 转为字符串
    // const autoMessage = {
    //   name: '查看维修工单', index: `Look${record.id}`, url: 'LookQueryWork', resId: `${record.id}`, infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST);
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/LookQueryWork', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(LookQueryWork, data, { title: '查看维修工单' });
      });
    }

  }

  // 编辑事件
  editd = (record) => {
    // console.log(record.cusId)
    const data = {
      id: record.id,
      type: 'editEo',
      cusId: record.cusId,
      jumpFlag: true,
      jy: false
    };
    // const _data = JSON.stringify(data);
    // const autoMessage = {
    //   name: '编辑工单', index: `orderEdit${record.id}`, url: 'QuickOrder', resId: 'editOrder', infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST);
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/QuickOrder', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(QuickOrder, data, { title: '编辑工单' });
      });
    }
  }

  // 复制工单事件
  croy = (record) => {
    const data = {
      id: record.id,
      type: 'copy',
      cusId: record.cusId,
      jumpFlag: true,
      jy: false
    };
    // const _data = JSON.stringify(data);
    // const autoMessage = {
    //   name: '复制工单', index: `copyEdit${record.id}`, url: 'QuickOrder', resId: 'copyOrder', infoData: _data,
    // };
    // window.parent.postMessage(autoMessage, HOST); 
    if (envRouter) { //预发环境
      this.props.history.push({ pathname: '/QuickOrder', query: data });
    } else {
      menuRouter.ready(_ => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        menuRouter.open(QuickOrder, data, { title: '复制工单' });
      });
    }
  }


  // 定金推送确定事件
  MoneyhandleOk = () => {
    let _th = this
    if (_th.state.moneySendnum.deposit == undefined || _th.state.moneySendnum.deposit <= 0) {
      // message.error('请输入本次订金');
      // return false;
      message.warning('请输入大于0的订金金额');
      const moneySendnum = this.state.moneySendnum;
      this.setState({
        moneySendnum: Object.assign({}, moneySendnum, { deposit: '' }),
      });
      return false;
    }
    this.setState({
      DJconfirmLoading: true
    }, () => {
      // 发送请求
      // console.log(this.state.moneySendnum)
      pushWorkOrderDeposit(this.state.moneySendnum).then((res) => {
        if (res.success) {
          // 请求成功提示用户成功关闭模态框清空里面的字段
          message.success('操作成功');
          this.setState({
            Moneyvisible: false,
            basemoney: '',
            moneySendnum: {},
            DJconfirmLoading: false
          }, () => {
            _th.searchList()
          })

        } else {
          message.error(res.msg);
          this.setState({
            Moneyvisible: false,
            basemoney: '',
            moneySendnum: {},
            DJconfirmLoading: false
          })
        }
      });
    })

  }

  // 定金推送取消事件
  MoneyhandleCancel = () => {
    let moneySendnum = this.state.moneySendnum
    this.setState({
      Moneyvisible: false,
      moneySendnum: Object.assign({}, moneySendnum, { deposit: '' })
    });
  }

  // 本次定金改变事件
  moneyChange = (value) => {
    const moneySendnum = this.state.moneySendnum;
    this.setState({
      moneySendnum: Object.assign({}, moneySendnum, { deposit: value }),
    }, () => {
      console.log(this.state.moneySendnum.deposit)
    });
  }

  // 失去焦点的事件
  Blur = () => {
    // if (this.state.moneySendnum.deposit <= 0) {
    //   message.warning('请输入大于0的金额')
    //   let moneySendnum = this.state.moneySendnum
    //   this.setState({
    //     moneySendnum:Object.assign({},moneySendnum,{deposit:''})
    //   })
    // }
  }


  // 作废事件
  zfChange = (record) => {
    // console.log(record)
    let id = record.id
    this.setState({
      ZFvisible: true,
      woId: id,
      moneyRecord: record,
    });
  }

  // 发送请求作废
  ZFhandleOk = () => {
    let _th = this
    this.setState({
      ZFconfirmLoading: true
    })
    invalidWorkOrder({ woId: this.state.woId }).then(res => {
      if (res.success) {
        message.success('作废成功');
        this.setState({
          ZFvisible: false,
          woId: '',
          ZFconfirmLoading: false
        }, () => {
          _th.searchList()
        })
      } else {
        // 失败的时候的信息
        message.error(res.msg);
        this.setState({
          ZFvisible: false,
          ZFconfirmLoading: false
        })
      }
    });
  }
  // 取消作废
  ZFhandleCancel = () => {
    this.setState({
      ZFvisible: false,
    });
  }


  // 取消结算
  clcleMath = (record) => {
    let _th = this
    const id = record.id;
    // console.log(record);
    // 40000010表示已收全款
    if (record.receiptStatusCode == '40000010') {
      const qxObj = this.state.qxObj;
      this.setState({
        Mathvisible: true,
        qxObj: Object.assign({}, qxObj, { carNumber: record.carPlateNo, workNumber: record.woNo, vin: record.vin }),
      }, () => {
        _th.searchList()
      });
    } else {
      const qxObj = this.state.qxObj;
      this.setState({
        qxObj: Object.assign({}, qxObj, { carNumber: record.carPlateNo, workNumber: record.woNo, vin: record.vin }),
        Mathsvisible: true,
        woId: id,
      });
    }
  }

  // 已收全款的状态
  MathhandleOk = () => {
    this.setState({
      Mathvisible: false,
    });
  }
  MathhandleCancel = () => {
    this.setState({
      Mathvisible: false,
    });
  }

  // 不是已收全款的状态
  MathshandleOk = () => {
    let _th = this
    // 发送请求
    this.setState({
      QXconfirmLoading: true
    }, () => {
      cancelWorkOrderSettlement({ woId: this.state.woId }).then(res => {
        if (res.success) {
          message.success('取消结算操作成功')
          this.setState({
            Mathsvisible: false,
            woId: '',
            QXconfirmLoading: false
          }, () => {
            _th.searchList()
          })
        } else {
          message.error(res.msg)
          this.setState({
            Mathsvisible: false,
            QXconfirmLoading: false
          })
        }
      })
    })


  }
  MathshandleCancel = () => {
    this.setState({
      Mathsvisible: false,
    });
  }

  // 点击查询按钮查询
  searchList = () => {
    const data = this.state.data;
    this.setState({
      data: Object.assign({}, data, { currentIndex: 1 }),
    }, () => {
      this.QuerylistWorkOrder(this.state.data);
    });
  }
  // 重置事件
  resetForm = () => {
    this.setState({
      data: {
        workOrderStartDate: '', // 开单日期筛选开始时间(yyyy-mm-dd),
        workOrderEndDate: '', // 开单日期筛选结束时间(yyyy-mm-dd),
        settleateStartDate: '', // 结算日期开始时间(yyyy-mm-dd),
        settleateEndDate: '', // 结算日期结束时间(yyyy-mm-dd),
        bizTypeCode: '', // 业务类型Code,
        woStatusCode: '', // 单据状态Code,
        woNo: '', // 工单号,
        vin: '', // 车架号,
        refWoNo: '', // 关联单号,
        carPlateNo: '', // 车牌号,
        pageSize: 10, // 每页记录数,
        currentIndex: 1, // 当前页(不能为0)
      },
    })
    this.props.form.resetFields()
  }

  // 分页查询
  onCurrentPage = (current) => {
    const _th = this;
    const data = this.state.data;
    this.setState({
      pagecurrent: current,
      data: Object.assign({}, data, { currentIndex: current }),
    }, () => {
      this.QuerylistWorkOrder(_th.state.data);
    });
  }

  showTotal = total => `共 ${total} 条`


  render() {
    const _th = this;
    const FormItem = Form.Item;
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
    const formLeftLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
      },
    };
    const {
      handleSearchFormResetForm,   // 重置按钮回调函数
      toggleSearchFormCollapse,    // 筛选项收起/展开按钮回调函数
      gutter,                      // 左右间隔
      searchFormClassName,             // 控件区域className
      buttonColClassName,              // 按钮区域（右边的查询、重置）className
      colLayout,                   // 控件响应式配置
      collapseClassName,           // 按钮区域（左边的收起展开）className
      collapseIconType,            // 收起/展开按钮图标
      collapseText,                // 收起/展开按钮文案
      hide,                        // 控制每个控件是否隐藏（使用方法见下）
    } = this.props

    const bizTypeodelistChildren = this.state.bizTypeodelist.map(item => (<Option key={item.key} value={item.basCode}>{item.basText}</Option>));
    const statusListChildren = this.state.statusList.map(item => (<Option key={item.key} value={item.dicCode}>{item.dicValue}</Option>));

    const columns = [{
      title: '工单信息',
      width: 300,
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <div>
          <div>
            <label>工单号:</label>
            <span>{record.woNo}</span>
          </div>
          <div>
            <label>预约单号:</label>
            <span>{record.appointmentOrderNo}</span>
          </div>
          <div>
            <label>关联单号:</label>
            <span>{record.refWoNo}</span>
          </div>
          <div>
            <label>厂商单号:</label>
            <span>{record.oemOrderNo}</span>
          </div>
          <div>
            <label>工单状态:</label>
            <span>{record.woStatusName}</span>
          </div>
          <div>
            <label>收款状态:</label>
            <span>{record.receiptStatusName}</span>
          </div>
          <div>
            <label>业务类型:</label>
            <span>{record.bizTypeName}</span>
          </div>
        </div>
      ),
    }, {
      title: '客户车辆',
      key: 'age',
      dataIndex: 'age',
      width: 200,
      render: (text, record) => (
        <div>
          <div>
            <label>客户姓名:</label>
            <span>{record.cusName}</span>
          </div>
          <div>
            <label>联系电话:</label>
            <span>{record.cusContactPhone}</span>
          </div>
          <div>
            <label>送修人:</label>
            <span>{record.carSenderName}</span>
          </div>
          <div>
            <label>联系电话:</label>
            <span>{record.carSenderPhone}</span>
          </div>
          <div>
            <label>车牌号:</label>
            <span>{record.carPlateNo}</span>
          </div>
          <div>
            <label>VIN:</label>
            <span>{record.vin}</span>
          </div>
        </div>
      ),
    }, {
      title: '服务信息',
      width: 200,
      key: 'address',
      dataIndex: 'address',
      render: (text, record) => (
        <div>
          <div>
            <label>服务接待:</label>
            <span>{record.scEmpName}</span>
          </div>
          <div>
            <label>制单人:</label>
            <span>{record.woCreatorEmpName}</span>
          </div>
        </div>
      ),
    }, {
      title: '服务时间',
      key: 'tags',
      dataIndex: 'tags',
      width: 260,
      render: (text, record) => (
        <div>
          <div>
            <label>开单时间:</label>
            <span>{record.wOrderOpenDate}</span>
          </div>
          <div>
            <label>预计完工:</label>
            <span>{record.expectCarDeliveryDate}</span>
          </div>
          <div>
            <label>结算时间:</label>
            <span>{record.settleDate}</span>
          </div>
        </div>
      ),
    },
    {
      title: '服务金额',
      key: 'money',
      dataIndex: 'money',
      render: (text, record) => (
        <div>
          <div>
            <label>总金额:</label>
            <span>{record.amount == null ? 0.00 : record.amount.toFixed(2)}</span>
          </div>
          <div>
            <label>商品金额:</label>
            {/* 给的值有问题 */}
            <span>{record.materialAmount == null ? 0.00 : record.materialAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>工项金额:</label>
            <span>{record.workItemAmount == null ? 0.00 : record.workItemAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>优惠金额:</label>
            <span>{record.reduceAmount == null ? 0.00 : record.reduceAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>抹零金额:</label>
            <span>{record.wipedAmount == null ? 0.00 : record.wipedAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>应收金额:</label>
            <span>{record.receivableAmount == null ? 0.00 : record.receivableAmount.toFixed(2)}</span>
          </div>
          <div>
            <label>定金:</label>
            <span>{record.depositAmount == null ? 0.00 : record.depositAmount.toFixed(2)}</span>
          </div>
        </div>
      ),
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      width: 400,
      fixed: 'right',
      render: (text, record) => (
        <span>
          {record.woStatusCode == '70200015' ?
            <span>
              <a onClick={this.looked.bind(this, record)} href='javascript:;'>查看</a>
              <Divider type='vertical' />
              <a onClick={this.moneySend.bind(this, record)} href='javascript:;'>订金推送</a>
              <Divider type='vertical' />
              <a onClick={this.croy.bind(this, record)} href='javascript:;'>复制工单</a>
              <Divider type='vertical' />
              <a onClick={this.clcleMath.bind(this, record)} href='javascript:;'>取消结算</a>
              {/* <Divider type='vertical' />
              <a onClick={this.dyShow.bind(this, record)} href='javascript:;'>打印</a> */}
            </span> : ''}
          {record.woStatusCode == '70200020' ?
            <span>
              <a onClick={this.looked.bind(this, record)} href='javascript:;'>查看</a>
              <Divider type='vertical' />
              <a onClick={this.croy.bind(this, record)} href='javascript:;'>复制工单</a>
              {/* <Divider type='vertical' />
              <a onClick={this.dyShow.bind(this, record)} href='javascript:;'>打印</a> */}
            </span> : ''}
          {record.woStatusCode == '70200000' || record.woStatusCode == '70200005' ? <span>
            <a onClick={this.editd.bind(this, record)} href='javascript:;'>编辑</a>
            <Divider type='vertical' />
            <a onClick={this.looked.bind(this, record)} href='javascript:;'>查看</a>
            <Divider type='vertical' />
            <a onClick={this.moneySend.bind(this, record)} href='javascript:;'>订金推送</a>
            <Divider type='vertical' />
            <a onClick={this.zfChange.bind(this, record)} href='javascript:;'>作废</a>
            <Divider type='vertical' />
            <a onClick={this.croy.bind(this, record)} href='javascript:;'>复制工单</a>
            <Divider type='vertical' />
            <a onClick={this.ready.bind(this, record)} href='javascript:;'>完工</a>
            {/* <Divider type='vertical' />
            <a onClick={this.dyShow.bind(this, record)} href='javascript:;'>打印</a> */}
          </span> : ''}
          {record.woStatusCode == '70200010' ? <span>
            <a onClick={this.editd.bind(this, record)} href='javascript:;'>编辑</a>
            <Divider type='vertical' />
            <a onClick={this.looked.bind(this, record)} href='javascript:;'>查看</a>
            <Divider type='vertical' />
            <a onClick={this.moneySend.bind(this, record)} href='javascript:;'>订金推送</a>
            <Divider type='vertical' />
            <a onClick={this.croy.bind(this, record)} href='javascript:;'>复制工单</a>
            <Divider type='vertical' />
            <a onClick={this.back.bind(this, record)} href='javascript:;'>返工</a>
            {/* <Divider type='vertical' />
            <a onClick={this.dyShow.bind(this, record)} href='javascript:;'>打印</a> */}
          </span> : ''}
        </span>
      )
    }]

    return (
      <div>
        <p className='list-page_title'>工单管理</p>
        <Form className={searchFormClassName}>
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem label="开单日期:" >
                {getFieldDecorator('stateDate', {
                  initialValue: this.state.Time
                })(
                  <RangePicker onChange={this.kdChange} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='结算日期:' >
                {getFieldDecorator('endDate', {
                  initialValue: this.state.endTime
                })(
                  <RangePicker onChange={this.jsChange} />
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='业务类型'>
                {getFieldDecorator('bizTypeCode', {
                  initialValue: this.state.bizTypeCode
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择业务类型"
                    optionFilterProp="children"
                    onChange={this.YWChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {bizTypeodelistChildren}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='单据状态'>
                {getFieldDecorator('woStatusCode', {
                  initialValue: this.state.woStatusCode
                })(
                  <Select
                    allowClear
                    showSearch
                    placeholder="请选择单据状态"
                    optionFilterProp="children"
                    onChange={this.statusChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {statusListChildren}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='工单号:' >
                <Input value={this.state.data.woNo} onChange={this.woNoChange} placeholder='请选择' />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='关联单号:' >
                <Input value={this.state.data.refWoNo} onChange={this.refWoNoChange} placeholder='请选择' />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='车牌号:' >
                <Input value={this.state.data.carPlateNo} onChange={this.carPlateNoChange} placeholder='请选择' />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label='VIN:' >
                <Input value={this.state.data.vin} onChange={this.vinChange} placeholder='请选择' />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className={buttonColClassName}>
              <Button onClick={this.resetForm}>重置</Button>
              <Button type="primary" onClick={this.searchList}>查询</Button>
            </Col>
          </Row>
        </Form>
        {/* 表格 */}
        <span>共{this.state.pagetotal}条</span>
        <Spin tip='Loading...' spinning={this.state.loading}>
          <Table columns={columns} bordered dataSource={this.state.sourceData} scroll={{ x: 1500 }} pagination={false} />
        </Spin>
        <div style={{ textAlign: 'center' }}>
          <Pagination showQuickJumper style={{ marginTop: '20px' }} size='small' total={this.state.pagetotal} pageSize={this.state.data.pageSize} current={this.state.pagecurrent} showTotal={this.showTotal} onChange={this.onCurrentPage} />
        </div>
        {/* 定金推送模态框 */}
        <Modal
          title="订金推送"
          confirmLoading={this.state.DJconfirmLoading}
          visible={this.state.Moneyvisible}
          onOk={this.MoneyhandleOk}
          onCancel={this.MoneyhandleCancel}
        >
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
            display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
          }}
          >工单号:</span><span style={{
            display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', backgroundColor: '#f5f5f5',
          }}
          >{this.state.moneyRecord.woNo}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
            display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
          }}
          >客户姓名:</span><span style={{
            display: 'inline-block', width: '300px', height: '30px', lineHeight: '30px', backgroundColor: '#f5f5f5',
          }}
          >{this.state.moneyRecord.cusName}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}>
            <label style={{
              display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
            }}
            >已收订金:</label><Input disabled value={this.state.basemoney} style={{ dispaly: 'inline-block', width: '300px' }} />
          </div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}>
            <label style={{
              display: 'inline-block', width: '100px', height: '30px', lineHeight: '30px', textAlign: 'right',
            }}
            >本次订金:</label>
            <InputNumber placeholder='请输入大于0的金额' value={this.state.moneySendnum.deposit} precision={2} onBlur={this.Blur} style={{ dispaly: 'inline-block', width: '300px' }} onChange={this.moneyChange} />
          </div>
        </Modal>

        {/* 作废模态框 */}
        <Modal
          title='工单作废'
          visible={this.state.ZFvisible}
          confirmLoading={this.state.ZFconfirmLoading}
          onOk={this.ZFhandleOk}
          onCancel={this.ZFhandleCancel}
        >
          <div style={{ marginBottom: '10px' }}>您确定把工单作废吗？</div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >工单号:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.moneyRecord.woNo}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >车牌号:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.moneyRecord.carPlateNo}</span></div>
          <div style={{ marginBottom: '10px', marginLeft: '20px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >VIN:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.moneyRecord.vin}</span></div>
        </Modal>
        {/* 取消结算模态框 */}
        <Modal
          title='取消结算'
          visible={this.state.Mathvisible}
          confirmLoading={this.state.QXconfirmLoading}
          onOk={this.MathhandleOk}
          onCancel={this.MathhandleCancel}
        >
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>工单已关闭无法取消结算</div>
        </Modal>
        <Modal
          title='打印'
          visible={this.state.printVisible}
          onCancel={this.printCancel}
          maskClosable={false}
          destroyOnClose={true}
          width='80%'
          footer={[
            <Button key='back' onClick={this.printCancel}>
              关闭
                    </Button>,
          ]}
        >
          <div style={{ width: '100%', height: '600px', overflowY: 'auto' }}>
            <iframe
              src={`${'http://114.55.2.156:8888/WebReport/ReportServer?reportlet=/saas/Print_OrdSettlement.cpt' +
                '&id='}${this.state.Id}`}
              scrolling='auto'
              frameBorder={0}
              seamless='seamless'
              width='100%'
              height='100%'
            />
          </div>
        </Modal>
        <Modal
          title='取消结算'
          visible={this.state.Mathsvisible}
          onOk={this.MathshandleOk}
          onCancel={this.MathshandleCancel}
        >
          <div style={{ marginBottom: '10px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >工单号:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.qxObj.workNumber}</span></div>
          <div style={{ marginBottom: '10px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >车牌号:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.qxObj.carNumber}</span></div>
          <div style={{ marginBottom: '10px' }}><span style={{
            display: 'inline-block', height: '30px', lineHeight: '30px', width: '100px', textAlign: 'right',
          }}
          >VIN:</span><span style={{
            display: 'inline-block', backgroundColor: '#f5f5f5', width: '300px', height: '30px', lineHeight: '30px',
          }}
          >{this.state.qxObj.vin}</span></div>
        </Modal>


        <Modal
          title='确定要完工嘛？'
          visible={this.state.WGvisible}
          // confirmLoading={this.state.ZFconfirmLoading}
          onOk={this.ZFhandleOk}
          onCancel={this.ZFhandleCancel}
        >
          <h3>确定完工吗?</h3>
        </Modal>
      </div>
    );
  }
}

const WrappedNormalLoginForm = withRouter(Form.create()(searchFormCreate()(ManagementOfWorkOrder)))
export default WrappedNormalLoginForm


