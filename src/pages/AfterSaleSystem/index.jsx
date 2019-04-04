import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { Select, Form, Row, Col, Radio, Button, message } from 'antd'
import { getDicDataByCategoryCode, getBasValueByBasCategoryNo, queryWorkSetting, saveWorkSetting } from '../../services/getData'

import styled from 'styled-components'


const Root = styled.div`
  padding-top: 40px;
  padding:0;
  .ant-modal-content{
    width:1000px;
  }
`;

class AfterSaleSystem extends React.Component {
  constructor(props) {
    super(props)
    // 初始化数据
    this.state = {
      defaultWorkTypeNo: '', //默认维修类型编码,
      defaultPayWayNo: '', //默认结算方式编码,
      isAutoGoodsNo: '', //是否自动发料编码,
      autoFinishNo: '', //自动完工编码,
      maLingRulesNo: '', //抹零规则编码,
      defaultPayWayList: [], //默认结算法师列表
      defaultWorkTypeList: [],
      data: {
        defaultWorkTypeId: '',
        defaultWorkTypeNo: '',
        defaultWorkTypeName: '',//默认维修类型,
        defaultPayWayId: '',
        defaultPayWayNo: '',
        defaultPayWayName: '',
        isAutoGoods: '', //是否自动发料 1-是, 0-否,
        autoFinish: '', //自动完工 1-是, 0-否,
        maLingRules: '', //抹零规则
      }
    }
  }


  // defaultWorkTypeId (string, optional): 默认维修类型ID,
  // defaultWorkTypeNo (string, optional): 默认维修类型编码,
  // defaultWorkTypeName (string, optional): 默认维修类型名称,
  // defaultPayWayId (string, optional): 默认结算方式ID,
  // defaultPayWayNo (string, optional): 默认结算方式编码,
  // defaultPayWayName (string, optional): 默认结算方式名称,
  // isAutoGoods (string, optional): 是否自动发料 是-10000000, 否-10000000,
  // autoFinish (string, optional): 自动完工 是-10000000, 否-10000000,
  // maLingRules (string, optional): 抹零规则名称 四舍五入-71500000, 只舍不入-71500005, 只入不舍-71500010
  componentDidMount() {
    // 获取默认结算方式的数据
    getDicDataByCategoryCode({ code: '7005' }).then(res => {
      if (res.success) {
        this.setState({
          defaultPayWayList: res.data
        })
      }
    })


    // 获取默认维修类型
    // getDicDataByCategoryCode({code:'7140'}).then(res => {
    //   console.log(res)
    //   if (res.success) {
    //     this.setState({
    //       defaultWorkTypeList: res.data
    //     }, () => {
    //       this.state.defaultWorkTypeList.map((item, index) => {
    //         item['key'] = index
    //       })
    //       // console.log(this.state.defaultWorkTypeList)
    //     })
    //   }
    // })

    getBasValueByBasCategoryNo({ categoryNo: 'AS1000' }).then(res => {
      if (res.success) {
        console.log(res.data)
        this.setState({
          defaultWorkTypeList: res.data
        }, () => {
          this.state.defaultWorkTypeList.map((item, index) => {
            item['key'] = index
          })
        })
      }
    })



    this.QueryWorkSetting()
  }
  // 进入页面获取数据
  QueryWorkSetting = () => {
    queryWorkSetting().then(res => {
      console.log(res.data, 111111)
      if (res.success) {
        let data = this.state.data
        this.setState({
          data: Object.assign({}, data, {
            defaultWorkTypeId: res.data.defaultWorkTypeId,
            defaultWorkTypeNo: res.data.defaultWorkTypeNo,
            defaultWorkTypeName: res.data.defaultWorkTypeName,//默认维修类型,
            defaultPayWayId: res.data.defaultPayWayId,
            defaultPayWayNo: res.data.defaultPayWayNo,
            defaultPayWayName: res.data.defaultPayWayName,
            isAutoGoods: res.data.isAutoGoods,
            autoFinish: res.data.autoFinish,
            maLingRules: res.data.maLingRules,
          })
        })
      }
    })
  }

  // 默认维修类型改变
  wxChange = (value, Option) => {
    console.log(Option)
    if (value == undefined || Option == undefined) {
      let data = this.state.data
      this.setState({
        data: Object.assign({}, data, { defaultWorkTypeId: '', defaultWorkTypeNo: '', defaultWorkTypeName: '' })
      })
    } else {
      let data = this.state.data
      this.setState({
        data: Object.assign({}, data, { defaultWorkTypeId: Option.props.id, defaultWorkTypeNo: Option.props.value, defaultWorkTypeName: Option.props.children })
      })
    }


  }
  // 默认结算方式改变
  jsChange = (value, Option) => {
    console.log(Option)
    if (value == undefined || Option.props == undefined) {
      let data = this.state.data
      this.setState({
        data: Object.assign({}, data, { defaultPayWayId: '', defaultPayWayNo: '', defaultPayWayName: '' })
      })
    } else {
      let data = this.state.data
      this.setState({
        data: Object.assign({}, data, { defaultPayWayId: Option.props.id, defaultPayWayNo: Option.props.value, defaultPayWayName: Option.props.children })
      }, () => {
        console.log(this.state.data)
      })
    }

  }

  // 是否自动发料改变
  flChange = (e) => {
    let value = e.target.value
    let data = this.state.data
    this.setState({
      data: Object.assign({}, data, { isAutoGoods: value })
    }, () => {
      console.log(this.state.data)
    })

  }

  // 是否自动完工改变
  wgChange = (e) => {
    let value = e.target.value
    let data = this.state.data
    this.setState({
      data: Object.assign({}, data, { autoFinish: value })
    }, () => {
      console.log(this.state.data)
    })
  }
  // 是否要四舍五入
  czChange = (e) => {
    console.log(e.target.value)
    let value = e.target.value
    let data = this.state.data
    if (value == '71500000') {
      this.setState({
        data: Object.assign({}, data, { maLingRules: value })
      })
    } else if (value == '71500005') {
      this.setState({
        data: Object.assign({}, data, { maLingRules: value })
      })
    } else if (value == '71500010') {
      this.setState({
        data: Object.assign({}, data, { maLingRules: value })
      })
    }
  }

  // 确定事件
  Suer = () => {
    let _th = this
    let data = this.state.data
    saveWorkSetting(data).then(res => {
      if (res.success) {
        message.success('操作成功')
        _th.QueryWorkSetting()
      } else {
        message.error(res.msg)
      }
    })
  }





  render() {
    let _th = this

    const FormItem = Form.Item
    let Option = Select.Option

    const RadioGroup = Radio.Group
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


    // 默认结算方式
    let defaultPayWayListChildren = this.state.defaultPayWayList.map(item => {
      return (<Option key={item.id} id={item.id} value={item.dicCode}>{item.dicValue}</Option>)
    })
    // 默认维修类型
    let defaultWorkTypeListChildren = this.state.defaultWorkTypeList.map((item, index) => {
      return (<Option key={index} id={item.id} value={item.basCode}>{item.basText}</Option>)
    })



    return (
      <div>

        <div style={{ border: '1px solid #f5f5f5', padding: '10px 0', borderRadius: '5px' }}>
          <p className='list-page_title'>快捷开单默认值设置</p>
          <hr />
          <Form >
            <Row>

              <Col span={6}>
                <FormItem {...formLeftLayout} label="默认业务类型:">
                  <Select
                    allowClear
                    placeholder='请选择'
                    value={this.state.data.defaultWorkTypeNo}
                    onChange={this.wxChange}
                  >
                    {defaultWorkTypeListChildren}
                  </Select>
                </FormItem>
              </Col>

              <Col span={6}>
                <FormItem {...formLeftLayout} label="默认结算方式:">
                  <Select
                    allowClear
                    placeholder='请选择'
                    value={this.state.data.defaultPayWayNo}
                    onChange={this.jsChange} >
                    {defaultPayWayListChildren}
                  </Select>
                </FormItem>
              </Col>

            </Row>
          </Form>

          <div>
            <span style={{ marginLeft: '10px' }}>是否自动发料:</span>
            <RadioGroup onChange={this.flChange} value={this.state.data.isAutoGoods}>
              <Radio value={'10000000'}>是</Radio>
              <Radio value={'10000005'}>否</Radio>
            </RadioGroup>

            <span style={{ marginLeft: '80px' }}>自动完工:</span>
            <RadioGroup onChange={this.wgChange} value={this.state.data.autoFinish}>
              <Radio value={'10000000'}>是</Radio>
              <Radio value={'10000005'}>否</Radio>
            </RadioGroup>
          </div>


          <div style={{ marginTop: '30px' }}>
            <span style={{ marginLeft: '10px' }}>抹零规则:</span>
            <RadioGroup onChange={this.czChange} value={this.state.data.maLingRules}>
              <Radio value={'71500000'}>四舍五入</Radio>
              <Radio value={'71500005'}>只舍不入</Radio>
              <Radio value={'71500010'}>只入不舍</Radio>
            </RadioGroup>
          </div>
          <Button type='primary' onClick={this.Suer} style={{ float: 'right', marginTop: '20px', marginRight: '50px' }}>确定</Button>
        </div>
      </div>
    )
  }

}

export default AfterSaleSystem


