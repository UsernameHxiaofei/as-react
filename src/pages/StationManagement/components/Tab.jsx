

import React,{Component} from 'react'

import {Table, Button,Divider,Pagination} from 'antd'
import {connect} from 'react-redux'

class Tab extends Component{

  componentWillMount = () => {
    this.props.GetMdmWorkLocationForPage(this.props.data)
  }
  // 新增
  Add = () => {
    this.props.SET_STATE({
      ADDVisible:true
    })
  }

  // 编辑
  edit = (record) => {
    this.props.SET_STATE({
      DELVisible:true,
      addData:{
        id:record.id,
        workLocationNo:record.workLocationNo,
        workLocationName:record.workLocationName,
        workLocationTypeId:record.workLocationTypeId,
        workLocationTypeNo:record.workLocationTypeNo,
        workLocationTypeName:record.workLocationTypeName,
        isEnabled:record.isEnabled
      }
    })
  }
  // 删除
  delete = (record) => {
    this.props.SET_STATE({
      SCVisible:true,
      id:record.id
    })
  }



  pageChange = (current) => {
    let data = {...this.props.data, index:current}
    this.props.GetMdmWorkLocationForPage(data)
  }
  render () {
    const columns = [{
      title: '工位编号',
      key: 'name',
      render: (record) => (
        <div>{record.workLocationNo}</div>
      )
    }, {
      title: '工位名称',
      key: 'age',
      render: (record) => (
        <div>{record.workLocationName}</div>
      )
    }, {
      title: '工位类型',
      render: (record) => (
        <div>{record.workLocationTypeName}</div>
      ),
      key: 'address',
    },  {
      title: '是否启用',
      render: (record) => (
        <div>{record.isEnabled == 1? '是':"否"}</div>
      ),
      key: '99999',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <div>
          <a onClick={this.edit.bind(this, record)} href="javascript:;">编辑</a>
          <Divider type="vertical" />
          <a onClick={this.delete.bind(this, record)} href="javascript:;">删除</a>
        </div>
      )
    }]
    return (
      <div>

        <div style={{overflow:'hidden'}}>
        <p className='list-page_title'>工位管理</p>
        <Button type='primary' onClick={this.Add} style={{ float: 'right', margin:'20px, 0'}}>新增</Button>
        </div>
        <span>共{this.props.totalNumber}条</span>
        <Table
        dataSource={this.props.dataSource}
        columns={columns}
        pagination={false}
        bordered
        />
        <div style={{textAlign:'center', marginTop:'20px'}}>
        <Pagination
        size='small'
        showQuickJumper
        total={this.props.totalNumber}
        showTotal={total => `共 ${total} 条`}
        pageSize={this.props.data.pageSize}
        current={this.props.data.index}
        onChange={this.pageChange} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {data,dataSource,totalNumber,ADDVisible,addData,DELVisible,id} = state.stationManagement
  return {data,dataSource,totalNumber,ADDVisible,addData,DELVisible,id}
}
const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,GetMdmWorkLocationForPage} = dispatch.stationManagement
  return {SET_STATE,GetMdmWorkLocationForPage}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Tab)
