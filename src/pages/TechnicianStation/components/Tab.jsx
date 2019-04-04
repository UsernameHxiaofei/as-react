
import React,{Component} from 'react'
import {Table, Button, Spin,Divider,Pagination} from 'antd'
import {connect} from 'react-redux'

class Tab extends Component{

  // componentDidMount = () => {
  //   this.props.GetEmployeeByWorkLocation('11617f2e2b954c48aa646ef6464f7519')
  // }

  add = () => {
    if (this.props.flag === false) {
      return false
    } else {
      if (this.props.workList.length == 0) {
        message.error('暂无工位不能添加技师')
        return false
      } else {
        this.props.SET_STATE({
          addVisible:true,
          addTeacher:[]
        })
        this.props.GetTechnicianVo(this.props.data)
      }
    }
  }

  delete = () => { //删除
    if (this.props.ids == []) {
      message.error('请至少选择技师')
      return false
    }
    let id = this.props.Id
    this.props.DeleteWorkLocationEmployee(this.props.ids,id)
  }

  render () {
    const columns = [{
      title: '序号',
      key: 'name',
      width:'80px',
      render: (record) => (
        <div>{record.key + 1}</div>
      )
    }, {
      title: '部门',
      key: 'age',
      width:'200px',
      render: (record) => (
        <div>{record.empDeptName}</div>
      )
    }, {
      title: '员工工号',
      width:'200px',
      render: (record) => (
        <div>{record.empNo}</div>
      ),
      key: 'address',
    }, {
      title: '员工姓名',
      width:'200px',
      render: (record) => (
        <div>{record.empName}</div>
      ),
      key: '333333',
    },{
      title: '职务名称',
      width:'200px',
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
        <div><Button type='primary' onClick={this.add}  style={{marginRight:'20px'}}>添加技师</Button>
        <Button onClick={this.delete} type='primary'>删除技师</Button></div>
        <div style={{marginTop:'20px'}}>


        <Spin spinning={this.props.spinning}>
        <Table
        dataSource={this.props.TabList}
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
  const {workList,Id,spinning,flag,data,TabList,ids,addVisible} = state.technicianStation
  return {workList,Id,spinning,flag,data,TabList,ids,addVisible}
}

const mapDispatchToProps = (dispatch) => {
  const {GetTechnicianVo,GetEmployeeByWorkLocation,SET_STATE,DeleteWorkLocationEmployee} = dispatch.technicianStation
  return {GetTechnicianVo,GetEmployeeByWorkLocation,SET_STATE,DeleteWorkLocationEmployee}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Tab)
