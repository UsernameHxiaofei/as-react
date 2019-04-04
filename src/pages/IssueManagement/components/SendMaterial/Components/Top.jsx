

import React,{Component} from 'react'
import {getDicDataByCategoryCode} from '@/services/getData'
import {Button,Form,Input,Select,Row, Col,LocaleProvider,DatePicker } from 'antd'
import moment from "moment";
import {connect} from 'react-redux'
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item
const Option = Select.Option
// 修改的样式
import { searchFormCreate } from '@/shared/hoc'
class Tab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            defaultSelectDate:{
                startDate:moment().startOf('day'),
                endDate:moment().endOf('day'),
            }
        };
      } 
    //根据title确定页面  并获取请求参数
    componentDidMount(){
        let data = this.props.title==='1'?this.props.data:this.props.dataCopy
        let title = this.props.title
        this.props.getIssuedOrderList(data,title)
    } 
    // 查询事件
    query=()=>{
        let data = this.props.form.getFieldsValue()
        //获取时间
        const crtDateStart = data.applyDate.length?moment(data.applyDate[0]).format("YYYY-MM-DD"): "";
        const crtDateEnd = data.applyDate.length?moment(data.applyDate[1]).format("YYYY-MM-DD"): "";
        let obj = {
            doNo:data.eoNo, //发料单号
            woNO:data.woNO, //工单号
            startDate: crtDateStart,  //开始日期,
            endDate:crtDateEnd,  //结束日期
            carPlateNo:data.carPlateNo,  //车牌号
            cusName:data.name, //客户姓名
            scEmpName:data.saEmpName?data.saEmpName:'', //服务顾问
            vin:data.VIN, //vin查询
            pageSize:10,
            currentIndex :1
        }
        // 调用查询接口
        this.props.getIssuedOrderList(obj,this.props.title)
        //根据title修改redux查询参数
        if(this.props.title==='1'){
            this.props.SET_STATE({
                data:obj
            })
        }else{
            this.props.SET_STATE({
                dataCopy:obj
            })
        }
      }
    Reset=()=>{
        this.props.form.resetFields();
    }  
  render () {
    const {
        form: { getFieldDecorator },
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
      } = this.props;
    return (
      <Row>
            <Form  className={searchFormClassName}>
                <Row gutter={gutter}>
                <Col {...colLayout}>
                    <FormItem label='发料单号' >
                    {getFieldDecorator('eoNo',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入' style={{textTransform:'uppercase'}}/>
                    )}
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label='工单号' >
                    {getFieldDecorator('woNO',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入' style={{textTransform:'uppercase'}}/>
                    )}
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label='车牌号' >
                    {getFieldDecorator('carPlateNo',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入' style={{textTransform:'uppercase'}}/>
                    )}
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label='客户名称' >
                    {getFieldDecorator('name',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入'/>
                    )}
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label='销售顾问' >
                    {getFieldDecorator('saEmpName',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入'/>
                    )}   
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label={this.props.title === '1' ? '创建日期' : '发料日期'} >
                    {getFieldDecorator('applyDate',{
                        initialValue:this.props.title==='1'?[]:[this.state.defaultSelectDate.startDate, this.state.defaultSelectDate.endDate],
                    })( 
                        <RangePicker style={{width:'100%'}}/>
                    )}
                    </FormItem>
                </Col>
                <Col {...colLayout}>
                    <FormItem label='VIN' >
                    {getFieldDecorator('VIN',{
                        initialValue:''
                    })( 
                        <Input placeholder='请输入' style={{textTransform:'uppercase'}}/>
                    )}
                    </FormItem>
                </Col>
                </Row>
                <Row gutter={gutter}>
                <Col className={buttonColClassName}>
                    <Button key="Reset"  style={{ marginLeft: '1rem' }} onClick={this.Reset}>重置</Button>
                    <Button type="primary"   loading={this.props.title === '1' ?this.props.loading:this.props.loadingCopy} onClick={this.query}>查询</Button>  
                </Col>
                </Row>
                </Form>
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  const {data,saEmpNamelist,dataCopy,loading,loadingCopy} = state.SendMaterial
  return {data,saEmpNamelist,dataCopy,loading,loadingCopy}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,getIssuedOrderList} = dispatch.SendMaterial
  return {SET_STATE,getIssuedOrderList}
}
const IndexPage = Form.create()(searchFormCreate()(Tab))
export default connect (
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
