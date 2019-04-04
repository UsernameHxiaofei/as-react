import {createModel} from '@rematch/core'
import {getIssuedOrderList,getIssuedOrderListReturn,queryOneWorkSetting,getIssuedOrderStatus} from '@/services/getData'
import { env } from '../../../config/env'
const { REDIRECTION_URL: { ReturnOfWorkOrders,WorksheetIssue }, HOST } = env;
import { message } from 'antd';
import moment from "moment";
// 初始化数据
const initState = Object.freeze({
  // 查询的条件
  data: {
    doNo:'', //发料单号
    woNo:'',//工单号
    startDate: '', //开始日期,
    endDate:'', //结束日期
    carPlateNo:'', //车牌号
    cusName:'',//客户姓名
    scEmpName:'',//服务顾问
    vin:'',//vin查询
    pageSize:10,
    currentIndex :1
  },
  dataCopy: {
    doNo:'', //发料单号
    woNo:'',//工单号
    startDate: moment().startOf('day').format("YYYY-MM-DD"), //开始日期,
    endDate:moment().endOf('day').format("YYYY-MM-DD"), //结束日期
    carPlateNo:'', //车牌号
    cusName:'',//客户姓名
    scEmpName:'',//服务顾问
    vin:'',//vin查询
    pageSize:10,
    currentIndex :1
  },
  zts:0,
  ztsCopy:0,
  loading:true,
  loadingCopy:true,
  dicTextNo:'',//售后系统设置是否自动发料
  List:[], //查询列表
  ListCopy:[], //查询列表
  wait:true,//发料列表等待
  waitCopy:true,//退库列表等待
  recordCopy:{id:''},
})

export default createModel({
  name:'SendMaterial',
  state: {
    ...initState,
  },
  // 异步修改数据
  effects: {
    // 获取查询列表   data 查询参数  title 判断是那个页面  rootState--假参 不用传 如果没有title传值取误
    async getIssuedOrderList(data,rootState,title){
      // 判断那个页面
      if(title==='1'){
        //等待
        this.SET_STATE({
          loading:true
        })
        // 交互
        const res = await getIssuedOrderList(data)
        //是否成功
        if(res.success){
          //是否有数据
          if(res.data){
              let data = res.data.items
              data.map((item, index)  => {
                item['key'] = index+1
              })
              this.SET_STATE({
                loading:false,
                List:data,
                zts:res.data.totalNumber
              })
          }else{
            this.SET_STATE({
              List:[],
              loading:false,
              zts:0,
            })
          }
        }else{
          message.error(res.msg);
          this.SET_STATE({
            List:[],
            loading:false,
            zts:0,
          })
        }
      }else{
        this.SET_STATE({
          loadingCopy:true
        })
        const res = await getIssuedOrderListReturn(data)
        if(res.success){
          if(res.data){
              let data = res.data.items
              data.map((item, index)  => {
                item['key'] = index+1
              })
              this.SET_STATE({
                loadingCopy:false,
                ListCopy:data,
                ztsCopy:res.data.totalNumber
              })
          }else{
            this.SET_STATE({
              ListCopy:[],
              loadingCopy:false,
              ztsCopy:0,
            })
          }
        }else{
          message.error(res.msg);
          this.SET_STATE({
            ListCopy:[],
            loadingCopy:false,
            ztsCopy:0,
          })
        }
      }
    },
    //获取售后系统设置  传死参数 获取是否自动发料
    async queryOneWorkSetting(){
      const res = await queryOneWorkSetting({
        "tagNameType": "3"
      })
      if(res.success){
          this.SET_STATE({
            dicTextNo:res.data.dicTextNo
          })
      }else{
        message.error(res.msg);
        this.SET_STATE({
          dicTextNo:''
        })
      }
    },
    // 获取工单状态  退料 发料需判断订单状态
    async getIssuedOrderStatus(data){
      const res = await getIssuedOrderStatus({id:data.id})
      if(res.success){
        const recordCopy = {
          id: data.id,
        };
        const _data = JSON.stringify(recordCopy);// 转为字符串
        let autoMessage = {}
        if(data.title==='1'){
          autoMessage = {
            name: '工单发料信息', index: `orderCheckwmb${recordCopy.id}`, url: WorksheetIssue, resId: 'sendOrder', infoData: _data,
          };
        }else if(data.title==='2'){
          autoMessage = {
            name: '发料退库信息', index: `orderCheckCopyOne${recordCopy.id}`, url: ReturnOfWorkOrders, resId: 'orderCheckCopyOne', infoData: _data,
          };
        }
        window.parent.postMessage(autoMessage, HOST);
      }else{
        let Tips = data.title==='1'?'不可发料':'不可退料'
        message.error(res.msg+Tips);
        this.getIssuedOrderList(data.dataCopy,data.title)
      }
    }
  },
  reducers: {
    RESET_STATE (state, payload) {
      return { ...initState}
    },
    SET_STATE (state, payload) {
      Object.keys(payload).forEach( (key) => {
        if (state[key] !== undefined && payload[key] !== undefined) {
          state[key] = payload[key]
        }
      })
    }
  }
})
