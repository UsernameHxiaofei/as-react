

import React,{Component} from 'react'

import Search from './components/Search'
import Tab from './components/Tab'
import SGmodal from './components/modal/constructModal'
import YSmodal from './components/modal/checkModal'
import CKmodal from './components/modal/lookModal' 
import DYmodal from './components/modal/printModal'
import CXmodal from './components/modal/recallModal'

class ConstructiOnorderManagement extends Component{
  render () {
    return (
      <div>
        <p className='list-page_title'>施工管理</p>
        <Search />
        <Tab />
        <SGmodal />
        <YSmodal />
        <CKmodal />
        <DYmodal />
        <CXmodal />
      </div>
    )
  }
}

export default ConstructiOnorderManagement
