import React,{Component} from 'react'
import Search from './containers/Search'
import Tab from './containers/Tab'
import {Spin} from 'antd'
import {connect} from 'react-redux'
class LookBeforeWork extends Component{
    render () {
      return (
        <div>
          <Spin spinning={this.props.loading} >
            <Search />
            <Tab />
          </Spin>
        </div>
      )
    }
}

const mapStateToProps = (state) => {
  const {loading} = state.lookbeforeWork
  return {loading}
}

const mapDispatchToProps = (dispatch) => {
  const {} = dispatch.lookbeforeWork
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps) (LookBeforeWork)
