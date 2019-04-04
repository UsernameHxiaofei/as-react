import React,{Component} from 'react'
import {Tree} from 'antd'
import {connect} from 'react-redux'
const { TreeNode } = Tree
class Trees extends Component{
  componentWillMount = () => {
    this.props.FindListMdmWorkTeamNoPage()
  }


  onSelect = (key, info) => {
    let option = this.props.classList.find((item) => {return  item.key == info.node.props.eventKey})
    if (option) {
      this.props.SET_STATE({
        Id: option.id,
        flag: true,
        loading: true
      })
      this.props.FindListMdmWorkTeamEmployeeByWorkTeamId(option.id)
    } else {
      this.props.SET_STATE({
        flag: false,
        Id: '',
        tabList:[]
      })
    }
  }


  render () {
    return (
      <div style={{float:'left'}} style={{ width:'200px', border:'1px solid #ccc'}}>
       <Tree onSelect={this.onSelect}>
        <TreeNode  title="班组" key="0-0">
            {this.props.classList.map((item, index) => {
              return (
                  <TreeNode  title={item.workTeamName} key={item.key} />
              )
            })}
        </TreeNode>
      </Tree>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {loading,flag,classList,Id} = state.technicianTeam
  return {loading,flag,classList,Id}
}

const mapDispatchToProps = (dispatch) => {
  const {FindListMdmWorkTeamNoPage,SET_STATE,FindListMdmWorkTeamEmployeeByWorkTeamId} = dispatch.technicianTeam
  return {FindListMdmWorkTeamNoPage,SET_STATE,FindListMdmWorkTeamEmployeeByWorkTeamId}
}

export default connect (
  mapStateToProps,
  mapDispatchToProps
)(Trees)
