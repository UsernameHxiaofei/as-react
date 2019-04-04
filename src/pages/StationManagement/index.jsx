

import React,{Component} from 'react'
import Tab from './components/Tab'
import EDTmodals from './components/modal/AddModal'
import DeleteModals from './components/modal/DeleteModal'
import SCModal from './components/modal/SCModal'

class StationManagement extends Component{
  render () {
    return (
      <div>
        <Tab />
        <EDTmodals />
        <DeleteModals />
        <SCModal />
      </div>
    )
  }
}

export default StationManagement
