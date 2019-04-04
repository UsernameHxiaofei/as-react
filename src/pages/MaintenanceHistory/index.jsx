
import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { envRouter } from '@/config/methods/';
import { withRouter } from 'react-router';
import { menuRouter } from '@souche-f2e/souche-menu-partner';
import { Select, Form, Row, Col, Table, Input, Button, message, DatePicker, Spin, Icon } from 'antd'
import { mapWorkOrderHistroyDto } from '../../services/getData'
import { searchFormCreate } from '@/shared/hoc'

import styled from 'styled-components'


const Root = styled.div`
    .eee{
      background:#eee
    }
    .fff{
      background:#fff
    }
`;
const { RangePicker } = DatePicker;
class MaintenanceHistory extends React.Component {
  constructor(props) {
    super(props)
    // 初始化数据
    this.state = {
      data: {
        vin: '',
        goodsName: '',
        startTime: '',
        endTime: '',
      },
      Time: [],
      productList: [], //商品列表
      workList: [],//工项列表
      loading: true,
      color: {},
      colorcopy: {},
      clas: [],
      clascopy: []
    }
  }

  componentDidMount = () => {
    let _th = this
    let data = _th.state.data
    // window.addEventListener('message', function (e) {
    //   if (e.data) {
    //     let Obj = JSON.parse(e.data)
    //     _th.setState({
    //       data: Object.assign({}, data, { vin: Obj.woNo })
    //     }, () => {
    //       // 查询
    //       _th.query()
    //     })
    //   }
    // })

    if (envRouter) { //预发环境
      const Obj = this.props.location.query;
      if (Obj) {
        _th.setState({
          data: Object.assign({}, data, { vin: Obj.woNo })
        }, () => {
          // 查询
          _th.query()
        })
      } else {
        this.query()
      }
    } else {
      menuRouter.ready((req) => { // req 为 2.x 新增, 表示接收上一个页面传递过来的数据
        if (req.jumpFlag) {
          const Obj = req;
          _th.setState({
            data: Object.assign({}, data, { vin: Obj.woNo })
          }, () => {
            // 查询
            _th.query()
          })
        } else {
          _th.query()
        }
      });
    }
  }


  querymapWorkOrderHistroyDto = (data) => {

    mapWorkOrderHistroyDto(data).then(res => {
      if (res.success) {
        // 关闭
        this.setState({
          loading: false
        })
        let color = this.state.color
        let colorcopy = this.state.colorcopy
        let garycopy = 'eee'
        let gary = 'eee'
        let clas = this.state.clas
        let clascopy = this.state.clascopy
        // console.log(res.data, 1111111)
        let productList = null
        let workList = null
        if (res.data == null) {
          productList = []
          workList = []
        } else {
          productList = res.data['商品']
          workList = res.data['工项']
        }
        // let productList = res.data['商品'] || []
        // let workList = res.data['工项'] || []
        productList.map((item, index) => {
          item['key'] = item.id
          item['index'] = index + 1
        })
        workList.map((item, index) => {
          item['key'] = item.id
          item['index'] = index + 1
        })
        this.setState({
          productList: productList,
          workList: workList,
          loading: false
        }, () => {
          // 隔行变色
          for (let i = 0; i < this.state.productList.length; i++) {
            if (color[this.state.productList[i].woId]) {
              clas.push(color[this.state.productList[i].woId])
            } else {
              color[this.state.productList[i].woId] = gary
              clas.push(gary)
              gary == 'eee' ? (gary = "fff") : (gary = "eee")
            }
          }

          for (let j = 0; j < this.state.workList.length; j++) {
            if (colorcopy[this.state.workList[j].woId]) {
              clascopy.push(colorcopy[this.state.workList[j].woId])
            } else {
              colorcopy[this.state.workList[j].woId] = garycopy
              clascopy.push(garycopy)
              garycopy == 'eee' ? (garycopy = "fff") : (garycopy = "eee")
            }
          }

          this.setState({
            color: color,
            clas: clas
          })
        })
      }
    })
  }


  // 点击查询事件
  query = () => {
    let data = this.state.data
    this.color = []
    this.querymapWorkOrderHistroyDto(data)
  }

  // 重置
  resetForm = () => {
    this.setState({
      data: {
        vin: '',
        goodsName: '',
        startTime: '',
        endTime: '',
      },
    })
    this.props.form.resetFields()
  }


  // vin改变的事件
  vinChange = (e) => {
    let value = e.target.value
    let data = this.state.data
    this.setState({
      data: Object.assign({}, data, { vin: value })
    })
  }


  // 工项或商品改变
  goodsNameChange = (e) => {
    let value = e.target.value
    let data = this.state.data
    this.setState({
      data: Object.assign({}, data, { goodsName: value })
    })
  }

  // 时间改变
  timeChange = (date, dataString) => {
    let data = this.state.data
    if (date.length <= 0) {
      this.setState({
        data: Object.assign({}, data, { startTime: '', endTime: '' })
      })
    } else {
      let reportToOemStartTime = moment(date[0]._d).format('YYYY-MM-DD')
      let reportToOemEndTime = moment(date[1]._d).format('YYYY-MM-DD')
      this.setState({
        data: Object.assign({}, data, { startTime: reportToOemStartTime, endTime: reportToOemEndTime })
      })

    }

  }



  render() {
    let _th = this
    const FormItem = Form.Item
    let Option = Select.Option
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
    }
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

    const columnsTow = [{
      title: '序号',
      width: 50,
      key: '111111111',
      render: (record) => (
        <span>
          {record.index}
        </span>
      ),
    }, {
      title: '工单号',
      width: 180,
      key: '22222222222',
      render: (record) => (
        <span>
          {record.woNo}
        </span>
      ),
    }, {
      title: '结算时间',
      key: '16',
      width: 120,
      render: (record) => (
        <span>
          {record.settleDate}
        </span>
      ),

    }, {
      title: '里程',
      key: '15',
      render: (record) => (
        <span>
          {record.inStoreMileage}
        </span>
      ),
      width: 120,
    },
    {
      title: '商品编号',
      width: 120,
      key: '14',
      render: (record) => (
        <span>
          {record.goodsNo}
        </span>
      ),
    }, {
      title: '商品名称',
      width: 120,
      key: '13',
      render: (record) => (
        <span>
          {record.goodsName}
        </span>
      ),
    },
    {
      title: '业务类型',
      width: 100,
      key: '12',
      render: (record) => (
        <span>
          {record.bizTypeName}
        </span>
      ),
    },
    {
      title: '结算方式',
      width: 100,
      key: '11',
      render: (record) => (
        <span>
          {record.settleTypeName}
        </span>
      ),
    }, {
      title: '数量',
      width: 100,
      key: '10',
      render: (record) => (
        <span>
          {record.qty.toFixed(2)}
        </span>
      ),

    }];



    // 工项
    const columns = [{
      title: '序号',
      width: 50,
      height: 60,
      background: "",
      key: '1',
      render: (record) => (
        <span>
          {record.index}
        </span>
      ),

    }, {
      title: '工单号',
      width: 180,
      key: '2',
      render: (record) => (
        <span>
          {record.woNo}
        </span>
      )
    }, {
      title: '结算时间',
      width: 120,
      key: '3',
      render: (record) => (
        <span>
          {record.settleDate}
        </span>
      )
    }, {
      title: '里程',
      width: 120,
      key: '4',
      render: (record) => (
        <span>
          {record.inStoreMileage}
        </span>
      )
    },
    {
      title: '工项编号',
      width: 120,
      key: '5',
      render: (record) => (
        <span>
          {record.goodsNo}
        </span>
      )
    }, {
      title: '工项名称',
      width: 120,
      key: '6',
      render: (record) => (
        <span>
          {record.goodsName}
        </span>
      )
    },
    {
      title: '业务类型',
      width: 100,
      key: '7',
      render: (record) => (
        <span>
          {record.bizTypeName}
        </span>
      )
    },
    {
      title: '结算方式',
      width: 120,
      key: '8',
      render: (record) => (
        <span>
          {record.settleTypeName}
        </span>
      )
    }, {
      title: '数量',
      width: 100,
      key: '9',
      render: (record) => (
        <span>
          {record.qty.toFixed(2)}
        </span>
      )
    }]


    return (
      <div>
        <p className='list-page_title'>维修历史</p>
        <Form className={searchFormClassName}>
          <Row gutter={gutter}>
            <Col {...colLayout}>
              <FormItem label="VIN:">
                <Input placeholder="请输入VIN" value={this.state.data.vin} onChange={this.vinChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="工项或商品:">
                <Input placeholder="请输入工项或商品" value={this.state.data.goodsName} onChange={this.goodsNameChange} />
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem label="结算日期:" >
                {getFieldDecorator('crtDate', {
                  initialValue: this.state.Time
                })(
                  <RangePicker onChange={this.timeChange} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col className={buttonColClassName}>
              <Button onClick={this.resetForm}>重置</Button>
              <Button type="primary" onClick={this.query}>查询</Button>
            </Col>
          </Row>
        </Form>
        {/* <Button type="primary" style={{marginRight: '30px'}}>第三方历史查询</Button> */}
        {/* <Button type="primary"  onClick={this.query}>查询</Button> */}

        {/* 表格 */}
        {/* 工项 */}
        <Root>
          <Spin tip="Loading..." spinning={this.state.loading}>
            <Table columns={columns} bordered style={{ marginTop: '20px' }} scroll={{ y: 400, x: 1200 }} dataSource={this.state.workList} pagination={false}
              rowClassName={(record, index) => this.state.clascopy[index]}
            />
          </Spin>
          <Spin spinning={this.state.loading}>
            <Table rowClassName={(record, index) => this.state.clas[index]} columns={columnsTow} bordered style={{ marginTop: '20px' }} scroll={{ y: 400, x: 1200 }} dataSource={this.state.productList} pagination={false} />
          </Spin>

        </Root>




      </div>
    )
  }

}


const WrappedNormalLoginForm = withRouter(Form.create()(searchFormCreate()(MaintenanceHistory)))
export default WrappedNormalLoginForm

