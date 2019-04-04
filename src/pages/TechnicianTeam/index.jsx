import React,{Component} from 'react'
import Tab from './components/Tab'
import Trees from './components/Tree'
import AddModal from './components//modal/AddModal'

class TechnicianTeam extends Component{
  render () {
    return (
      <div>
        <p className='list-page_title'>技师班组</p>
       <div>
        <Tab />
          <Trees />
       </div>
        <AddModal />
      </div>
    )
  }
}

export default TechnicianTeam

