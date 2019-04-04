import React,{Component} from 'react'
import Search from './containers/search'
import Tab from './containers/ShowTab'
import ETab from './containers/EditTab'
import {Spin} from 'antd'
import {connect} from 'react-redux'

class ReturnOfWorkOrders extends Component{
  render () {
    return (
      <Spin  spinning={this.props.loading} >
         <div>
        <Search />
        <Tab />
        <ETab />
      </div>
    </Spin>

    )
  }
}


const mapStateToProps = (state) => {
  const {loading} = state.returnofworkorders
  return {loading}
}

const mapDispatchToProps = (dispatch) => {
  const {} = dispatch.returnofworkorders
  return {}
}
export default connect (
  mapStateToProps,
  mapDispatchToProps
) (ReturnOfWorkOrders)
