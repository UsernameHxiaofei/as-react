
import React,{Component} from 'react'

import {Table,Spin,message, Button,Divider,Pagination} from 'antd'
import {connect} from 'react-redux'

class Tab extends Component{



  add = () => {
    if (this.props.flag) {
      this.props.SET_STATE({
        addVisible:true
      })
      this.props.GetTechnicianVo(this.props.data)
    } else {
      return false
    }

  }

  delete = () => { //删除
    if (this.props.ids == []) {
      message.error('请至少选择技师')
      return false
    }
    let id = this.props.Id
    this.props.DeleteListMdmWorkTeamEmployee(this.props.ids, id)
  }

  render () {

    const columns = [{
      title: '序号',
      key: 'name',
      width:'140px',
      render: (record) => (
        <div>{record.key + 1}</div>
      )
    }, {
      title: '部门',
      key: 'age',
      width:'140px',
      render: (record) => (
        <div>{record.empDeptName}</div>
      )
    }, {
      title: '员工工号',
      width:'140px',
      render: (record) => (
        <div>{record.empNo}</div>
      ),
      key: 'address',
    },{
      title: '员工姓名',
      width:'140px',
      render: (record) => (
        <div>{record.empName}</div>
      ),
      key: '333333',
    }, {
      title: '职务名称',
      width:'140px',
      render: (record) => (
        <div>{record.empDutyName}</div>
      ),
      key: '1111111',
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let ids = []
        selectedRows.map((item) => {
          ids.push(item.id)
        })
        this.props.SET_STATE({
          ids: ids
        })
      },
    }


    return (

      <div style={{float:'right'}}>
        <div><Button type='primary' onClick={this.add} style={{marginRight:'20px'}}>添加技师</Button>
        <Button onClick={this.delete} type='primary'>删除技师</Button></div>
        <div style={{marginTop:'20px'}}>
        <Spin spinning={this.props.loading}>
        <Table
        dataSource={this.props.tabList}
        columns={columns}
        bordered
        rowSelection={rowSelection}
        pagination={false}
        />
        </Spin>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {loading,flag,data,tabList,addVisible,ids,Id} = state.technicianTeam
  return {loading,flag,data,tabList,addVisible,ids,Id}
}

const mapDispatchToProps = (dispatch) => {
  const {GetTechnicianVo,FindListMdmWorkTeamEmployeeByWorkTeamId,SET_STATE,DeleteListMdmWorkTeamEmployee} = dispatch.technicianTeam
  return {GetTechnicianVo,FindListMdmWorkTeamEmployeeByWorkTeamId,SET_STATE,DeleteListMdmWorkTeamEmployee}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Tab)
