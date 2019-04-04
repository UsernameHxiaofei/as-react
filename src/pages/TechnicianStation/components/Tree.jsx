import React,{Component} from 'react'
import {Tree} from 'antd'
import {connect} from 'react-redux'
const { TreeNode } = Tree
class Trees extends Component{
  componentWillMount = () => {
    this.props.GetStationList()
  }


  onSelect = (key, info) => {
    let option = this.props.workList.find((item) => {return  item.key == info.node.props.eventKey})
    if (option) {
      this.props.SET_STATE({
        Id: option.id,
        flag: true,
        spinning: true
      })
      this.props.GetEmployeeByWorkLocation(option.id)
    } else {
      this.props.SET_STATE({
        flag: false,
        Id: '',
        TabList:[]
      })
    }
    
  }


  render () {
    return (
      <div style={{float:'left'}} style={{ width:'200px', border:'1px solid #ccc'}}>
       <Tree onSelect={this.onSelect}>
        <TreeNode  title="工位" key="0-0">
            {this.props.workList.map((item, index) => {
              return (
                  <TreeNode  title={item.workLocationName} key={index} />
              )
            })}
        </TreeNode>
      </Tree>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {spinning,flag,workList,Id} = state.technicianStation
  return {spinning,flag,workList,Id}
}

const mapDispatchToProps = (dispatch) => {
  const {GetStationList,SET_STATE,GetEmployeeByWorkLocation} = dispatch.technicianStation
  return {GetStationList,SET_STATE,GetEmployeeByWorkLocation}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Trees)
