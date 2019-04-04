import React,{Component,Fragment} from 'react'
import IssueInfo from './containers/issueInfo'
import MaterialTable from './containers/materialTable'
import AddMaterial from './containers/modal/addMaterial'

class WorksheetIssue extends Component{
  render () {
    return (
      <Fragment>
        <IssueInfo />
        <MaterialTable />
        <AddMaterial />
      </Fragment>
    )
  }
}
export default WorksheetIssue