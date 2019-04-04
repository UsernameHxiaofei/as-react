import React,{Component} from 'react'
import Search from './containers/Search'
import Tab from './containers/Tab'
import MoneySend from './containers/modal/MoneySend'
import NoUse from './containers/modal/NoUse'
import PlayCory from './containers/modal/PlayCory'
import Math from './containers/modal/Math'
import MathTrue from './containers/modal/MathTrue'

class DecorationWorkOrderManagement extends Component{
  render () {
    return (
      <div>
        <Search />
        <Tab />
        <MoneySend />
        <NoUse />
        <PlayCory />
        <Math />
        <MathTrue />
      </div>
    )
  }
}



export default DecorationWorkOrderManagement
