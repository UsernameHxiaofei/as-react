

import React,{Component} from 'react'

import Search from './components/Search'
import Tab from './components/Tab'
import ZFmodal from './components/modal/ZFmodal'
import ZGDmodal from './components/modal/ZGDmodal'
import DYmodal from './components/modal/DYmodal'

class ValuationManagement extends Component{
  render () {
    return (
      <div>
        <p className='list-page_title'>估价单管理</p>
        <Search />
        <Tab />
        <ZFmodal /> 
        <ZGDmodal />
        <DYmodal />
      </div>
    )
  }
}

export default ValuationManagement
