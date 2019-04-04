// import FrontAssignOrder from './frontWork(1)'; //前装工单
// export {
//   FrontAssignOrder,
// };
import React,{Component,Fragment} from 'react'
import AssignOrder from './frontAssignOrder'

class FrontAssignOrder extends Component{
  render () {
    return (
      <Fragment>
        <AssignOrder />
      </Fragment>
    )
  }
}
export default FrontAssignOrder
