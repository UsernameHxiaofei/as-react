

import React,{Component} from 'react'

import {Table, Button,Divider,Pagination} from 'antd'
import {connect} from 'react-redux'

class Tab extends Component{

  componentWillMount = () => {
    this.props.FindListMdmWorkTeamByPage(this.props.data)
  }

  // 编辑
  edit = (record) => {
    this.props.SET_STATE({
      ADDVisible:true,
      AddData:{...this.props.AddData,id:record.id, workTeamNo:record.workTeamNo,workTeamName:record.workTeamName,isEnabled:record.isEnabled}
    })
  }
  // 删除
  delete = (record) => {
    this.props.SET_STATE({
      SCVisible:true,
      id:record.id
    })
  }


  // 新增
  addBZ = () => {
    this.props.SET_STATE({
      DELVisible:true
    })
  }

  pageChange = (current) => {
    let data = {...this.props.data, currentIndex:current}
    this.props.ListWorkProcessOrder(data)
  }

  render () {

    const dataSource = [{
      key: '1',
    }, {
      key: '2',
    }];

    const columns = [{
      title: '班组编号',
      key: 'name',
      render: (record) => (
        <div>{record.workTeamNo}</div>
      )
    }, {
      title: '班组名称',
      key: 'age',
      render: (record) => (
        <div>{record.workTeamName}</div>
      )
    }, {
      title: '是否启用',
      render: (record) => (
        <div>{record.isEnabled == 1? '是':'否'}</div>
      ),
      key: 'address',
    }, {
      title: '操作',
      key: 'action',
      render: (record) => (
        <div>
          <a onClick={this.edit.bind(this,record)} href="javascript:;">编辑</a>
          <Divider type="vertical" />
          <a onClick={this.delete.bind(this, record)} href="javascript:;">删除</a>
        </div>
      )
    }];


    return (
      <div>

        <div style={{overflow:'hidden'}}>
        <p className='list-page_title'>班组管理</p>
        <Button type='primary' onClick={this.addBZ.bind(this)} style={{ float: 'right', margin:'20px, 0'}}>新增</Button>
        </div>
        <span>共{this.props.totalNumber}条</span>
        <Table
        dataSource={this.props.tabList}
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
        current={this.props.data.currentIndex}
        onChange={this.pageChange} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {ADDVisible,DELVisible,data,tabList,totalNumber, AddData} = state.team
  return {ADDVisible,DELVisible,data,tabList,totalNumber, AddData}
}

const mapDispatchToProps = (dispatch) => {
  const {SET_STATE,FindListMdmWorkTeamByPage} = dispatch.team
  return {SET_STATE,FindListMdmWorkTeamByPage}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Tab)
