

import React,{Component} from 'react'
import Tab from './Components/Tab'
import ADDmodal from './Components/modal/ADDmodal'
import EDTmodal from './Components/modal/EDTmodal'
import SCmodal from './Components/modal/SCmodal'

class Team extends Component{
  render () {
    return (
      <div>
        <Tab />
        <ADDmodal />
        <EDTmodal />
        <SCmodal />
      </div>
    )
  }
}

export default Team
