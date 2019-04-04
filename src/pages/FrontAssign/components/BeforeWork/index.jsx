import React,{Component} from 'react'
import Search from './containers/Search'
import Tab from './containers/Tab'
import PlayCory from './containers/modal/PlayCory'
import NoUse from './containers/modal/NoUse'

class BeforeWork extends Component{
    render () {
      return (
        <div>
            <Search />
            <Tab />
            <NoUse />
            <PlayCory />
        </div>
      )
    }
}

export default BeforeWork
