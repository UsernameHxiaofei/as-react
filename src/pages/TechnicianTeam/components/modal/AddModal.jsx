
import React,{Component} from 'react'
import {Modal,Button, Form, Select,Table, Input, Row, Col, message,Pagination,TreeSelect} from 'antd'
import {getTechnicianVo} from '@/services/getData'
import {connect} from 'react-redux'
const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
class AddModal extends Component{

  componentWillMount = () =>  {
    this.props.GetTechnicianVo(this.props.data)
    this.props.GetMdmOrgDepartmentMstr()
    this.props.getMdmDutyMstr()
  }


  printCancel = () => { // 关闭事件
    this.props.SET_STATE({
      addVisible:false,
      data:{
        index:1,
        pageSize:10,
        keyWord:'',
        deptId:'',
        dutyId:''
      }
    })
  }

  addTeachers = () => { //确定添加事件
    if (this.props.addTeacher == []) {
      message.error('请选择技师')
      return false
    }
    let obj = {saveMdmWorkTeamEmployeeVOList:this.props.addTeacher}
    let id = this.props.Id
    this.props.BatchSaveMdmWorkTeamEmployee(obj, id)
  }


  // deptIdHandleChange = (value,option) => { //部门
  //   if (value == undefined) {
  //     this.props.SET_STATE({
  //       data:{...this.props.data, deptId:''}
  //     })
  //   } else {
  //     this.props.SET_STATE({
  //       data:{...this.props.data, deptId:value}
  //     })
  //   }
  // }

  onChange = (value) => { //部门
    if (value == undefined) {
      this.props.SET_STATE({
        data:{...this.props.data, deptId:''}
      })
    } else {
      this.props.SET_STATE({
        data:{...this.props.data, deptId:value}
      })
    }
  }

  dutyIdHandleChange = (value) => {
    if (value == undefined) {
      this.props.SET_STATE({
        data:{...this.props.data, dutyId:''}
      })
    } else {
      this.props.SET_STATE({
        data:{...this.props.data, dutyId:value}
      })
    }

  }

  keyWordChange = (e) => {
    let value = e.target.value
    this.props.SET_STATE({
      data:{...this.props.data, keyWord:value}
    })
  }

  searchTab = () => {
    let newData = {...this.props.data,index:1}
    this.props.GetTechnicianVo(newData)
  }




  showTotal = (total) => {
    return `共 ${total} 条`;
  }
  currentChange = (current) => {
    const newData = {...this.props.data,index:current};
    this.props.GetTechnicianVo(newData)
  }
  render () {

    const formLeftLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
      },
    }


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
        <div>{record.deptName }</div>
      )
    }, {
      title: '员工工号',
      width:'140px',
      render: (record) => (
        <div>{record.empNo}</div>
      ),
      key: 'address',
    },
    {
      title: '员工姓名',
      width:'140px',
      render: (record) => (
        <div>{record.empName}</div>
      ),
      key: '777',
    },
    {
      title: '职务名称',
      width:'140px',
      render: (record) => (
        <div>{record.dutyName}</div>
      ),
      key: '111',
    },{
      title: '员工状态',
      width:'140px',
      render: (record) => (
        <div>
          {record.empStatus == '0'? '在职':record.empStatus == '1'? '留职':'离职'}
        </div>
      ),
      key: '888',
    }, ]

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let arr = []
        selectedRows.map((item, index) => {
          arr.push({
            empDeptId: item.deptId,
            empDeptName: item.deptName,
            empDutyId:item.dutyId,
            empDutyName:item.dutyName,
            empId:item.empId,
            empName:item.empName,
            empNo:item.empNo,
            workTeamId:this.props.Id
          })
        })
        this.props.SET_STATE({
          addTeacher:arr
        })
      }
    }

    return (
      <Modal
                title='添加技师'
                width='850px'
                visible={this.props.addVisible}
                onCancel={this.printCancel}
                maskClosable={false}
                destroyOnClose={true}
                onOk={this.addTeachers}
                >

                 <div>
                 <Form>
                  <Row>
                    <Col span={8}>
                    <FormItem label='员工姓名/工号' {...formLeftLayout}>
                      <Input placeholder='员工姓名/工号' value={this.props.data.keyWord}  onChange={this.keyWordChange} />

              </FormItem>
                    </Col>

                    <Col span={8}>
                    <FormItem label='部门' {...formLeftLayout}>
                      {/* <Select
                      allowClear
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.deptIdHandleChange}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {this.props.deptList.map((item, index) => {
                        return <Option value={item.id}  key={index.id}>{item.deptName}</Option>
                      })}
                    </Select> */}
                     <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择部门"
                      allowClear
                      treeDefaultExpandAll
                      onChange={this.onChange}
                    >
                      {this.props.deptList.map((item, index) => {
                          return <TreeNode value={item.id} title={item.deptName} key={index}>
                                  {item.children.map((item1, index) => {
                                      return <TreeNode value={item1.id} title={item1.deptName} key={index+10}>
                                      {item1.children.map((item2, index) => {
                                        return <TreeNode value={item2.id} title={item2.deptName} key={index+20}> </TreeNode>
                                      })}
                                      </TreeNode>
                                  })}
                          </TreeNode>
                      })}
                    </TreeSelect>
              </FormItem>
                    </Col>

                    <Col span={8}>
                    <FormItem label='职务' {...formLeftLayout}>
                      <Select
                          allowClear
                          showSearch
                          placeholder="请选择"
                          optionFilterProp="children"
                          onChange={this.dutyIdHandleChange}
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                         {this.props.WZlist.map((item,index) => {
                        return <Option value={item.id}  key={index}>{item.dutyName}</Option>
                      })}
                        </Select>
              </FormItem>
                    </Col>

                    </Row>


                  </Form>

                  <Button onClick={this.searchTab} type='primary'>查询</Button>

                   <Table
                    dataSource={this.props.teacherList}
                    columns={columns}
                    bordered
                    rowSelection={rowSelection}
                    pagination={false}
                    />

                    <div style={{textAlign:'center', marginTop:'10px'}}>
                      <Pagination
                      size="small"
                      total={this.props.totalNumber}
                      showQuickJumper
                      showTotal={this.showTotal}
                      pageSize={this.props.data.pageSize}
                      current={this.props.data.index}
                      onChange={this.currentChange}/>
                    </div>
                 </div>

            </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const {flag,addVisible,data,teacherList,totalNumber,deptList,WZlist,addTeacher,Id} = state.technicianTeam
  return {flag,addVisible,data,teacherList,totalNumber,deptList,WZlist,addTeacher,Id}
}

const mapDispatchToPros = (dispatch) => {
  const {SET_STATE,GetTechnicianVo,GetMdmOrgDepartmentMstr,getMdmDutyMstr,BatchSaveMdmWorkTeamEmployee} = dispatch.technicianTeam
  return {SET_STATE,GetTechnicianVo,GetMdmOrgDepartmentMstr,getMdmDutyMstr,BatchSaveMdmWorkTeamEmployee}
}

export default connect(
  mapStateToProps,
  mapDispatchToPros
)(AddModal)
