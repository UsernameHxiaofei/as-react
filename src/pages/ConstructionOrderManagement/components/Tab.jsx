

import React, { Component } from 'react'

import { Table, Divider, Pagination, Spin, message } from 'antd'
import { queryWorkProcessOrder, queryWorkProcessInfoLinkWorkHour } from '@/services/getData'

import { connect } from 'react-redux'

class Tab extends Component {

  // 派工显示
  PGshow = (record) => {
    this.props.SET_STATE({
      SGVisible: true,
      id: record.id,
      PGobj: { ...this.props.PGobj, procId: record.id },
    })
    // 调三个接口
    this.props.FindListMdmWorkTeamNoPage()
    this.props.GetStationList()
    // let obj = {
    //   index:1,
    //   pageSize:10000,
    //   keyWord:'',
    //   deptId:'',
    //   dutyId:''
    // }
    // this.props.GetTechnicianVo(obj)
    this.props.FindListMdmWorkTeamEmployee()
    this.QueryWorkProcessInfoLinkWorkHour(record.id)
  }

  // 验收显示
  YSshow = (record) => {
    let obj = JSON.parse(localStorage.getItem('loginInfo')).login
    this.props.SET_STATE({
      YSVisible: true,
      name: obj.empName,
      ID: obj.empId,
      YSdata: { ...this.props.YSdata, procId: record.id, checkEmpId: obj.empId, checkEmpName: obj.empName }
    })
    this.QueryWorkProcessOrder(record.id)
  }

  // 派工模态框明细获取
  async QueryWorkProcessInfoLinkWorkHour(procId) {
    const res = await queryWorkProcessInfoLinkWorkHour({ procId })
    if (res.success) {
      let Obj = res.data.mstrVO
      let arr = []
      res.data.detVOs.map((item, index) => {
        item['key'] = index
        item.workHour = item.workHour == null ? 0 : (+item.workHour)
        arr.push({
          workProcessOrderDetId: item.id,
          workLocationId: item.workLocationId,
          workLocationNo: item.workLocationNo,
          workLocationName: item.workLocationName,
          workTeamId: item.workTeamId,
          workTeamNo: item.workTeamNo,
          workTeamName: item.workTeamName,
          workTechnicianId: item.workTechnicianId,
          workTechnicianNo: item.workTechnicianNo,
          workTechnicianName: item.workTechnicianName,
          workHour: item.workHour == null ? 0 : (+item.workHour)
        })
      })
      this.props.SET_STATE({
        lookObj: {
          procNo: Obj.procNo,
          procStatusName: Obj.procStatusName,
          createEmpName: Obj.createEmpName,
          createDate: Obj.createDate,
          cusName: Obj.cusName,
          carPlateNo: Obj.carPlateNo,
          vin: Obj.vin,
          carBrandName: Obj.carBrandName,
          carSeriesName: Obj.carSeriesName,
          carModelName: Obj.carModelName,
          memberNo: Obj.memberNo,
          woNo: Obj.woNo,
          cusDesc: Obj.cusDesc,
          repairAdvice: Obj.repairAdvice,
          precheckResult: Obj.precheckResult,
          totalWorkHour: Obj.totalWorkHour,
          estimatedCarDeliveryDate: Obj.estimatedCarDeliveryDate,
        },
        lookList: res.data.detVOs,
        dispatchingItems: arr
      })
    } else {
      return message.error(res.msg)
    }
  }
  // 查看模态框的明细获取
  async QueryWorkProcessOrder(procId) {
    const res = await queryWorkProcessOrder({ procId })
    if (res.success) {
      let Obj = res.data.mstrVO
      let lookList = res.data.detVOs
      lookList.map((item, index) => {
        item['key'] = index
      })
      this.props.SET_STATE({
        lookObj: {
          procNo: Obj.procNo,
          procStatusName: Obj.procStatusName,
          createEmpName: Obj.createEmpName,
          createDate: Obj.createDate,
          cusName: Obj.cusName,
          carPlateNo: Obj.carPlateNo, //车牌号
          vin: Obj.vin,
          carBrandName: Obj.carBrandName,
          carSeriesName: Obj.carSeriesName,
          carModelName: Obj.carModelName,
          memberNo: Obj.memberNo,
          woNo: Obj.woNo,
          cusDesc: Obj.cusDesc,
          repairAdvice: Obj.repairAdvice,
          precheckResult: Obj.precheckResult,
          totalWorkHour: Obj.totalWorkHour,
          estimatedCarDeliveryDate: Obj.estimatedCarDeliveryDate,
          estimateFinishDate: Obj.estimateFinishDate
        },
        lookList: lookList
      })
    }
  }

  // 查看显示
  CKshow = (record) => {
    this.props.SET_STATE({
      id: record.id,
      CKVisible: true
    })
    this.QueryWorkProcessOrder(record.id)
  }
  // 打印显示
  DYshow = () => {
    this.props.SET_STATE({
      DYVisible: true
    })
  }

  // 撤销
  CXshow = (record, type) => {
    if (type == 'SG') {
      this.props.SET_STATE({
        CXVisible: true,
        id: record.id,
        type: '确定要撤销该施工单吗?',
        procNo: record.procNo,
        carPlateNo: record.carPlateNo,
        vin: record.vin
      })
    }

    if (type == 'PG') {
      this.props.SET_STATE({
        CXVisible: true,
        id: record.id,
        type: '确定要撤销派工单吗？',
        procNo: record.procNo,
        carPlateNo: record.carPlateNo,
        vin: record.vin
      })
    }

    if (type == 'YS') {
      this.props.SET_STATE({
        CXVisible: true,
        id: record.id,
        type: '确定要撤销验收吗？',
        procNo: record.procNo,
        carPlateNo: record.carPlateNo,
        vin: record.vin
      })
    }
  }

  pageChange = (current) => {
    let data = { ...this.props.data, currentIndex: current }
    this.props.ListWorkProcessOrder(data)
  }

  render() {
    const columns = [{
      title: '施工单信息',
      key: 'msg',
      width: 320,
      render: (record) => (
        <div>
          <div>施工单号:{record.procNo}</div>
          <div>施工单状态:{record.procStatusName}</div>
          <div>工单号:{record.woNo}</div>
          {/* <div>关联单号:{}</div> */}
          <div>业务类型:{record.bizTypeName}</div>
          <div>开单时间:{record.createDate}</div>
        </div>
      )
    }, {
      title: '客户车辆',
      key: 'age',
      width: 200,
      render: (record) => (
        <div>
          <div>客户姓名:{record.cusName}</div>
          <div>车牌号:{record.carPlateNo}</div>
          <div>VIN:{record.vin}</div>
        </div>
      )
    }, {
      title: '服务信息',
      key: 'address',
      width: 200,
      render: (record) => (
        <div>
          <div>服务接待:{record.scEmpName}</div>
          <div>制单人:{record.createEmpName}</div>
        </div>
      )
    },
    {
      title: '派工信息',
      key: 'name',
      width: 350,
      render: (record) => (
        <div>
          <div>工时合计:{record.totalWorkHour}</div>
          <div>预计完工时间:{record.estimateFinishDate}</div>
          <div>实际完工时间:{record.actualFinishDate}</div>
        </div>
      )
    }, {
      title: '验收信息',
      key: '9999',
      render: (record) => (
        <div>
          <div>验收结果:{record.checkResultName}</div>
          <div>验收备注:{record.checkRemark}</div>
          <div>验收人:{record.checkEmpName}</div>
          <div>验收时间:{record.checkDate}</div>
        </div>
      )
    }, {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right',
      render: (record) => (
        <span>
          {record.procStatusName == '待派工' ? <span>
            <a onClick={this.PGshow.bind(this, record)} href="javascript:;">派工</a>
            <Divider type="vertical" />
            <a onClick={this.CKshow.bind(this, record)} href="javascript:;">查看</a>
            <Divider type="vertical" />
            <a onClick={this.CXshow.bind(this, record, 'SG')} href="javascript:;">撤销施工单</a>
            {/* <Divider type="vertical" />
            <a onClick={this.DYshow.bind(this, record)} href="javascript:;">打印</a> */}
          </span> : ''}
          {record.procStatusName == '已派工' ? <span>
            <a onClick={this.CKshow.bind(this, record)} href="javascript:;">查看</a>
            <Divider type="vertical" />
            <a onClick={this.YSshow.bind(this, record)} href="javascript:;">验收</a>
            <Divider type="vertical" />
            <a onClick={this.CXshow.bind(this, record, 'PG')} href="javascript:;">撤销派工</a>
            {/* <Divider type="vertical" />
            <a onClick={this.DYshow.bind(this, record)} href="javascript:;">打印</a> */}
          </span> : ''}
          {record.procStatusName == '已验收' ? <span>
            <a onClick={this.CKshow.bind(this, record)} href="javascript:;">查看</a>
            {/* <Divider type="vertical" />
            <a onClick={this.DYshow.bind(this, record)} href="javascript:;">打印</a> */}
            <Divider type="vertical" />
            <a onClick={this.CXshow.bind(this, record, 'YS')} href="javascript:;">撤销验收</a>
          </span> : ''}
        </span>
      )
    }]


    return (
      <div>

        <span>共{this.props.totalNumber}条</span>
        <Spin tip="Loading..." spinning={this.props.spin}>
          <Table
            dataSource={this.props.TabList}
            columns={columns}
            pagination={false}
            scroll={{ x: 1600 }}
            bordered />
        </Spin>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Pagination
            size='small'
            showQuickJumper
            total={this.props.totalNumber}
            showTotal={total => `共 ${total} 条`}
            pageSize={this.props.data.pageSize}
            current={this.props.data.currentIndex}
            onChange={this.pageChange} />
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const { ID, name, dispatchingItems, procId, PGobj, YSdata, SGVisible, YSVisible, CKVisible, DYVisible, CXVisible, TabList, totalNumber, data, spin, lookObj, lookList } = state.constructionordermanagement
  return { ID, name, dispatchingItems, procId, PGobj, YSdata, SGVisible, YSVisible, CKVisible, DYVisible, CXVisible, TabList, totalNumber, data, spin, lookObj, lookList }
}


const mapDispatchToProps = (dispatch) => {
  const { GetTechnicianVo, FindListMdmWorkTeamEmployee, GetStationList, FindListMdmWorkTeamNoPage, SET_STATE, ListWorkProcessOrder } = dispatch.constructionordermanagement
  return { GetTechnicianVo, FindListMdmWorkTeamEmployee, GetStationList, FindListMdmWorkTeamNoPage, SET_STATE, ListWorkProcessOrder }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab)
