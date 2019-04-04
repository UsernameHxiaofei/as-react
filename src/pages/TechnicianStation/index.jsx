import React,{Component} from 'react'
import Tab from './components/Tab'
import Trees from './components/Tree'
import AddModal from './components//modal/AddModal'

class TechnicianStation extends Component{
  render () {
    return (
      <div>
        <p className='list-page_title'>技师工位</p>
          <Tab />
          <Trees />
        <AddModal />
      </div>
    )
  }
}

export default TechnicianStation

