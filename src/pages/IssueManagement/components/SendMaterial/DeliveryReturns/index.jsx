import React,{Component} from 'react'
import Top from '../Components/Top'
import Table from '../Components/Table'
class SendMaterial extends Component{
  render () {
    return (
      <div>
        <p className='list-page_title'>工单发料退库</p>
        <Top title='2'/>
        <Table title='2'/>
      </div>
    )
  }
}

export default SendMaterial
