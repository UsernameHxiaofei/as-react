import React from 'react'
import Search from './components/Search'
import Tab from './components/Tab'
import {connect} from 'react-redux'
import {Row,Col,Table,Spin} from 'antd'


class LookQueryWork extends React.Component{
   render () {
     return (
       <Spin spinning={this.props.loading}>
        <div>
         <Search />
         <Tab />
       </div>
     </Spin>
     )
   }
}

const mapStateToProps = (state) => {
  const {loading} = state.lookquerywork
  return {loading}
}

const mapDispatchToProps = (dispatch) => {
  const {} =dispatch.lookquerywork
  return {}
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LookQueryWork)
